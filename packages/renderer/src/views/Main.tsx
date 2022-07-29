import * as React from 'react';
import clsx from 'clsx';
import { PhotoCarousel, Title } from '../components';
import { transition } from '../modules';
import type { Props } from './props';

export function Main({ status }: Props) {
  return (
    <>
      <div className={clsx('absolute inset-0 bg-slate-700/30 backdrop-blur-sm', transition(status, 'fade'))} />

      <div className="flex flex-col gap-6 justify-between h-full p-12">
        <div className={transition(status, 'slideDown')}>
          <Title animated />
        </div>

        <div className={transition(status, 'zoom')}>
          <PhotoCarousel />
        </div>

        <div className={clsx('flex justify-around relative', transition(status, 'slideUp'))}>
          <div className="absolute drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden animate-ping">
            ⬇
          </div>
          <div className="relative drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden">
            ⬇
          </div>
        </div>
      </div>
    </>
  );
}
