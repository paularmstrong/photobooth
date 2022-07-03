import * as React from 'react';
import { MediaStreamProvider, NavigationProvider, PhotoStoreProvider } from './context';
import { Router } from './Router';

export function App() {
  return (
    <NavigationProvider>
      <PhotoStoreProvider>
        <MediaStreamProvider>
          <div className="bg-black w-screen h-screen overflow-hidden">
            <Router />
          </div>
        </MediaStreamProvider>
      </PhotoStoreProvider>
    </NavigationProvider>
  );
}
