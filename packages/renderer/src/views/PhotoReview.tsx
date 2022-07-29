import * as React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import type { Props } from './props';
import { ReviewLayout } from '../layouts';
import { H2, Photo, Text } from '../components';
import { useLocation, usePreference } from '../context';
import { toCanvas } from 'qrcode';

export function PhotoReview({ status }: Props) {
  const {
    state: { photos },
  } = useLocation();
  const [url] = usePreference('photoboothUrl');
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    if (!canvas.current) {
      return;
    }
    toCanvas(canvas.current, url, {
      width: canvas.current.width,
      margin: 0,
      color: { light: '#ffffff00', dark: '#0f766e' },
    });
  }, [url, canvas]);

  return (
    <ReviewLayout
      card={
        <>
          <H2>Scan to download:</H2>
          <canvas ref={canvas} className="w-full h-full aspect-1 mx-auto" />
          <Text className="underline text-teal-700 text-4xl">{url}</Text>
        </>
      }
      title={titles[photos.length % titles.length]}
    >
      <CSSTransition in appear classNames={transitionClassnames()} timeout={150}>
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
