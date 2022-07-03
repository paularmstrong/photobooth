import * as React from 'react';
import { HelpCard, Shutter } from '../components';
import { useNavigation } from '../context';
import clsx from 'clsx';
import photoIcon from '../img/photo.svg';
import videoIcon from '../img/video.svg';

export function Main() {
  const { state } = useNavigation();

  const showHelp = state === 'main.help';

  return (
    <>
      <div className="flex flex-col gap-6 justify-between h-full p-12">
        <h1
          className={clsx('text-center text-white transition-[font-size] duration-500 font-semibold', {
            'text-[256px]': !showHelp,
            'animate-bounce-slow': !showHelp,
            'text-9xl': showHelp,
          })}
        >
          <span className={clsx('block', { '-rotate-12': !showHelp, '-rotate-6': showHelp })}>
            <span className="drop-shadow-lg">Photo</span>
            <span
              className={clsx(
                'relative top-24 -left-8 drop-shadow-lg transition-[top] transition-[left] duration-500',
                {
                  'top-6': showHelp,
                  '-left-2': showHelp,
                }
              )}
            >
              Booth
            </span>
          </span>
        </h1>
        {!showHelp ? (
          <div className="flex justify-around">
            <div className="absolute drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden animate-ping">
              ⬇
            </div>
            <div className="relative drop-shadow-lg aspect-square rounded-full text-white bg-lime-600 p-4 text-4xl overflow-hidden">
              ⬇
            </div>
          </div>
        ) : null}
      </div>

      <HelpCard
        items={items}
        description="Use the buttons below the screen to select photo or video and follow along as the options change:"
        visible={showHelp}
      />

      <Shutter />
    </>
  );
}

const items = [
  { icon: photoIcon, description: 'Take photos' },
  { icon: videoIcon, description: 'Record a video' },
];
