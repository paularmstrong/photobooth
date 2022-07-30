import * as React from 'react';
import clsx from 'clsx';
import { useTransitionIndex, transition } from '../modules';
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
  const index = useTransitionIndex();

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
      status={status}
      title={titles[photos.length % titles.length]}
    >
      <div className={clsx('absolute shadow-2xl', transition(status, 'zoomRotate', index))}>
        <Photo src={`pb:${photos[photos.length - 1]}`} />
      </div>
    </ReviewLayout>
  );
}

const titles = ['Great shots!', 'Super cool!', 'Lookin’ good!', '🥳 😎 🥸', 'You’re a natural!'];
