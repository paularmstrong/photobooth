import * as React from 'react';
import { HelpCard } from '../components';
import recordIcon from '../img/record.svg';

export function PhotoConfirm() {
  return (
    <>
      <HelpCard items={items} title="Get ready to begin" description="Tap the start button below to begin." visible />
    </>
  );
}

const items = [{ icon: recordIcon, description: 'Begin' }];
