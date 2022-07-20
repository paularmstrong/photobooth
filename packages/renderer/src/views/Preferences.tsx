import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { H2 } from '../components';
import clsx from 'clsx';

interface Props {
  show?: boolean;
}

export function Preferences({ show = false }: Props) {
  return (
    <CSSTransition appear in={show} classNames={transitionClassnames} timeout={300} unmountOnExit={true}>
      <div className="absolute top-0 left-0 p-6 lg:p-12 w-full h-full">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6">
          <button
            onClick={() => {
              window.api.send('transition', { type: 'DONE' });
            }}
          >
            close
          </button>
          <H2>Preferences</H2>
        </div>
      </div>
    </CSSTransition>
  );
}

const allClasses = 'absolute transition-all ease-in-out duration-300 shadow-2xl';

const transitionClassnames = {
  appear: clsx(allClasses, 'opacity-0 translate-y-full'),
  appearActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  appearDone: clsx(allClasses, 'opacity-1 translate-y-0'),
  enter: clsx(allClasses, 'opacity-0 translate-y-full'),
  enterActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  enterDone: clsx(allClasses, 'opacity-1 translate-y-0'),
  exit: clsx(allClasses, 'opacity-1 translate-y-0'),
  exitActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  exitDone: clsx(allClasses, 'opacity-0 translate-y-full'),
};
