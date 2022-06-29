import { app, systemPreferences } from 'electron';
import type { BrowserWindow } from 'electron';
import './security-restrictions';
import { restoreOrCreateWindow } from './main-window';
import { run as runStreamdeck } from './streamdeck';

let stopStreamdeck: () => void;

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
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', async () => {
  await stopStreamdeck();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async () => {
  await stopStreamdeck();
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', async () => {
  const window = await restoreOrCreateWindow();
  stopStreamdeck = await runStreamdeck(window.webContents);
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
  .then(restoreOrCreateWindow)
  .then(async (window: BrowserWindow) => {
    stopStreamdeck = await runStreamdeck(window.webContents);
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
