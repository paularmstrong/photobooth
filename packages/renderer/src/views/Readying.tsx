import * as React from 'react';
import { CountdownCircle, HelpCard } from '../components';

interface Props {
  type: 'video' | 'photo';
}

export function Readying({ type }: Props) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <CountdownCircle
        duration={3}
        onComplete={() => {
          window.api.send('transition', { type: 'DONE' });
        }}
      />
      <HelpCard title="Get ready!!" description={description[type]} items={[]} visible />
    </div>
  );
}

const description: Record<'video' | 'photo', string> = {
  video: 'The camera is being prepared…',
  photo: 'The camera is being prepared…',
};
