import type { Preferences } from '@pb/main';

export type ReceivableEvent = 'transition' | 'preferences';
export type Data = { value: Array<string>; meta: { photoType?: string; photos: Array<string> } };

interface Listen {
  (channel: 'transition', evt: (data: Data) => void): () => void;
  (channel: 'preferences', evt: (data: Preferences) => void): () => void;
}

interface Send {
  (channel: 'transition', data: Record<string, unknown>): void;
  (channel: 'preferences', data: Partial<Preferences>): void;
}

export interface Api {
  addListener: Listen;
  send: Send;
}

declare global {
  interface Window {
    api: Api;
  }
}
