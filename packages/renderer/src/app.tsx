import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { IconProvider } from '@reui/reui';
import { MediaStreamProvider, NavigationProvider, PhotoStoreProvider, PreferencesProvider } from './context';
import { Router } from './Router';
import { HiddenTitlebar, Preview } from './components';
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  LinkIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

export function App() {
  return (
    <>
      <PreferencesProvider>
        <IconProvider
          value={{
            CheckCircleIcon,
            CheckIcon,
            ChevronDownIcon,
            ChevronUpIcon,
            ChevronUpDownIcon,
            LinkIcon,
            XCircleIcon,
          }}
        >
          <HashRouter>
            <NavigationProvider>
              <PhotoStoreProvider>
                <MediaStreamProvider>
                  <div className="bg-black w-screen h-screen overflow-hidden">
                    <Preview />
                    <div className="absolute w-screen h-screen overflow-hidden">
                      <Router />
                    </div>
                  </div>
                </MediaStreamProvider>
              </PhotoStoreProvider>
            </NavigationProvider>
          </HashRouter>
        </IconProvider>
      </PreferencesProvider>
      <HiddenTitlebar />
    </>
  );
}
