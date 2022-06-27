import * as React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  blur?: boolean;
}

export function Card({ blur = true, children }: Props) {
  return (
    <div
      className={clsx('flex flex-col gap-4 shadow-lg rounded-lg p-4', {
        'bg-white/80 backdrop-blur-sm': blur,
        'bg-white': !blur,
      })}
    >
      {children}
    </div>
  );
}
