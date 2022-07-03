import * as React from 'react';
import clsx from 'clsx';
import { Preview } from '../components/Preview';

interface Props {
  children: React.ReactNode;
  dim?: boolean;
}

export function PreviewLayout({ children, dim = false }: Props) {
  return (
    <>
      <div className={clsx({ 'opacity-75': dim })}>
        <Preview />
      </div>
      <div className="absolute w-screen h-screen overflow-hidden">{children}</div>
    </>
  );
}
