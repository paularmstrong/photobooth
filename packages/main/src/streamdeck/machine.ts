import jimp from 'jimp';
import path from 'path';
import { assign, createMachine } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import type { Typegen0 } from './machine.typegen';

import { media, photo, usb, video, wait, webcam } from '../gopro';

import photoImg from './img/photo.png';
import quad from './img/quad.png';
import quadrytch from './img/quadrytch.png';
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
  quadrytch,
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
  images: Array<string> | void;
  video: string | void;
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
const reviewTimeoutMs = 30_000;
const helpTimeoutMs = 30_000;

// https://stately.ai/viz/96da6066-02dc-448e-a9f9-7a8511767b31

export const makeMachine = (streamdeck: StreamDeck) =>
  createMachine(
    {
      id: 'streamdeck',
      initial: 'main',
      tsTypes: {} as Typegen0,
      schema: {
        context: {} as Context,
      },
      context: {
        keys: initialKeys,
        photoType: undefined,
        images: undefined,
        video: undefined,
        streamdeck,
      } as Context,
      states: {
        main: {
          initial: 'normal',
          invoke: {
            src: async function swapToWebcamMode() {
              // await usb.takeControl();
              await webcam.start();
            },
          },
          entry: [
            assign({
              keys: () => initialKeys,
            }),
            'render',
          ],
          states: {
            normal: {},
            help: {
              after: {
                [helpTimeoutMs]: 'normal',
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
          initial: 'selecting',
          exit: [assign({ photoType: undefined, images: undefined })],
          states: {
            selecting: {
              entry: [
                assign({
                  keys: () => [
                    { key: 'quad', type: 'SELECT' },
                    { key: 'quadrytch', type: 'SELECT' },
                    { key: 'collage', type: 'SELECT' },
                    null,
                    null,
                    { key: 'back', type: 'CANCEL' },
                  ],
                }),
                'render',
              ],
              on: {
                SELECT: { target: 'readying', actions: 'selectPhotoType' },
                CANCEL: 'done',
              },
              after: {
                [selectTimeoutMs]: 'done',
              },
            },
            readying: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, null],
                }),
                'render',
              ],
              invoke: {
                // TODO: this needs to complete before <Readying /> is allowed to say DONE
                src: async function swapToPhotoMode() {
                  await webcam.stop();
                  // await usb.takeControl();
                  await photo.setMode();
                },
                onDone: 'capturing',
              },
            },
            capturing: {
              initial: 'zero',
              states: {
                zero: {
                  on: {
                    DONE: 'one',
                  },
                },
                one: {
                  invoke: {
                    src: async function takePhoto() {
                      await photo.take();
                    },
                  },
                  on: {
                    DONE: 'two',
                  },
                },
                two: {
                  invoke: {
                    src: async function takePhoto() {
                      await photo.take();
                    },
                  },
                  on: {
                    DONE: 'three',
                  },
                },
                three: {
                  invoke: {
                    src: async function takePhoto() {
                      await photo.take();
                    },
                  },
                  on: {
                    DONE: 'four',
                  },
                },
                four: {
                  invoke: {
                    src: async function takePhoto() {
                      await photo.take();
                    },
                    onDone: 'done',
                  },
                },
                done: {
                  type: 'final',
                },
              },
              onDone: 'reviewing',
            },
            reviewing: {
              invoke: {
                src: async function downloadPhotos() {
                  await wait(1_000);
                  // await usb.releaseControl();
                  await webcam.start();

                  const images = await media.getItems(-4);
                  const imagePaths = [];
                  for (const image of images) {
                    imagePaths.push(await media.download(image));
                  }

                  return imagePaths;
                },
                onDone: {
                  actions: [
                    assign({
                      images: (context, event) => {
                        // @ts-ignore missing from types
                        return event.data;
                      },
                    }),
                  ],
                },
              },
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
                }),
                'render',
              ],
              after: {
                [reviewTimeoutMs]: 'done',
              },
              on: {
                DONE: 'done',
              },
            },
            done: {
              type: 'final',
            },
          },
          onDone: {
            target: 'main',
          },
        },
        video: {
          initial: 'selecting',
          exit: [assign({ video: undefined })],
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
              after: {
                [selectTimeoutMs]: 'done',
              },
            },
            readying: {
              invoke: {
                src: async function swapToVideoMode() {
                  try {
                    await webcam.stop();
                  } catch (e) {}
                  // await usb.takeControl();
                  await video.setMode();
                },
                onDone: 'recording',
              },
              entry: [assign({ keys: () => [null, null, null, null, null, null] }), 'render'],
            },
            recording: {
              invoke: {
                src: async function record() {
                  await video.startRecord();
                },
              },
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'stop', type: 'DONE' }],
                }),
                'render',
              ],
              on: {
                DONE: 'reviewing',
              },
            },
            reviewing: {
              invoke: {
                src: async function downloadVideo() {
                  await video.stopRecord();
                  await wait(1_000);
                  // await usb.releaseControl();
                  await webcam.start();

                  const videoPath = await media.getItems(-1);
                  return await media.download(videoPath[0]);
                },
                onDone: {
                  actions: [
                    assign({
                      video: (context, event) => {
                        // @ts-ignore missing from types
                        return event.data;
                      },
                    }),
                  ],
                },
              },
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
                }),
                'render',
              ],
              after: {
                [reviewTimeoutMs]: 'done',
              },
              on: {
                DONE: 'done',
              },
            },
            done: {
              type: 'final',
            },
          },
          onDone: {
            target: 'main',
          },
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
      },
    }
  );
