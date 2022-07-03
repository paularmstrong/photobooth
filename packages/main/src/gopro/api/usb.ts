import { request, wait } from './api';

export async function takeControl() {
  await request('camera/control/wired_usb', { p: '1' });
  return await wait();
}

export async function releaseControl() {
  await request('camera/control/wired_usb', { p: '0' });
  return await wait();
}
