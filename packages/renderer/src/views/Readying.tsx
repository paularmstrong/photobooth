import * as React from 'react';
import type { Props } from './props';
import { CountdownCircle, HelpCard } from '../components';
import toneSound from '../sounds/tone.wav';

export function Readying({ status }: Props) {
  const tone = React.useMemo(() => new Audio(toneSound), []);

  return (
    <div className="w-screen h-screen p-12 flex justify-end items-end">
      <CountdownCircle
        duration={3}
        onUpdate={(remainingTime) => {
          if (remainingTime) {
            tone.play();
          }
        }}
        onComplete={() => {
          window.api.send('transition', { type: 'DONE' });
        }}
        status={status}
      />
      <HelpCard title="Get ready!!" description="The camera is being prepared…" status={status} />
    </div>
  );
}
