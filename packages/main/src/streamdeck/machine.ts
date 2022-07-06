import { app } from 'electron';
import { mkdir, writeFile } from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { assign, createMachine } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';

import photoImg from './img/photo.png';
import quad from './img/quad.png';
import quadtych from './img/quadtych.png';
import collage from './img/collage.png';
import done from './img/done.png';
import videoImg from './img/video.png';
import rec from './img/record.png';
import stop from './img/stop.png';
import help from './img/help.png';
import back from './img/back.png';

const images = {
  photo: photoImg,
  quad,
  quadtych,
  collage,
  done,
  video: videoImg,
  rec,
  stop,
  back,
  help,
} as const;

type Key = keyof typeof images;
type KeyAction = { key: Key; type: string } | null;

interface Context {
  keys: [KeyAction, KeyAction, KeyAction, KeyAction, KeyAction, KeyAction];
  photoType: string | void;
  streamdeck: StreamDeck;
}

const initialKeys = [
  {
    key: 'photo',
    type: 'TAKE_PHOTOS',
  },
  null,
  { key: 'video', type: 'REC_VIDEO' },
  null,
  { key: 'help', type: 'GET_HELP' },
  null,
];

const selectTimeoutMs = 30_000;
const reviewTimeoutMs = 45_000;
const helpTimeoutMs = 30_000;
const videoReviewTimeoutMs = 30_000;

const blankKeys = () => [null, null, null, null, null, null];

// https://stately.ai/viz/96da6066-02dc-448e-a9f9-7a8511767b31

export const makeMachine = (streamdeck: StreamDeck) =>
  createMachine(
    {
      id: 'streamdeck',
      initial: 'main',
      // eslint-disable-next-line
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as Context,
      },
      context: {
        keys: initialKeys,
        photoType: undefined,
        streamdeck,
      } as Context,
      states: {
        main: {
          initial: 'normal',
          entry: [
            assign({
              keys: () => initialKeys,
            }),
            'render',
          ],
          states: {
            normal: {},
            help: {
              after: { [helpTimeoutMs]: 'normal' },
            },
          },
          on: {
            TAKE_PHOTOS: { target: 'photo' },
            REC_VIDEO: { target: 'video' },
            GET_HELP: { target: '.help' },
          },
        },
        photo: {
          initial: 'selecting',
          exit: [assign({ photoType: undefined, images: undefined })],
          states: {
            selecting: {
              entry: [
                assign({
                  keys: () => [{ key: 'rec', type: 'SELECT' }, null, null, null, null, { key: 'back', type: 'CANCEL' }],
                }),
                'render',
              ],
              on: {
                SELECT: 'capturing',
                CANCEL: 'done',
              },
              after: { [selectTimeoutMs]: 'done' },
            },
            capturing: {
              initial: 'zero',
              entry: [
                assign({
                  keys: blankKeys,
                }),
                'render',
              ],
              states: {
                zero: {
                  on: { DONE: 'one' },
                },
                one: {
                  on: { DONE: 'two' },
                },
                two: {
                  on: { DONE: 'three' },
                },
                three: {
                  on: { DONE: 'done' },
                },
                done: {
                  type: 'final',
                },
              },
              onDone: 'reviewing',
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
                        null,
                        null,
                        { key: 'done', type: 'DONE' },
                      ],
                    }),
                    'render',
                  ],
                  on: {
                    SELECT: { actions: 'selectPhotoType' },
                    DONE: 'saving',
                  },
                  after: {
                    [reviewTimeoutMs]: 'saving',
                  },
                },
                saving: {
                  entry: [assign({ keys: blankKeys }), 'render'],
                  on: {
                    DONE: { target: 'done', actions: 'saveMedia' },
                  },
                },
                done: {
                  type: 'final',
                },
              },
              onDone: 'done',
            },
            done: {
              type: 'final',
            },
          },
          onDone: 'main',
        },
        video: {
          initial: 'selecting',
          states: {
            selecting: {
              entry: [
                assign({
                  keys: () => [{ key: 'rec', type: 'SELECT' }, null, null, null, null, { key: 'back', type: 'CANCEL' }],
                }),
                'render',
              ],
              on: {
                SELECT: 'readying',
                CANCEL: 'done',
              },
              after: { [selectTimeoutMs]: 'done' },
            },
            readying: {
              entry: [assign({ keys: blankKeys }), 'render'],
              on: {
                DONE: 'recording',
              },
            },
            recording: {
              initial: 'recording',
              states: {
                recording: {
                  entry: [
                    assign({
                      keys: () => [null, null, null, null, null, { key: 'stop', type: 'DONE' }],
                    }),
                    'render',
                  ],
                  on: { DONE: 'saving' },
                },
                saving: {
                  entry: [assign({ keys: blankKeys }), 'render'],
                  on: {
                    DONE: { target: 'done', actions: 'saveMedia' },
                  },
                },
                done: { type: 'final' },
              },
              onDone: 'reviewing',
            },
            reviewing: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
                }),
                'render',
              ],
              after: { [videoReviewTimeoutMs]: 'done' },
              on: { DONE: 'done' },
            },
            done: { type: 'final' },
          },
          onDone: 'main',
        },
      },
    },
    {
      actions: {
        render: async (context) => {
          const { keys, streamdeck } = context;
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!key) {
              streamdeck.clearKey(i);
              continue;
            }

            const bmpImg = await jimp.read(path.resolve(__dirname, images[key.key]));
            const resized = bmpImg.resize(streamdeck.ICON_SIZE, streamdeck.ICON_SIZE);
            streamdeck.fillKeyBuffer(i, resized.bitmap.data, { format: 'rgba' });
          }
        },

        selectPhotoType: (context: Context, event: { key: string }) => {
          if (event && typeof event.key === 'string') {
            context.photoType = event.key;
          }
        },

        saveMedia: async (context: Context, event: { data: ArrayBuffer; filename: string }) => {
          if (!event.data || !event.filename) {
            throw new Error('No file to save');
          }
          const buffer = new Buffer(event.data);
          const localPath = `${app.getPath('appData')}/PhotoBooth/image_cache/${event.filename}`;
          await mkdir(path.dirname(localPath), { recursive: true });
          await writeFile(localPath, buffer, 'binary');
        },
      },
    }
  );
