import * as React from 'react';
import { HelpCard } from '../components';
import recordIcon from '../img/record.svg';
import stopIcon from '../img/stop.svg';

export function VideoSelect() {
  return (
    <>
      <HelpCard
        items={items}
        title="Get ready to record"
        description="Use the buttons below the screen to start and stop recording. You’ll have up to 20 seconds once you start recording!"
        visible
      />
    </>
  );
}

const items = [
  { icon: recordIcon, description: 'Start recording' },
  { icon: stopIcon, description: 'Stop recording' },
];
