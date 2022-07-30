import * as React from 'react';
import type { Props } from './props';
import clsx from 'clsx';
import { useTransitionIndex, transition } from '../modules';
import { ReviewLayout } from '../layouts';
import { useLocation, usePreference } from '../context';
import { H2, Text } from '../components';

export function VideoReview({ status }: Props) {
  const {
    state: { lastVideo },
  } = useLocation();
  const [saveMessage] = usePreference('videoSaveMessage');
  const index = useTransitionIndex();

  return (
    <ReviewLayout
      card={
        <>
          <H2 className="text-teal-700">Saved!</H2>
          <Text className="text-2xl">{saveMessage}</Text>
        </>
      }
      status={status}
      title="Thanks for the memories!"
    >
      <div className={clsx('p-3 bg-white shadow-2xl aspect-[16/10]', transition(status, 'zoomRotate', index))}>
        <video autoPlay loop muted playsInline className="w-full">
          <source src={`pb:${lastVideo}`} type="video/webm" />
        </video>
      </div>
    </ReviewLayout>
  );
}
