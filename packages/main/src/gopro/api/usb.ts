import { request } from './api';

export async function takeControl() {
  await request('camera/control/wired_usb', { p: '1' });
  return await wait();
}

export async function releaseControl() {
  await request('camera/control/wired_usb', { p: '0' });
  return await wait();
}

function wait(timeout: number = 1_000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
