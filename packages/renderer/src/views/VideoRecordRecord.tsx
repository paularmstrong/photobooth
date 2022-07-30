import * as React from 'react';
import { HelpCard } from '../components';
import type { Props } from './props';

export function VideoRecordRecord({ status }: Props) {
  return <HelpCard title={''} status={status} />;
}
