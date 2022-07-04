import { app, ipcMain } from 'electron';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
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

  ipcMain.on('transition', (event, action) => {
    service.send(action);
  });

  ipcMain.on('video', async (event, { data }) => {
    const buffer = new Buffer(data);
    const localPath = `${app.getPath('appData')}/gopro-photobooth/image_cache/video.webm`;
    await mkdir(path.dirname(localPath), { recursive: true });
    await writeFile(localPath, buffer, 'binary');
  });

  ipcMain.on('photo', async (event, { data }) => {
    const buffer = new Buffer(data);
    const localPath = `${app.getPath('appData')}/gopro-photobooth/image_cache/photo.jpg`;
    await mkdir(path.dirname(localPath), { recursive: true });
    await writeFile(localPath, buffer, 'binary');
  });

  return async function stopService() {
    return await stop(deck);
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
