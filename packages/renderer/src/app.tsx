import * as React from 'react';
import { Provider as DeckProvider } from './streamdeck';
import { Router } from './Router';

export function App() {
  return (
    <DeckProvider>
      <div className="bg-black w-screen h-screen overflow-hidden">
        <Router />
      </div>
    </DeckProvider>
  );
}
