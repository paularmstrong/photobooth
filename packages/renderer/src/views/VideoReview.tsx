import * as React from 'react';
import { ReviewLayout } from '../layouts';
import { useNavigation } from '../context';
import { H2, Text } from '../components';

export function VideoReview() {
  const {
    meta: { lastVideo },
  } = useNavigation();
  return (
    <ReviewLayout
      card={
        <>
          <H2 className="text-teal-700">Saved!</H2>
          <Text className="text-2xl">
            Your video has been saved to our guestbook. We look forward to watching it soon!
          </Text>
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
