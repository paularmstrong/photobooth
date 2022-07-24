import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { MediaStreamProvider, NavigationProvider, PhotoStoreProvider, PreferencesProvider } from './context';
import { Router } from './Router';

export function App() {
  return (
    <PreferencesProvider>
      <HashRouter>
        <NavigationProvider>
          <PhotoStoreProvider>
            <MediaStreamProvider>
              <div className="bg-black w-screen h-screen overflow-hidden">
                <Router />
              </div>
            </MediaStreamProvider>
          </PhotoStoreProvider>
        </NavigationProvider>
      </HashRouter>
    </PreferencesProvider>
  );
}
