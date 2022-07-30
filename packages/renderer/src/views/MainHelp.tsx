import * as React from 'react';
import clsx from 'clsx';
import { transition } from '../modules';
import type { Props } from './props';
import { HelpCard } from '../components';

export function MainHelp({ status }: Props) {
  return (
    <>
      <div className={clsx('absolute inset-0 bg-slate-700/30 backdrop-blur-sm', transition(status, 'fade'))} />
      <div className="absolute w-full h-full top-0 left-0">
        <HelpCard
          status={status}
          keysWithoutDescription={false}
          description="Use the buttons below the screen to take photobooth photos or leave a video message for the bride and groom"
        />
      </div>
    </>
  );
}
