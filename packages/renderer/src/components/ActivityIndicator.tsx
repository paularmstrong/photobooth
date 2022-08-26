import * as React from 'react';
import clsx from 'clsx';

const sizes = {
  sm: 'h-8 w-8 border-4',
  md: 'h-16 w-16 border-8',
  lg: 'h-32 w-32 border-16',
};

interface Props {
  size?: keyof typeof sizes;
}

export function ActivityIndicator({ size = 'md' }: Props) {
  return (
    <div role="progressbar" className="w-full flex items-center justify-center" aria-label="Loading…">
      <div className={clsx('activityindicator ease-in rounded-full text-teal-600', sizes[size])} />
    </div>
  );
}
