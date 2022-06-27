import * as React from 'react';
import { HelpCard } from '../components';
import quadIcon from '../img/quad.svg';
import quadtychIcon from '../img/quadrytch.svg';
import collageIcon from '../img/collage.svg';

export function PhotoSelect() {
  return (
    <>
      <HelpCard
        items={items}
        title="Choose a photo display pattern"
        description="Use the buttons below the screen to select photo or video and follow along as the options change:"
        visible
      />
    </>
  );
}

const items = [
  { icon: quadIcon, description: '4-square collage' },
  { icon: quadtychIcon, description: 'Veritcal quadtych' },
  { icon: collageIcon, description: 'Random collage pattern' },
];
