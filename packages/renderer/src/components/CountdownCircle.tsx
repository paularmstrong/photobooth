import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import type { Props as CountdownProps } from 'react-countdown-circle-timer';
import { Text } from './Text';

type Props = Omit<CountdownProps, 'colors' | 'colorsTime'>;

export function CountdownCircle(props: Props) {
  return (
    <CountdownCircleTimer
      isPlaying
      colors={['#78B159', '#DD2E44', '#DD2E44']}
      colorsTime={[Math.round(props.duration / 2), Math.round(props.duration / 6), 0]}
      rotation="counterclockwise"
      trailColor="rgba(0,0,0,0)"
      size={300}
      strokeWidth={30}
      {...props}
    >
      {({ remainingTime }) => <Text className="text-9xl">{remainingTime}</Text>}
    </CountdownCircleTimer>
  );
}
