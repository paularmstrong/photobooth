import * as React from 'react';
import clsx from 'clsx';
import { usePreference } from '../context';

export function Title() {
  const [title] = usePreference('splashTitle');

  return (
    <h1 className="text-center text-white transition-[font-size] duration-500 font-bold text-dynamic animate-bounce-slow whitespace-nowrap relative top-12">
      {title.split(' ').map((part, i) => (
        <span
          key={part}
          className={clsx('drop-shadow-lg relative inline-block -rotate-12 origin-left', {
            '-left-4 md-left-8': i > 0,
          })}
        >
          {part}
        </span>
      ))}
    </h1>
  );
}
