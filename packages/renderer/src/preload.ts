import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import type { Api, Data, ReceivableEvent } from './api';

const receivableEvents = ['transition'];

function checkReceivable(eventName: string) {
  if (!receivableEvents.includes(eventName)) {
    throw new Error(`Invalid event name "${eventName}"`);
  }
}

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: Record<string, unknown>) => {
    const validChannels = ['transition', 'video', 'photo'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  addListener: (channel: ReceivableEvent, func: (data: Data) => void) => {
    try {
      checkReceivable(channel);
    } catch (e) {
      return;
    }
    const fn = (event: IpcRendererEvent, data: Data) => func(data);
    ipcRenderer.on(channel, fn);

    return () => ipcRenderer.removeListener(channel, fn);
  },
} as Api);
