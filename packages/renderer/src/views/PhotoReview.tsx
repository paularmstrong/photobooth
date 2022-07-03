import * as React from 'react';
import { HelpCard } from '../components';
import { useStreamdeck } from '../streamdeck';

export function PhotoReview() {
  const { meta } = useStreamdeck();

  return (
    <div className="bg-black">
      {!meta.images?.length ? (
        <HelpCard title="Processing images…" description="" items={[]} />
      ) : (
        <div className="flex">
          {meta.images?.map((imagePath, i) => (
            <img src={`gpp:${imagePath}`} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
