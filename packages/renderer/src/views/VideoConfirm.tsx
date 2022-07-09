import * as React from 'react';
import { HelpCard } from '../components';
import recordIcon from '../img/record.svg';
import stopIcon from '../img/stop.svg';

export function VideoConfirm() {
  return (
    <>
      <HelpCard
        items={items}
        title="Leave a video message"
        description="Think of it like a video guest book! You’ll have up to 30 seconds once you start recording!"
        visible
      />
    </>
  );
}

const items = [
  { icon: recordIcon, description: 'Start recording' },
  { icon: stopIcon, description: 'Stop recording' },
];
