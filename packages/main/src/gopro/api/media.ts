import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { getHost, request } from './api';

export async function list() {
  return request<MediaList>('media/list');
}

export async function download(item: MediaItem) {
  // nb: media items are always in "videos" root folder, no matter they're actual type
  const url = new URL(`videos/DCIM/${item.d}/${item.fs[0].n}`, getHost());
  const response = await fetch(url.toString());
  response.body?.pipe(createWriteStream(`~/Desktop/${item.fs[0].n}`));
  return item.fs[0].n;
}

interface MediaList {
  id: string;
  media: Array<MediaItem>;
}

interface MediaItem {
  /**
   * top-level directory for media item
   */
  d: string;
  /**
   * items in the filesystem
   */
  fs: Array<{
    /**
     * filename
     */
    n: string;
    /**
     * created at
     */
    cre: string;
    /**
     * modified at
     */
    mod: string;
    /**
     * size in bytes
     */
    s: string;
  }>;
}
