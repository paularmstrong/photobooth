import * as React from 'react';
import type { Props } from './props';
import { ReviewLayout } from '../layouts';
import { useLocation, usePreference } from '../context';
import { H2, Text } from '../components';

export function VideoReview({ status }: Props) {
  const {
    state: { lastVideo },
  } = useLocation();
  const [saveMessage] = usePreference('videoSaveMessage');

  return (
    <ReviewLayout
      card={
        <>
          <H2 className="text-teal-700">Saved!</H2>
          <Text className="text-2xl">{saveMessage}</Text>
        </>
      }
      title="Thanks for the memories!"
    >
      <div className="p-3 bg-white -rotate-2 shadow-2xl aspect-[16/10]">
        <video autoPlay loop muted playsInline className="w-full">
          <source src={`pb:${lastVideo}`} type="video/webm" />
        </video>
      </div>
    </ReviewLayout>
  );
}
