import * as React from 'react';
import type { Props } from './props';
import { HelpCard } from '../components';
import RecordIcon from '@pb/images/record.svg';

export function PhotoConfirm({ status }: Props) {
  return (
    <HelpCard
      items={items}
      status={status}
      title="Say cheese!"
      description="Tap the start button below to begin taking photos."
    />
  );
}

const items = [{ icon: RecordIcon, description: 'Begin' }];
