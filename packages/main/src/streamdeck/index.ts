import type { WebContents } from 'electron';
import { interpret } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import { openStreamDeck } from '@elgato-stream-deck/node';
import { makeMachine } from './machine';

export async function run(webContents: WebContents) {
  const deck = await openStreamDeck();

  deck.clearPanel();

  const machine = makeMachine(deck);
  const service = interpret(machine);
  service.start();

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

  return deck;
}

export async function stop(deck: StreamDeck) {
  try {
    await deck.clearPanel();
  } catch (e) {}
  try {
    await deck.close();
  } catch (e) {}
}
