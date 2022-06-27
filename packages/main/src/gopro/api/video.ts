import { request } from './api';

export async function setMode() {
  return request('camera/presets/set_group', { id: '1000' });
}

export async function startRecord() {
  return request('camera/shutter/start');
}

export async function stopRecord() {
  return request('camera/shutter/stop');
}
