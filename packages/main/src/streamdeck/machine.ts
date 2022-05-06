import jimp from 'jimp';
import path from 'path';
import { assign, createMachine } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import type { Typegen0 } from './machine.typegen';

import photo from './img/photo.png';
import quad from './img/quad.png';
import quadrytch from './img/quadrytch.png';
import collage from './img/collage.png';
import done from './img/done.png';
import video from './img/video.png';
import sec5 from './img/5.png';
import sec10 from './img/10.png';
import sec15 from './img/15.png';
import help from './img/help.png';
import back from './img/back.png';

const images = {
  photo,
  quad,
  quadrytch,
  collage,
  done,
  video,
  5: sec5,
  10: sec10,
  15: sec15,
  back,
  help,
} as const;

type Key = keyof typeof images;
type KeyAction = { key: Key; type: string } | null;

interface Context {
  keys: [KeyAction, KeyAction, KeyAction, KeyAction, KeyAction, KeyAction];
  photoType: string | void;
  recLength: number | void;
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
        recLength: undefined,
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
              after: {
                20000: 'normal',
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
          exit: [assign({ photoType: undefined })],
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
                SELECT: { target: 'capturing', actions: 'selectPhotoType' },
                CANCEL: 'done',
              },
            },
            capturing: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }],
                }),
                'render',
              ],
              on: {
                DONE: 'reviewing',
              },
            },
            reviewing: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
                }),
                'render',
              ],
              after: {
                15000: 'done',
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
          exit: [assign({ recLength: undefined })],
          states: {
            selecting: {
              entry: [
                assign({
                  keys: () => [
                    { key: '5', type: 'SELECT' },
                    { key: '10', type: 'SELECT' },
                    { key: '15', type: 'SELECT' },
                    null,
                    null,
                    { key: 'back', type: 'CANCEL' },
                  ],
                }),
                'render',
              ],
              on: {
                SELECT: { target: 'recording', actions: 'selectRecordingLength' },
                CANCEL: 'done',
              },
            },
            recording: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }],
                }),
                'render',
              ],
              on: {
                DONE: 'reviewing',
              },
            },
            reviewing: {
              entry: [
                assign({
                  keys: () => [null, null, null, null, null, { key: 'done', type: 'DONE' }],
                }),
                'render',
              ],
              after: {
                15000: 'done',
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

        selectRecordingLength: (context: Context, event: { key: string }) => {
          if (event && typeof event.key === 'string') {
            context.recLength = parseInt(event.key, 10);
          }
        },
      },
    }
  );
