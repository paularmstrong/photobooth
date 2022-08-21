import path from 'path';
import { dialog, ipcMain, protocol } from 'electron';
import type { WebContents } from 'electron';
import EStore from 'electron-store';
import { MEDIA_PATH } from './constants';

export interface Preferences {
  mediaPath: string;
  photoboothUrl: string;
  splashTitle: string;
  videoSaveMessage: string;
}

export type Store = EStore<Preferences>;

export function initStore() {
  const store = new EStore<Preferences>({
    defaults: {
      mediaPath: MEDIA_PATH,
      photoboothUrl: 'https://example.com',
      splashTitle: 'Photo Booth',
      videoSaveMessage: 'Your video has been saved to our guestbook. We look forward to watching it soon!',
    },
    schema: {
      mediaPath: {
        type: 'string',
      },
      photoboothUrl: {
        type: 'string',
        format: 'uri',
      },
      videoSaveMessage: {
        type: 'string',
      },
      splashTitle: {
        type: 'string',
      },
    },
  });

  protocol.registerFileProtocol('pb', (request, callback) => {
    const file = request.url.substr(3);
    try {
      callback({ path: path.join(store.get('mediaPath'), file) });
    } catch (e) {
      console.error('pb error', e);
    }
  });

  ipcMain.on('selectMediaPath', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: store.get('mediaPath'),
      properties: ['openDirectory', 'createDirectory'],
    });
    if (canceled) {
      return;
    }
    store.set('mediaPath', filePaths[0]);
  });

  return store;
}

export function registerStoreHandlers(store: Store, webContents: WebContents) {
  webContents.send('preferences', store.store);

  ipcMain.on('preferences', (event, data) => {
    for (const [key, value] of Object.entries(data)) {
      try {
        store.set(key, value);
      } catch (e) {
        console.warn(e);
      }
    }
    webContents.send('preferences', store.store);
  });

  store.onDidAnyChange((newValue) => {
    webContents.send('preferences', newValue);
  });
}
