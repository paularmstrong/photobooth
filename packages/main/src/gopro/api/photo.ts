import { request } from './api';

export async function setMode() {
  return request('camera/presets/set_group', { id: '1001' });
}

export async function takePhoto() {
  return request('camera/shutter/start');
}
