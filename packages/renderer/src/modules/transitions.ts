import { useMemo } from 'react';
import type { TransitionStatus } from 'react-transition-group';
import clsx from 'clsx';

export function transition(status: TransitionStatus, transition: Transition, index = 0) {
  return clsx(transitions[transition](index)[status], 'duration-250');
}

type Transition = 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fade' | 'zoom' | 'zoomRotate';

export const transitions: Record<Transition, (index: number) => Record<TransitionStatus, string>> = {
  slideDown: () => ({
    entering: 'opacity-0 -translate-y-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-y-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 -translate-y-24',
    exited: 'opacity-0 -translate-y-24',
    unmounted: 'opacity-0 -translate-y-24',
  }),
  slideUp: () => ({
    entering: 'opacity-0 translate-y-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-y-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 translate-y-24',
    exited: 'opacity-0 translate-y-24',
    unmounted: 'opacity-0 translate-y-24',
  }),
  slideLeft: () => ({
    entering: 'opacity-0 translate-x-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-y-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 translate-x-24',
    exited: 'opacity-0 translate-x-24',
    unmounted: 'opacity-0 translate-x-24',
  }),
  slideRight: () => ({
    entering: 'opacity-0 -translate-x-24',
    entered: 'transition-[transform,opacity] ease-out opacity-1 translate-x-0',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 -translate-x-24',
    exited: 'opacity-0 -translate-x-24',
    unmounted: 'opacity-0 -translate-x-24',
  }),
  fade: () => ({
    entering: 'opacity-0',
    entered: 'transition-all ease-out opacity-1',
    exiting: 'transition-all ease-in opacity-0',
    exited: 'opacity-0',
    unmounted: 'opacity-0',
  }),
  zoom: () => ({
    entering: 'opacity-0 scale-50',
    entered: 'transition-[transform,opacity] ease-out opacity-1 scale-100',
    exiting: 'transition-[transform,opacity] ease-in opacity-0 scale-50',
    exited: 'opacity-0 scale-50',
    unmounted: 'opacity-0 scale-50',
  }),
  zoomRotate: (index: number) => {
    const idx = index % rotations.length;
    return {
      entering: clsx('opacity-0 scale-50', startRotations[idx]),
      entered: clsx('transition-[transform,opacity] ease-out opacity-1 scale-100', rotations[idx]),
      exiting: clsx('transition-[transform,opacity] ease-in opacity-0 scale-50', rotations[idx]),
      exited: clsx('opacity-0 scale-50', startRotations[idx]),
      unmounted: clsx('opacity-0 scale-50', startRotations[idx]),
    };
  },
};

const startRotations = ['rotate-12', '-rotate-12', 'rotate-12', '-rotate-12', 'rotate-12', '-rotate-12'];

const rotations = [
  '-rotate-6 translate-y-4',
  'rotate-6 translate-x-3',
  '-rotate-3 -translate-x-3 -translate-y-2',
  'rotate-3',
  'rotate-2',
  '-rotate-2',
];

export function useTransitionIndex() {
  return useMemo(() => Math.floor(Math.random() * rotations.length), []);
}
