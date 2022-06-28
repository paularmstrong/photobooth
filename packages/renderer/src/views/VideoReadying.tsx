import * as React from 'react';
import { CountdownCircle, HelpCard } from '../components';

export function VideoReadying() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <CountdownCircle
        duration={5}
        onComplete={function handleStop() {
          window.api.send('transition', { type: 'DONE' });
        }}
      />
      <HelpCard title="Get ready!!" description="Recording will start soon…" items={[]} visible />
    </div>
  );
}
