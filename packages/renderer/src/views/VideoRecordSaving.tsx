import * as React from 'react';
import { HelpCard } from '../components';
import type { Props } from './props';

export function VideoRecordSaving({ status }: Props) {
  return <HelpCard title="Saving…" status={status} />;
}
