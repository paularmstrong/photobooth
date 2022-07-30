import * as React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { transition } from '../modules';
import { Card, H1 } from '../components';

interface Props {
  card: React.ReactNode;
  children: React.ReactNode;
  status: TransitionStatus;
  title: string;
}

export function ReviewLayout({ card, children, status, title }: Props) {
  return (
    <div className="flex flex-row items-center justify-around h-screen bg-slate-700/80 backdrop-blur-lg p-6">
      <div className="basis-2/3 grow-0 relative h-screen flex flex-col items-center justify-around">
        <div className="flex basis-1/5 items-center">
          <H1 className="text-white drop-shadow-lg">{title}</H1>
        </div>
        <div className="basis-4/5 shrink-0 relative w-full p-12">{children}</div>
      </div>
      <div className="basis-1/3 grow-0 flex flex-col items-center overflow-hidden">
        <div className={transition(status, 'slideLeft')}>
          <Card>{card}</Card>
        </div>
      </div>
    </div>
  );
}
