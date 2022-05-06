import { interpret } from 'xstate';
import type { StreamDeck } from '@elgato-stream-deck/node';
import { openStreamDeck } from '@elgato-stream-deck/node';
import { makeMachine } from './machine';

export async function run() {
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
    console.log(state.value);
    console.log(state.context);
  });

  return deck;
}

export async function stop(deck: StreamDeck) {
  await deck.clearPanel();
  await deck.close();
}
