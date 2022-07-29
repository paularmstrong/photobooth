import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Props as MainProps } from './props';
import { H2, TextField } from '../components';
import clsx from 'clsx';
import { usePreference } from '../context';
import LinkIcon from 'humbleicons/icons/link.svg';
import CheckIcon from 'humbleicons/icons/check.svg';
import TimesCircleIcon from 'humbleicons/icons/times-circle.svg';
import { transition } from '../modules';

export function Preferences({ status }: MainProps) {
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

  function handleDone() {
    window.api.send('transition', { type: 'DONE' });
  }

  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleDone();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <div className={clsx('absolute inset-0 bg-slate-700/30 backdrop-blur-sm', transition(status, 'fade'))} />
      <div className={clsx('h-screen w-screen', transition(status, 'slideUp'))}>
        <div role="dialog" className="p-6 lg:p-12 w-full h-full">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 max-h-full overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-6 justify-between items-start">
                <H2>Preferences</H2>
                <button className="inline-flex gap-2 flex-row p-2 hover:bg-white/80 rounded" onClick={handleDone}>
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
      </div>
    </>
  );
}
