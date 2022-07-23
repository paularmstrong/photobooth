import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useDebouncedCallback } from 'use-debounce';
import { H2, TextField } from '../components';
import clsx from 'clsx';
import { usePreference } from '../context';
import LinkIcon from 'humbleicons/icons/link.svg';
import CheckIcon from 'humbleicons/icons/check.svg';
import TimesCircleIcon from 'humbleicons/icons/times-circle.svg';

interface Props {
  show?: boolean;
}

export function Preferences({ show = false }: Props) {
  const [url, _setUrl] = usePreference('photoboothUrl');
  const [urlSaved, setUrlSaved] = React.useState(false);
  const [saveMessage, _setSaveMessage] = usePreference('videoSaveMessage');
  const [messageSaved, setMessageSaved] = React.useState(false);

  const setUrl = useDebouncedCallback((value: string) => {
    _setUrl(value);
    setUrlSaved(true);
  }, 900);
  const setSaveMessage = useDebouncedCallback((value: string) => {
    _setSaveMessage(value);
    setMessageSaved(true);
  }, 500);

  return (
    <CSSTransition appear in={show} classNames={transitionClassnames} timeout={300} unmountOnExit={true}>
      <div className="absolute top-0 left-0 p-6 lg:p-12 w-full h-full">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 max-h-full overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6 justify-between items-start">
              <H2>Preferences</H2>
              <button
                className="inline-flex gap-2 flex-row p-2 hover:bg-white/80 rounded"
                onClick={() => {
                  window.api.send('transition', { type: 'DONE' });
                }}
              >
                <TimesCircleIcon className="grow h-6 w-6" /> Close
              </button>
            </div>

            <TextField
              leadingIcon={<LinkIcon />}
              trailingIcon={urlSaved ? <CheckIcon className="text-green-500" /> : null}
              label="Online photo gallery URL"
              helpText="Displayed along with a QR code after a photo is saved."
              onBlur={() => setUrlSaved(false)}
              onChangeText={(url) => {
                setUrlSaved(false);
                setUrl(url);
              }}
              value={url}
            />

            <TextField
              label="Video saved message"
              helpText="Displayed after a recorded video has been saved."
              trailingIcon={messageSaved ? <CheckIcon className="text-green-500" /> : null}
              onBlur={() => setMessageSaved(false)}
              onChangeText={(msg) => {
                setMessageSaved(false);
                setSaveMessage(msg);
              }}
              value={saveMessage}
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
