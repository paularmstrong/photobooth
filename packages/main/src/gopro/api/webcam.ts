import { request } from './api';

export async function start() {
  return request('webcam/start');
}

export async function stop() {
  return request('webcam/stop');
}
