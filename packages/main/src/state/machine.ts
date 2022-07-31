import { mkdir, writeFile } from 'fs/promises';
import glob from 'glob';
import sharp from 'sharp';
import path from 'path';
import { assign, createMachine } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import { MEDIA_PATH } from '../constants';

import photoImg from '@pb/images/photo.png';
import quad from '@pb/images/quad.png';
import quadtych from '@pb/images/quadtych.png';
import collage from '@pb/images/collage.png';
import randomCollage from '@pb/images/random.png';
import done from '@pb/images/done.png';
import videoImg from '@pb/images/video.png';
import rec from '@pb/images/record.png';
import stop from '@pb/images/stop.png';
import help from '@pb/images/help.png';
import back from '@pb/images/back.png';

const images = {
  photo: photoImg,
  quad,
  quadtych,
  collage,
  random: randomCollage,
  done,
  video: videoImg,
  rec,
  stop,
  back,
  help,
} as const;

const defaultPhotoType = 'quad';

type Key = keyof typeof images;
type KeyAction = { key: Key; type: string; description?: string } | null;

export interface Context {
  keys: [KeyAction, KeyAction, KeyAction, KeyAction, KeyAction, KeyAction];
  lastVideo: string | void;
  photoType: string;
  photos: Array<string>;
  mediaPath: string;
  streamdeck: StreamDeck | null;
}

const initialKeys: Array<KeyAction> = [
  { key: 'photo', type: 'TAKE_PHOTOS', description: 'Take photos' },
  null,
  { key: 'video', type: 'REC_VIDEO', description: 'Leave a video message' },
  null,
  { key: 'help', type: 'GET_HELP' },
  null,
];

const selectTimeoutMs = 30_000;
const saveTimeoutMs = 45_000;
const reviewTimeoutMs = 30_000;
const helpTimeoutMs = 30_000;
const videoReviewTimeoutMs = 30_000;

const blankKeys = () => [null, null, null, null, null, null];

const keyCache = new Map<Key, Buffer>();

function getPhotos(mediaPath: string) {
  const images = glob.sync(path.join(mediaPath, '*.jpg'));
  return images.map((filepath) => path.basename(filepath));
}

// https://stately.ai/viz/96da6066-02dc-448e-a9f9-7a8511767b31

