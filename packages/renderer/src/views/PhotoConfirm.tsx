import * as React from 'react';
import type { Props } from './props';
import { HelpCard } from '../components';

export function PhotoConfirm({ status }: Props) {
  return <HelpCard status={status} title="Say cheese!" description="Tap to begin taking photos." />;
}
