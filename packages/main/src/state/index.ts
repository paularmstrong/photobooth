import { ipcMain } from 'electron';
import type { WebContents } from 'electron';
import { interpret } from 'xstate';
import type { InterpreterFrom } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import { openStreamDeck } from '@elgato-stream-deck/node';
import { machine } from './machine';

export type Service = InterpreterFrom<typeof machine>;

export async function setup(webContents: WebContents) {
  const deck = await openStreamDeck();

  deck.clearPanel();

  const service = interpret(machine);
  service.start();
  service.send({ type: 'INIT', data: deck });

  deck.on('up', (keyIndex: number) => {
    const action = service.state.context.keys[keyIndex];
    if (!action) {
      return;
    }
    service.send(action);
  });

  service.onTransition((state) => {
    const { streamdeck, keys, ...meta } = state.context;
    webContents.send('transition', { value: state.toStrings(), meta });
  });

  ipcMain.on('transition', (event, action) => {
    service.send(action);
  });

  return {
    service,
    stop: async function stopService() {
      return await stop(deck);
    },
  };
}

export async function stop(deck: StreamDeck) {
  try {
    await deck.clearPanel();
  } catch (e) {}
  try {
    await deck.close();
  } catch (e) {}
}
