export type ReceivableEvent = 'transition';
export type Data = { value: Array<string>; meta: Record<string, unknown> };

export interface Api {
  addListener: (channel: ReceivableEvent, evt: (data: Data) => void) => () => void;
  send: (channel: 'video' | 'photo' | 'transition', data: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    api: Api;
  }
}
