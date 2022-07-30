import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import type { Api } from './api';
import type { Preferences, TransitionData } from '@pb/main';

const receivableEvents = ['transition', 'preferences'];
const sendableChannels = ['transition', 'preferences', 'selectMediaPath'];
function checkReceivable(eventName: string) {
  if (!receivableEvents.includes(eventName)) {
    throw new Error(`Invalid event name "${eventName}"`);
  }
}

contextBridge.exposeInMainWorld('api', {
  send: (channel: 'transition' | 'preferences' | 'selectMediaPath', data?: Record<string, unknown>) => {
    if (sendableChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  addListener: (channel: 'transition' | 'preferences', func: (data: unknown) => void) => {
    try {
      checkReceivable(channel);
    } catch (e) {
      return;
    }
    const fn = (event: IpcRendererEvent, data: TransitionData | Preferences) => func(data);
    ipcRenderer.on(channel, fn);

    return () => ipcRenderer.removeListener(channel, fn);
  },
} as Api);
