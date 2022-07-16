import * as React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { ReviewLayout } from '../layouts';
import { H2, Photo, Text } from '../components';
import { useNavigation } from '../context';
import qrCode from '../img/qr.svg';

export function PhotoReview() {
  const {
    meta: { photos },
  } = useNavigation();

  return (
    <ReviewLayout
      card={
        <>
          <img src={qrCode} alt="" className="w-96 h-96" />
          <H2>Download yours at:</H2>
          <Text className="text-4xl underline text-teal-700">***REMOVED***</Text>
        </>
      }
      title={titles[photos.length % titles.length]}
    >
      <CSSTransition in appear classNames={transitionClassnames()} timeout={250}>
        <Photo src={`pb:${photos[photos.length - 1]}`} />
      </CSSTransition>
    </ReviewLayout>
  );
}

const allClasses = 'absolute transition-all ease-in duration-150 shadow-2xl';
const initialClasses = 'opacity-0 scale-90';
function transitionClassnames() {
  const index = Math.floor(Math.random() * rotations.length);
  return {
    appear: clsx(allClasses, initialClasses, startRotations[index]),
    appearActive: clsx(allClasses, initialClasses, startRotations[index]),
    appearDone: clsx(allClasses, 'opacity-1 scale-100', rotations[index]),
  };
}

const startRotations = ['rotate-12', '-rotate-12', 'rotate-12', '-rotate-12', 'rotate-12', '-rotate-12'];

const rotations = [
  '-rotate-6 translate-y-4',
  'rotate-6 translate-x-3',
  '-rotate-3 -translate-x-3 -translate-y-2',
  'rotate-3',
  'rotate-2',
  '-rotate-2',
];

const titles = ['Great shots!', 'Super cool!', 'Lookin’ good!', '🥳 😎 🥸', 'You’re a natural!'];
