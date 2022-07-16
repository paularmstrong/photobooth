import * as React from 'react';
import { Card, CountdownCircle, HelpCard } from '../components';
import toneSound from '../sounds/tone.wav';

interface Props {
  type: 'video' | 'photo';
}

export function Readying({ type }: Props) {
  const tone = React.useMemo(() => new Audio(toneSound), []);

  return (
    <div className="w-screen h-screen p-12 flex justify-end items-end">
      <Card mode="more-transparent">
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
        />
      </Card>
      <HelpCard title="Get ready!!" description={description[type]} items={[]} visible />
    </div>
  );
}

const description: Record<'video' | 'photo', string> = {
  video: 'The camera is being prepared…',
  photo: 'The camera is being prepared…',
};
