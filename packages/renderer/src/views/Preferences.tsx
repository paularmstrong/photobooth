import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Props as MainProps } from './props';
import { H2, QrCode, TextField } from '../components';
import clsx from 'clsx';
import { usePreference } from '../context';
import type { Preferences as PreferenceStore } from '@pb/main';
import LinkIcon from 'humbleicons/icons/link.svg';
import CheckIcon from 'humbleicons/icons/check.svg';
import TimesCircleIcon from 'humbleicons/icons/times-circle.svg';
import { transition } from '../modules';

export function Preferences({ status }: MainProps) {
  const [url, setUrl] = React.useState('https://example.com');
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

              <PreferenceTextField preference="splashTitle" label="Splash screen title" />

              <div className="flex flex-row gap-6 grow">
                <PreferenceTextField
                  preference="photoboothUrl"
                  onChangeText={(url) => setUrl(url)}
                  leadingIcon={<LinkIcon />}
                  label="Online photo gallery URL"
                  helpText="Displayed along with a QR code after a photo is saved."
                />
                <div className="h-32 w-32 grow-0 overflow-hidden">
                  <QrCode url={url} />
                </div>
              </div>

              <PreferenceTextField
                preference="videoSaveMessage"
                label="Video saved message"
                helpText="Displayed after a recorded video has been saved."
              />

              <PreferenceTextField
                preference="mediaPath"
                label="Photo save location"
                readOnly
                onFocus={(event) => {
                  window.api.send('selectMediaPath');
                  event.target.blur();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface PrefProp extends React.ComponentProps<typeof TextField> {
  preference: keyof PreferenceStore;
}

function PreferenceTextField({ preference, ...props }: PrefProp) {
  const [value, _setValue] = usePreference(preference);
  const [saved, setSaved] = React.useState(false);

  const setValue = useDebouncedCallback((value: string) => {
    _setValue(value);
    setSaved(true);
  }, 900);

  React.useEffect(() => {
    props.onChangeText && props.onChangeText(value);
  }, []);

  return (
    <TextField
      {...props}
      trailingIcon={saved ? <CheckIcon className="text-green-500" /> : null}
      onBlur={() => setSaved(false)}
      onChangeText={(url) => {
        setSaved(false);
        setValue(url);
        props.onChangeText && props.onChangeText(url);
      }}
      value={value}
    />
  );
}
