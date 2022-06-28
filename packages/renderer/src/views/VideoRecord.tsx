import * as React from 'react';
import { CountdownCircle, HelpCard } from '../components';
import stopIcon from '../img/stop.svg';

export function VideoRecord() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <CountdownCircle
        duration={30}
        onComplete={function handleStop() {
          console.log('DONE');
          window.api.send('transition', { type: 'DONE' });
        }}
      />
      <HelpCard
        title="Recording now!"
        items={[{ description: 'Press to finish recording early', icon: stopIcon }]}
        visible
      />
    </div>
  );
}
