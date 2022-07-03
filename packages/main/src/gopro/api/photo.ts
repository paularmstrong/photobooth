import { request, wait } from './api';

export async function setMode() {
  return request('camera/presets/set_group', { id: '1001' });
}

export async function take() {
  const res = request('camera/shutter/start');
  // Taking photos can take 3 seconds to process after the shutter
  await wait(3_000);
  return res;
}
