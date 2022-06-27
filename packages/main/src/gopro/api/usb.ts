import { request } from './api';

export async function takeControl() {
  return request('camera/control/wired_usb', { p: '1' });
}

export async function releaseControl() {
  return request('camera/control/wired_usb', { p: '0' });
}
