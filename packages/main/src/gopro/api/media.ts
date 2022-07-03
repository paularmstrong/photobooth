import { app } from 'electron';
import path from 'path';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import fetch from 'node-fetch';
import { getHost, request } from './api';

export async function list() {
  return request<MediaList>('media/list');
}

export async function getItems(start = 1) {
  const items = await list();
  return items.media[0].fs.slice(start);
}

export async function download(item: MediaItem) {
  // nb: media items are always in "videos" root folder, no matter they're actual type
  const url = new URL(`videos/DCIM/100GOPRO/${item.n}`, getHost());
  console.log('[GOPRO]', url.toString());
  const response = await fetch(url.toString());
  const localPath = `${app.getPath('appData')}/gopro-photobooth/image_cache/${item.n}`;
  await mkdir(path.dirname(localPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(localPath);
    response.body?.pipe(writeStream);
    response.body?.on('end', () => {
      console.log('[API]', 'wrote', url.toString(), 'to', localPath);
      resolve(localPath);
    });
    writeStream.on('error', () => {
      reject();
    });
  });
}

interface MediaList {
  id: string;
  media: Array<MediaItems>;
}

interface MediaItems {
  /**
   * top-level directory for media item
   */
  d: string;
  /**
   * items in the filesystem
   */
  fs: Array<MediaItem>;
}

interface MediaItem {
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
}
