import * as React from 'react';
import { useStreamdeck } from '../streamdeck';
import { CountdownCircle } from '../components';

export function PhotoCapture() {
  const { state } = useStreamdeck();

  const steps = state.split('.');

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      {state === 'photo.capturing.four' || state === 'photo.capturing.done' ? null : (
        <CountdownCircle key={state} duration={5} onComplete={handleNext} />
      )}
      <div className="text-black text-6xl">{`Photos taken: ${steps[steps.length - 1]}`}</div>
    </div>
  );
}

function handleNext() {
  window.api.send('transition', { type: 'DONE' });
}
