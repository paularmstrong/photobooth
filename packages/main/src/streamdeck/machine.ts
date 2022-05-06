import jimp from 'jimp';
import path from 'path';
import { assign, createMachine } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import type { Typegen0 } from './machine.typegen';

import photo from './img/photo.jpg';
import video from './img/video.jpg';
import help from './img/help.jpg';
import back from './img/back.jpg';

const images = {
  photo,
  video,
  back,
  help,
} as const;

type Key = keyof typeof images;
type KeyAction = { key: Key; type: string } | null;

interface Context {
  keys: [KeyAction, KeyAction, KeyAction, KeyAction, KeyAction, KeyAction];
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
        streamdeck,
      } as Context,
      states: {
        main: {
          entry: [
            assign({
              keys: () => initialKeys,
            }),
            'render',
          ],
          on: {
            TAKE_PHOTOS: { target: 'photo' },
            REC_VIDEO: { target: 'video' },
            GET_HELP: { target: 'help' },
            DONE: { target: 'main' },
          },
        },
        photo: {
          initial: 'selecting',
          states: {
            selecting: {
              entry: [
                assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'CANCEL' }] }),
                'render',
              ],
              on: {
                SELECT: 'capturing',
                CANCEL: 'done',
              },
            },
            capturing: {
              entry: [assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }] }), 'render'],
              on: {
                DONE: 'reviewing',
              },
            },
            reviewing: {
              entry: [assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }] }), 'render'],
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
          states: {
            selecting: {
              entry: [
                assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'CANCEL' }] }),
                'render',
              ],
              on: {
                SELECT: 'recording',
                CANCEL: 'done',
              },
            },
            recording: {
              entry: [assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }] }), 'render'],
              on: {
                DONE: 'reviewing',
              },
            },
            reviewing: {
              entry: [assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }] }), 'render'],
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
        help: {
          entry: [assign({ keys: () => [null, null, null, null, null, { key: 'back', type: 'DONE' }] }), 'render'],
          on: {
            DONE: 'main',
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
            const resized = await bmpImg.resize(streamdeck.ICON_SIZE, streamdeck.ICON_SIZE);
            streamdeck.fillKeyBuffer(i, resized.bitmap.data, { format: 'rgba' });
          }
        },
      },
    }
  );
