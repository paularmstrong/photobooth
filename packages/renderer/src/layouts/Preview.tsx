import * as React from 'react';
import { Preview } from '../components/Preview';

interface Props {
  children: React.ReactNode;
  dim?: boolean;
}

export function PreviewLayout({ children, dim = false }: Props) {
  return (
    <>
      <Preview dim={dim} />
      <div className="absolute w-screen h-screen overflow-hidden">{children}</div>
    </>
  );
}
