export type ReceivableEvent = 'transition' | 'preferences';
export type Data = { value: Array<string>; meta: { photoType?: string; photos: Array<string> } };

export interface Api {
  addListener: (channel: ReceivableEvent, evt: (data: Data) => void) => () => void;
  send: (channel: 'transition' | 'preferences', data: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    api: Api;
  }
}
