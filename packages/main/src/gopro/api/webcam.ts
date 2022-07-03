import { request, wait } from './api';

export async function start() {
  try {
    return request('webcam/start', undefined, { busy: true });
  } catch (e) {}
}

export async function stop() {
  try {
    return request('webcam/stop', undefined, { busy: true });
  } catch (e) {}
}
