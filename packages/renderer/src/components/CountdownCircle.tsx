import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Text } from './Text';

interface Props {
  seconds?: number;
}

export function CountdownCircle({ seconds = 5 }: Props) {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={seconds}
      colors="#3a57ab"
      rotation="counterclockwise"
      trailColor="#000000"
      strokeWidth={20}
    >
      {({ remainingTime }) => <Text className="text-white text-9xl">{remainingTime}</Text>}
    </CountdownCircleTimer>
  );
}
