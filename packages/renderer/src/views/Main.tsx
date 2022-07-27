import * as React from 'react';
import { HelpCard, PhotoCarousel, Title } from '../components';
import { useLocation } from '../context';
import { Preferences } from './Preferences';
import PhotoIcon from '@pb/images/photo.svg';
import VideoIcon from '@pb/images/video.svg';

export function Main() {
  const { pathname } = useLocation();

  const showHelp = pathname === '/main/help';
  const showPrefs = pathname === '/main/preferences';

  return (
    <div className="absolute inset-0 bg-slate-700/30 backdrop-blur-sm">
      {!showPrefs ? (
        <div className="flex flex-col gap-6 justify-between h-full p-12">
          <Title animated={!showHelp} />

          <PhotoCarousel />

          <div className="flex justify-around relative">
            <div className="absolute drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden animate-ping">
              ⬇
            </div>
            <div className="relative drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden">
              ⬇
            </div>
          </div>
        </div>
      ) : null}

      <HelpCard
        items={items}
        description="Use the buttons below the screen to take photobooth photos or leave a video message for the bride and groom"
        visible={showHelp}
      />

      <Preferences show={showPrefs} />
    </div>
  );
}

const items = [
  { icon: PhotoIcon, description: 'Take photos' },
  { icon: VideoIcon, description: 'Leave a video message' },
];
