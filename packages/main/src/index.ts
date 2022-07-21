import { app, protocol, systemPreferences } from 'electron';
import path from 'path';
import type { BrowserWindow } from 'electron';
import './security-restrictions';
import { restoreOrCreateWindow } from './main-window';
import { setup as setupState } from './state';
import { MEDIA_PATH } from './constants';
import { initMenu } from './menu';
import { initStore } from './store';

export { Preferences } from './store';

let stopStateMachine: () => void;
let keepAliveTimeout: NodeJS.Timeout;

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
// app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', async () => {
  await stopStateMachine();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async () => {
  clearTimeout(keepAliveTimeout);
  await stopStateMachine();
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', async () => {
  const window = await restoreOrCreateWindow();
  const { service, stop } = await setupState(window.webContents);
  stopStateMachine = stop;
  initMenu(service);
});

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(async () => {
    if (process.platform !== 'darwin') {
      return;
    }
    const statusCam = systemPreferences.getMediaAccessStatus('camera');
    const statusMic = systemPreferences.getMediaAccessStatus('microphone');
    if (statusCam !== 'granted' || statusMic !== 'granted') {
      await systemPreferences.askForMediaAccess('camera');
      await systemPreferences.askForMediaAccess('microphone');
    }
  })
  .then(() => {
    protocol.registerFileProtocol('pb', (request, callback) => {
      const file = request.url.substr(3);
      callback({ path: path.join(MEDIA_PATH, file) });
    });
  })
  .then(restoreOrCreateWindow)
  .then(async (window: BrowserWindow) => {
    initStore(window.webContents);
    const { stop, service } = await setupState(window.webContents);
    initMenu(service);
    stopStateMachine = stop;
  })
  .catch((e) => console.error('Failed create window:', e));

if (process.env.DEV) {
  app.whenReady().then(() => import('electron-devtools-installer'));
}

if (process.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}
