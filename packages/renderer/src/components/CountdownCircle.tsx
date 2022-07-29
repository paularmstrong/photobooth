import * as React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import type { Props as CountdownProps } from 'react-countdown-circle-timer';
import { transition } from '../modules';
import { Text } from './Text';
import { Card } from './Card';

interface Props extends Omit<CountdownProps, 'colors' | 'colorsTime'> {
  status?: TransitionStatus;
}

export function CountdownCircle({ status, ...props }: Props) {
  return (
    <div className={status ? transition(status, 'zoom') : undefined}>
      <Card mode="more-transparent">
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
      </Card>
    </div>
  );
}
