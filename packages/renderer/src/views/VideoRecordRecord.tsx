import * as React from 'react';
import { HelpCard } from '../components';
import type { Props } from './props';
import StopIcon from '@pb/images/stop.svg';

export function VideoRecordRecord({ status }: Props) {
  return (
    <HelpCard title={''} items={[{ icon: StopIcon, description: 'Press to stop recording early' }]} status={status} />
  );
}
