import * as React from 'react';
import clsx from 'clsx';

interface Props {
  animated: boolean;
}

export function Title({ animated }: Props) {
  return (
    <h1
      className={clsx('text-center text-white transition-[font-size] duration-500 font-semibold', {
        'text-9xl md:text-[200px] xl:text-[256px] animate-bounce-slow': animated,
        'text-9xl': !animated,
      })}
    >
      <span
        className={clsx('block transition-transform duration-500', {
          '-rotate-12': animated,
          '-rotate-6': !animated,
        })}
      >
        <span className="drop-shadow-lg">Photo</span>
        <span
          className={clsx(
            'relative top-12 md:top-24 -left-4 md-left-8 drop-shadow-lg transition-[top,left] duration-500',
            {
              'top-6 -left-2': !animated,
            }
          )}
        >
          Booth
        </span>
      </span>
    </h1>
  );
}
