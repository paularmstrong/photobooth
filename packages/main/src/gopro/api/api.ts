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

export async function request<T>(path: string, params?: Record<string, string>) {
  const url = getUrl(path, params);
  const response = await fetch(url);
  return (await response.json()) as T;
}
