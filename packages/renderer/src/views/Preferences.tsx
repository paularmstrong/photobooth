import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useDebouncedCallback } from 'use-debounce';
import { H1, TextField } from '../components';
import clsx from 'clsx';
import { usePreference } from '../context';

interface Props {
  show?: boolean;
}

export function Preferences({ show = false }: Props) {
  const [url, _setUrl] = usePreference('photoboothUrl');
  const setUrl = useDebouncedCallback((value: string) => {
    _setUrl(value);
  }, 900);

  return (
    <CSSTransition appear in={show} classNames={transitionClassnames} timeout={300} unmountOnExit={true}>
      <div className="absolute top-0 left-0 p-6 lg:p-12 w-full h-full">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6">
          <button
            onClick={() => {
              window.api.send('transition', { type: 'DONE' });
            }}
          >
            close
          </button>
          <div className="flex flex-col gap-6">
            <H1 className="text-2xl">Preferences</H1>

            <TextField
              label="Online photo gallery URL"
              helpText="Displayed along with a QR code after a photo is saved."
              onChangeText={(url) => setUrl(url)}
              value={typeof url === 'string' ? url : ''}
            />

            <TextField
              label="Video saved message"
              placeholder="Your video has been saved to our guestbook. We look forward to watching it soon!"
              helpText="Displayed after a recorded video has been saved."
            />
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

const allClasses = 'absolute transition-all ease-in-out duration-300 shadow-2xl';

const transitionClassnames = {
  appear: clsx(allClasses, 'opacity-0 translate-y-full'),
  appearActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  appearDone: clsx(allClasses, 'opacity-1 translate-y-0'),
  enter: clsx(allClasses, 'opacity-0 translate-y-full'),
  enterActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  enterDone: clsx(allClasses, 'opacity-1 translate-y-0'),
  exit: clsx(allClasses, 'opacity-1 translate-y-0'),
  exitActive: clsx(allClasses, 'opacity-0 translate-y-full'),
  exitDone: clsx(allClasses, 'opacity-0 translate-y-full'),
};
