import * as React from 'react';
import type { Props } from './props';
import { Title } from '../components';

export function Startup({ status }: Props) {
  return (
    <div className="absolute inset-0 bg-slate-700/30 backdrop-blur-sm">
      <Title animated />
    </div>
  );
}
