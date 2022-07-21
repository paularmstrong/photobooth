import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import type { Api, Data } from './api';
import type { Preferences } from '@pb/main';

const receivableEvents = ['transition', 'preferences'];

function checkReceivable(eventName: string) {
  if (!receivableEvents.includes(eventName)) {
    throw new Error(`Invalid event name "${eventName}"`);
  }
}

contextBridge.exposeInMainWorld('api', {
  send: (channel: 'transition' | 'preferences', data: Record<string, unknown>) => {
    const validChannels = ['transition', 'preferences'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  addListener: (channel: 'transition' | 'preferences', func: (data: unknown) => void) => {
    try {
      checkReceivable(channel);
    } catch (e) {
      return;
    }
    const fn = (event: IpcRendererEvent, data: Data | Preferences) => func(data);
    ipcRenderer.on(channel, fn);

    return () => ipcRenderer.removeListener(channel, fn);
  },
} as Api);
