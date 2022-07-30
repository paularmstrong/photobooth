import * as React from 'react';
import type { Props } from './props';
import { HelpCard } from '../components';

export function VideoConfirm({ status }: Props) {
  return (
    <>
      <HelpCard
        title="Leave a video message"
        description="Think of it like a video guest book! You’ll have up to 30 seconds once you start recording!"
        status={status}
      />
    </>
  );
}
