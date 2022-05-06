import { createMachine } from 'xstate';
import type { Typegen0 } from './machine.typegen';

type Key = string | null;

interface Context {
  keys: [Key, Key, Key, Key, Key, Key];
}

export const machine = createMachine({
  id: 'streamdeck',
  initial: 'main',
  tsTypes: {} as Typegen0,
  context: {
    keys: ['photo', null, 'video', null, 'help', 'back'],
  } as Context,
  states: {
    main: {
      on: {
        TAKE_PHOTOS: 'photo',
        REC_VIDEO: 'video',
        GET_HELP: 'help',
      },
    },
    photo: {
      initial: 'selecting',
      states: {
        selecting: {
          on: {
            SELECT: 'capturing',
            CANCEL: 'done',
          },
        },
        capturing: {
          on: {
            DONE: 'reviewing',
          },
        },
        reviewing: {
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
          on: {
            SELECT: 'recording',
            CANCEL: 'done',
          },
        },
        recording: {
          on: {
            DONE: 'reviewing',
          },
        },
        reviewing: {
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
      on: {
        DONE: 'main',
      },
    },
  },
});