export const machine = createMachine(
  {
    id: 'photobooth',
    initial: 'setup',
    // eslint-disable-next-line
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
    },
    context: {
      keys: initialKeys,
      lastVideo: undefined,
      photoType: defaultPhotoType,
      photos: [] as Array<string>,
      mediaPath: MEDIA_PATH,
      streamdeck: null,
    } as Context,
    states: {
      setup: {
        on: {
          INIT: 'main',
        },
        exit: [
          assign({
            mediaPath: (context: Context, event) =>
              // @ts-ignore don't worry about it
              event.data?.mediaPath || context.mediaPath,
            photos: (context: Context, event) => {
              // @ts-ignore don't worry about it
              const mediaPath = event.data?.mediaPath || context.mediaPath;
              return getPhotos(mediaPath);
            },
            streamdeck: (context: Context, event) =>
              // @ts-ignore don't worry about it
              event.data?.streamdeck || context.streamdeck,
          }),
        ],
      },
      main: {
        initial: 'normal',
        states: {
          normal: {
            entry: [assign({ keys: () => initialKeys, lastVideo: () => undefined }), 'renderKeys'],
          },
          help: {
            after: { [helpTimeoutMs]: 'normal' },
            on: {
              GET_HELP: { target: 'normal' },
            },
          },
          preferences: {
            entry: [assign({ keys: blankKeys() }), 'renderKeys'],
            on: {
              DONE: 'normal',
            },
          },
        },
        on: {
          TAKE_PHOTOS: { target: 'photo' },
          REC_VIDEO: { target: 'video' },
          GET_HELP: { target: '.help' },
        },
      },
      photo: {
        initial: 'confirming',
        exit: [assign({ photoType: defaultPhotoType })],
        states: {
          confirming: {
            entry: [
              assign({
                keys: () => [
                  { key: 'rec', type: 'CONFIRM', description: 'Begin' },
                  null,
                  null,
                  null,
                  null,
                  { key: 'back', type: 'CANCEL' },
                ],
              }),
              'renderKeys',
            ],
            on: {
              CONFIRM: 'capturing',
              CANCEL: 'done',
            },
            after: { [selectTimeoutMs]: 'done' },
          },
          capturing: {
            entry: [
              assign({
                keys: blankKeys,
              }),
              'renderKeys',
            ],
            on: {
              DONE: 'reviewing',
            },
          },
          reviewing: {
            initial: 'selecting',
            states: {
              selecting: {
                entry: [
                  assign({
                    keys: () => [
                      { key: 'quad', type: 'SELECT' },
                      { key: 'quadtych', type: 'SELECT' },
                      { key: 'collage', type: 'SELECT' },
                      { key: 'random', type: 'SELECT' },
                      null,
                      { key: 'done', type: 'DONE', description: 'Save your collage' },
                    ],
                  }),
                  'renderKeys',
                ],
                on: {
                  SELECT: {
                    actions: [
                      assign({
                        photoType: (context: Context, event) => {
                          // @ts-ignore don't worry about it
                          if (event && typeof event.key === 'string') {
                            // @ts-ignore don't worry about it
                            return event.key;
                          }
                          return context.photoType;
                        },
                      }),
                    ],
                  },
                  DONE: {
                    target: 'saving',
                  },
                },
                after: { [saveTimeoutMs]: 'saving' },
              },
              saving: {
                entry: [assign({ keys: blankKeys }), 'renderKeys'],
                on: {
                  DONE: {
                    target: '#photobooth.photo.saving',
                  },
                },
              },
            },
          },
          saving: {
            entry: [
              assign({
                // @ts-ignore
                keys: blankKeys,
                photos: (context: Context, event) => [
                  ...context.photos,
                  // @ts-ignore
                  event.filename,
                ],
              }),
              'renderKeys',
            ],
            invoke: {
              src: 'saveMedia',
              onDone: 'complete',
            },
          },
          complete: {
            entry: [assign({ keys: [null, null, null, null, null, { key: 'done', type: 'DONE' }] }), 'renderKeys'],
            on: { DONE: 'done' },
            after: { [reviewTimeoutMs]: 'done' },
          },
          done: { type: 'final' },
        },
        onDone: 'main',
      },
      video: {
        initial: 'confirming',
        states: {
          confirming: {
            entry: [
              assign({
                keys: () => [
                  { key: 'rec', type: 'CONFIRM', description: 'Record' },
                  null,
                  null,
                  null,
                  null,
                  { key: 'back', type: 'CANCEL' },
                ],
              }),
              'renderKeys',
            ],
            on: {
              CONFIRM: 'recording',
              CANCEL: 'done',
            },
            after: { [selectTimeoutMs]: 'done' },
          },
          recording: {
            initial: 'readying',
            states: {
              readying: {
                entry: [assign({ keys: blankKeys }), 'renderKeys'],
                on: {
                  DONE: 'recording',
                },
              },
              recording: {
                entry: [
                  assign({
                    keys: () => [
                      null,
                      null,
                      null,
                      null,
                      null,
                      { key: 'stop', type: 'DONE', description: 'Stop recording' },
                    ],
                  }),
                  'renderKeys',
                ],
                on: { DONE: 'saving' },
              },
              saving: {
                entry: [
                  assign({
                    keys: blankKeys,
                  }),
                  'renderKeys',
                ],
                on: {
                  DONE: {
                    target: '#photobooth.video.saving',
                  },
                },
              },
            },
          },
          saving: {
            entry: [
              assign({
                keys: blankKeys,
                lastVideo: (context, event) =>
                  // @ts-ignore
                  event.filename,
              }),
              'renderKeys',
            ],
            invoke: {
              src: 'saveMedia',
              onDone: 'reviewing',
            },
          },
          reviewing: {
            entry: [
              assign({
                keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
              }),
              'renderKeys',
            ],
            after: { [videoReviewTimeoutMs]: 'done' },
            on: { DONE: 'done' },
          },
          done: { type: 'final' },
        },
        onDone: 'main',
      },
    },
    on: {
      PREFERENCES: { target: '#photobooth.main.preferences' },
      SET_CONTEXT: {
        actions: [
          assign({
            mediaPath: (context, event) =>
              // @ts-ignore
              event.data.mediaPath || context.mediaPath,
            photos: (context: Context, event) => {
              // @ts-ignore don't worry about it
              const mediaPath = event.data?.mediaPath || context.mediaPath;
              return getPhotos(mediaPath);
            },
          }),
        ],
      },
    },
  },
  {
    actions: {
      renderKeys: async (context) => {
        const { keys, streamdeck } = context;
        if (!streamdeck) {
          throw new Error('Must set streamdeck context before rendering');
        }

        for (let i = 0; i < keys.length; i++) {
          const { key } = keys[i] || {};
          if (!key) {
            streamdeck.clearKey(i);
            continue;
          }

          try {
            if (!keyCache.has(key)) {
              const buffer = await sharp(path.resolve(__dirname, images[key]))
                .flatten()
                .resize(streamdeck.ICON_SIZE, streamdeck.ICON_SIZE)
                .raw()
                .toBuffer();
              keyCache.set(key, buffer);
            }

            streamdeck.fillKeyBuffer(i, keyCache.get(key)!);
          } catch (e) {
            streamdeck.clearKey(i);
          }
        }
      },
    },
    services: {
      saveMedia: async (context: Context, event: { data: ArrayBuffer; filename: string }) => {
        if (!event.data || !event.filename) {
          throw new Error('No file to save');
        }
        const buffer = new Buffer(event.data);
        const localPath = path.join(context.mediaPath, event.filename);
        await mkdir(path.dirname(localPath), { recursive: true });
        await writeFile(localPath, buffer, 'binary');
      },
    },
  }
);
