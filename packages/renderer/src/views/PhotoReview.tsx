import * as React from 'react';
import clsx from 'clsx';
import { useTransitionIndex, transition } from '../modules';
import type { Props } from './props';
import { ReviewLayout } from '../layouts';
import { H2, Photo, QrCode, Text } from '../components';
import { useLocation, usePreference } from '../context';

export function PhotoReview({ status }: Props) {
  const {
    state: { photos },
  } = useLocation();
  const [url] = usePreference('photoboothUrl');
  const index = useTransitionIndex();

  return (
    <ReviewLayout
      card={
        <>
          <H2>Scan to download:</H2>
          <QrCode url={url} />
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
