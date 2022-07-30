import * as React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
  mode?: 'normal' | 'more-transparent';
}

export function Card({ blur = true, children, className, mode = 'normal' }: Props) {
  return (
    <div
      className={clsx('flex flex-col gap-4 shadow-lg rounded-lg p-4', className, {
        'bg-white/80': mode === 'normal',
        'bg-white/30': mode === 'more-transparent',
        'backdrop-blur-sm': blur,
        'bg-white': !blur,
      })}
    >
      {children}
    </div>
  );
}
