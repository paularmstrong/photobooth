import type { Preferences, TransitionData } from '@pb/main';

export type ReceivableEvent = 'transition' | 'preferences';

interface Listen {
  (channel: 'transition', evt: (data: TransitionData) => void): () => void;
  (channel: 'preferences', evt: (data: Preferences) => void): () => void;
}

interface Send {
  (channel: 'transition', data: Record<string, unknown>): void;
  (channel: 'preferences', data: Partial<Preferences>): void;
  (channel: 'selectMediaPath'): void;
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
