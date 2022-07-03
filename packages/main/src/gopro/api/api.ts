import fetch from 'node-fetch';

export function getHost() {
  return 'http://172.28.189.51:8080';
}

export function getUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`/gopro/${path}`, getHost());
  if (params) {
    const p = new URLSearchParams(params);
    url.search = p.toString();
  }
  return url.toString();
}

interface Bypass {
  busy?: boolean;
  encoding?: boolean;
  ready?: boolean;
}

export async function request<T>(path: string, params?: Record<string, string>, bypass?: Bypass) {
  const url = getUrl(path, params);

  console.log('[GOPRO]', url);

  await waitUntilReady(bypass);
  const response = await fetch(url);

  // force wait a tick because the gopro can't handle too many requests
  await wait(16);

  if (response.headers.get('content-length') !== '0') {
    return (await response.json()) as T;
  }
  return {} as T;
}

export function wait(timeout = 1_000) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

async function isReady(bypass: Bypass = {}) {
  const url = getUrl('camera/state');
  const res = await fetch(url);
  const json = (await res.json()) as { status: Record<string, string | number> };
  const { 8: busy, 10: encoding, 82: ready } = json.status;
  const notBusy = Boolean(bypass.busy || !busy);
  const notEncoding = Boolean(bypass.encoding || !encoding);
  const isReady = Boolean(bypass.ready || ready);
  return notBusy && notEncoding && isReady;
}

async function waitUntilReady(bypass: Bypass = {}, tries = 0): Promise<boolean> {
  if (tries > 4) {
    console.error('[GOPRO] failed to become ready');
    return false;
  }
  await wait(backoff[tries]);
  try {
    if (await isReady(bypass)) {
      return true;
    }
  } catch (e) {}
  console.warn('[GOPRO] not ready. backing off.');
  return waitUntilReady(bypass, tries + 1);
}

const backoff: Record<number, number> = {
  0: 0,
  1: 100,
  2: 500,
  3: 1000,
  4: 2000,
};
