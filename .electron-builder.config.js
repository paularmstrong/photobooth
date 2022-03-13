if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${
    now.getUTCHours() * 60 + now.getUTCMinutes()
  }`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  mac: {
    entitlements: './buildResources/entitlements.mac.plist',
    // hardenedRuntime: false,
    extendInfo: {
      NSCameraUsageDescription: 'This app requires camera access to record video.',
      NSMicrophoneUsageDescription: 'This app requires microphone access to record audio.',
    },
  },
};

module.exports = config;
