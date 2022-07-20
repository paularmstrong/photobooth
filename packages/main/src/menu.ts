import { app, Menu } from 'electron';
import type { MenuItem, MenuItemConstructorOptions } from 'electron';
import type { Service } from './state';

export function initMenu(service: Service) {
  const template: Array<MenuItemConstructorOptions | MenuItem> = [];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'Cmd+,',
          click: () => {
            service.send({ type: 'PREFERENCES' });
          },
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
