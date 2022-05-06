import jimp from 'jimp';
import path from 'path';
import type { StreamDeck } from '@elgato-stream-deck/node';
import { openStreamDeck } from '@elgato-stream-deck/node';
import { machine } from './machine';

import photo from './img/photo.jpg';
import video from './img/video.jpg';
import help from './img/help.jpg';
import back from './img/back.jpg';

const images: Record<string, string> = {
  photo,
  video,
  back,
  help,
};

export async function run(onKeypress: (key: number) => void) {
  const deck = await openStreamDeck();

  deck.clearPanel();

  deck.on('up', onKeypress);

  const { keys } = machine.context;
  for (let i = 0; i < keys.length; i++) {
    const keyname = keys[i];
    if (!keyname) {
      deck.clearKey(i);
      continue;
    }

    const bmpImg = await jimp.read(path.resolve(__dirname, images[keyname]));
    const resized = await bmpImg.resize(deck.ICON_SIZE, deck.ICON_SIZE);

    deck.fillKeyBuffer(i, resized.bitmap.data, { format: 'rgba' });
  }

  return deck;
}

export async function stop(deck: StreamDeck) {
  await deck.clearPanel();
  await deck.close();
}
