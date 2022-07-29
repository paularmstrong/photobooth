import type { TransitionStatus } from 'react-transition-group';
import clsx from 'clsx';

export function transition(status: TransitionStatus, transition: Transition) {
  return clsx(transitions[transition][status], 'duration-250');
}

type Transition = 'slideDown' | 'slideUp' | 'fade' | 'zoom';

export const transitions: Record<Transition, Record<TransitionStatus, string>> = {
  slideDown: {
    entering: 'opacity-0 -translate-y-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-y-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 -translate-y-24',
    exited: 'opacity-0 -translate-y-24',
    unmounted: 'opacity-0 -translate-y-24',
  },
  slideUp: {
    entering: 'opacity-0 translate-y-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-y-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 translate-y-24',
    exited: 'opacity-0 translate-y-24',
    unmounted: 'opacity-0 translate-y-24',
  },
  fade: {
    entering: 'opacity-0',
    entered: 'transition-all ease-out opacity-1',
    exiting: 'transition-all ease-in opacity-0',
    exited: 'opacity-0',
    unmounted: 'opacity-0',
  },
  zoom: {
    entering: 'opacity-0 scale-50',
    entered: 'transition-[transform,opacity] ease-out opacity-1 scale-100',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 scale-50',
    exited: 'opacity-0 scale-50',
    unmounted: 'opacity-0 scale-50',
  },
};
