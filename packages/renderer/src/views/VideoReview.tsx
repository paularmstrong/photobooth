import * as React from 'react';
import { HelpCard } from '../components';

export function VideoReview() {
  return (
    <div className="w-screen h-screen bg-black">
      <HelpCard
        items={[]}
        title="Thank you!"
        description="Your video has been saved and sent off to the bride & groom."
        visible
      />
    </div>
  );
}
