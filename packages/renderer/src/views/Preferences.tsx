import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Props as MainProps } from './props';
import { H2, H3, QrCode } from '../components';
import { SelectField, TextField } from '@reui/reui';
import { Item } from 'react-stately';
import clsx from 'clsx';
import { usePreference, useSetMediaStream } from '../context';
import type { Preferences as PreferenceStore } from '@pb/main';
import LinkIcon from 'humbleicons/icons/link.svg';
import CheckIcon from 'humbleicons/icons/check.svg';
import TimesCircleIcon from 'humbleicons/icons/times-circle.svg';
import { transition } from '../modules';

export function Preferences({ status }: MainProps) {
  const [url, setUrl] = React.useState('https://example.com');
  const [videoDevices, setVideoDevices] = React.useState<Array<MediaDeviceInfo>>([]);
  const [audioDevices, setAudioDevices] = React.useState<Array<MediaDeviceInfo>>([]);
  const { setVideoId, setAudioId } = useSetMediaStream();

  function handleDone() {
    window.api.send('transition', { type: 'DONE' });
  }

  React.useEffect(() => {
    async function getDevices() {
      const devices = await window.navigator.mediaDevices.enumerateDevices();
      setAudioDevices(devices.filter(({ kind }) => kind === 'audioinput'));
      setVideoDevices(devices.filter(({ kind }) => kind === 'videoinput'));
    }
    getDevices();

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
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 h-full overflow-y-auto">
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
                  onChange={(url) => setUrl(url)}
                  leadingIcon={LinkLeader}
                  label="Online photo gallery URL"
                  description="Displayed along with a QR code after a photo is saved."
                />
                <div className="h-32 w-32 grow-0 overflow-hidden">
                  <QrCode url={url} />
                </div>
              </div>

              <PreferenceTextField
                preference="videoSaveMessage"
                label="Video saved message"
                description="Displayed after a recorded video has been saved."
              />

              <PreferenceTextField
                preference="mediaPath"
                label="Photo save location"
                isReadOnly
                onFocus={(event) => {
                  window.api.send('selectMediaPath');
                  // @ts-ignore
                  event.target.blur();
                }}
              />

              <H3>Inputs</H3>
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Video device" onSelectionChange={(key) => setVideoId(key as string)}>
                  {videoDevices.map((dev) => (
                    <Item key={dev.deviceId}>{dev.label}</Item>
                  ))}
                </SelectField>

                <SelectField label="Audio device" onSelectionChange={(key) => setAudioId(key as string)}>
                  {audioDevices.map((dev) => (
                    <Item key={dev.deviceId}>{dev.label}</Item>
                  ))}
                </SelectField>
              </div>
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
    props.onChange && props.onChange(value);
  }, []);

  return (
    <TextField
      {...props}
      defaultValue={value}
      // @ts-ignore
      trailingIcon={saved ? SuccessIcon : null}
      onBlur={() => setSaved(false)}
      onChange={(value) => {
        setSaved(false);
        setValue(value);
        props.onChange && props.onChange(value);
      }}
    />
  );
}

function SuccessIcon() {
  return <CheckIcon className="text-green-500" />;
}

function LinkLeader() {
  return <LinkIcon />;
}
