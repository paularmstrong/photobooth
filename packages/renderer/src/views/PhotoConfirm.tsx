import * as React from 'react';
import { HelpCard } from '../components';
import RecordIcon from '@pb/images/record.svg';

export function PhotoConfirm() {
  return (
    <>
      <HelpCard
        items={items}
        title="Say cheese!"
        description="Tap the start button below to begin taking photos."
        visible
      />
    </>
  );
}

const items = [{ icon: RecordIcon, description: 'Begin' }];
