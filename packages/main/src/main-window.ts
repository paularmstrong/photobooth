import { BrowserWindow } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    width: 1280,
    height: 800,
    frame: false,
    webPreferences: {
      // nativeWindowOpen: true,
      // webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (process.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  browserWindow.setAspectRatio(16 / 10);
  browserWindow.setMinimumSize(800, 500);

  await browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();

  return window;
}
