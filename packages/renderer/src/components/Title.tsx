import * as React from 'react';
import clsx from 'clsx';

interface Props {
  animated: boolean;
}

export function Title({ animated }: Props) {
  return (
    <h1
      className={clsx('text-center text-white transition-[font-size] duration-500 font-semibold', {
        'text-[256px]': animated,
        'animate-bounce-slow': animated,
        'text-9xl': !animated,
      })}
    >
      <span className={clsx('block', { '-rotate-12': animated, '-rotate-6': !animated })}>
        <span className="drop-shadow-lg">Photo</span>
        <span
          className={clsx('relative top-24 -left-8 drop-shadow-lg transition-[top] transition-[left] duration-500', {
            'top-6': !animated,
            '-left-2': !animated,
          })}
        >
          Booth
        </span>
      </span>
    </h1>
  );
}
