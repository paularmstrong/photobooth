import { request, wait } from './api';

export async function keepAlive() {
  return request('camera/keep_alive');
}
