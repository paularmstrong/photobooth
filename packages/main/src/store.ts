import { ipcMain } from 'electron';
import type { WebContents } from 'electron';
import Store from 'electron-store';

export interface Preferences {
  photoboothUrl: string;
  videoSaveMessage: string;
}

export function initStore(webContents: WebContents) {
  const store = new Store<Preferences>({
    defaults: {
      photoboothUrl: 'https://example.com',
      videoSaveMessage: 'Your video has been saved to our guestbook. We look forward to watching it soon!',
    },
    schema: {
      photoboothUrl: {
        type: 'string',
        format: 'uri',
      },
      videoSaveMessage: {
        type: 'string',
      },
    },
  });

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

  return store;
}
