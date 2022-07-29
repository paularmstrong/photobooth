import * as React from 'react';
import type { Props } from './props';
import { HelpCard } from '../components';
import RecordIcon from '@pb/images/record.svg';
import StopIcon from '@pb/images/stop.svg';

export function VideoConfirm({ status }: Props) {
  return (
    <>
      <HelpCard
        items={items}
        title="Leave a video message"
        description="Think of it like a video guest book! You’ll have up to 30 seconds once you start recording!"
        status={status}
      />
    </>
  );
}

const items = [
  { icon: RecordIcon, description: 'Start recording' },
  { icon: StopIcon, description: 'Stop recording' },
];
