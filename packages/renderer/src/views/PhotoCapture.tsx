import * as React from 'react';
import { useStreamdeck } from '../streamdeck';
import { CountdownCircle } from '../components';

export function PhotoCapture() {
  const { state } = useStreamdeck();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      {state === 'photo.capturing.four' ? null : <CountdownCircle key={state} duration={4} onComplete={handleNext} />}
      <div className="text-black text-6xl">{state}</div>
    </div>
  );
}

function handleNext() {
  window.api.send('transition', { type: 'DONE' });
}
