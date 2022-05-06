import { globalShortcut } from 'electron';

export function registerShortcuts() {
  globalShortcut.register('1', () => {
    handleKeypress('0');
  });

  globalShortcut.register('2', () => {
    handleKeypress('1');
  });

  globalShortcut.register('3', () => {
    handleKeypress('2');
  });

  globalShortcut.register('4', () => {
    handleKeypress('3');
  });

  globalShortcut.register('5', () => {
    handleKeypress('4');
  });

  globalShortcut.register('6', () => {
    handleKeypress('5');
  });
}

export function handleKeypress(key: number | string) {
  const keyNum = typeof key === 'string' ? parseInt(key, 10) : key;

  if (keyNum < 0 || keyNum > 5) {
    console.log('unknown keypress', key, keyNum);
    return;
  }

  console.log('key pressed', keyNum);
}
