import { app } from 'electron';
import path from 'path';

export const MEDIA_PATH = path.join(app.getPath('home'), 'Photos', 'PhotoBooth');
