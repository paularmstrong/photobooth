import * as React from 'react';

interface Props {
  src: string;
}

export function Photo({ src }: Props) {
  return (
    <div className="">
      <img src={src} alt="" className="aspect-[16/10]" />
    </div>
  );
}
