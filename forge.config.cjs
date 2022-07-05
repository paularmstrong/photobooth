'use strict';

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'PhotoBooth',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './packages/main/config/webpack.config.js',

        devContentSecurityPolicy:
          "default-src * self blob: data:; style-src * self 'unsafe-inline' blob: data:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data:; object-src * 'self' blob: data:; img-src * self gpp: 'unsafe-inline' blob: data:; connect-src self * 'unsafe-inline' blob: data:; frame-src * self blob: data:;",

        renderer: {
          config: './packages/renderer/config/webpack.config.js',
          entryPoints: [
            {
              html: './packages/renderer/src/index.html',
              js: './packages/renderer/src/index.ts',
              name: 'main_window',
              preload: {
                js: './packages/renderer/src/preload.ts',
              },
            },
          ],
        },
      },
    ],
  ],
};
