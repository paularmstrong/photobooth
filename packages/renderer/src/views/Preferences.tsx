import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Props as MainProps } from './props';
import { H2, H3, QrCode } from '../components';
import { Item, SelectField, TextField } from '@reui/reui';
import clsx from 'clsx';
import { usePreference, useSetMediaStream } from '../context';
import type { Preferences as PreferenceStore } from '@pb/main';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { transition } from '../modules';

export function Preferences({ status }: MainProps) {
  const [url, setUrl] = React.useState('https://example.com');
  const [videoDevices, setVideoDevices] = React.useState<Array<MediaDeviceInfo>>([]);
  const [audioDevices, setAudioDevices] = React.useState<Array<MediaDeviceInfo>>([]);
  const { videoId, setVideoId, audioId, setAudioId } = useSetMediaStream();

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
                  <XMarkIcon className="grow h-6 w-6" /> Close
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <PreferenceTextField preference="splashTitle" label="Splash screen title" />
                </div>

                <div className="col-span-7 grid grid-cols-6 gap-2">
                  <div className="col-span-5">
                    <PreferenceTextField
                      preference="photoboothUrl"
                      onChange={(url) => setUrl(url)}
                      leadingIcon="LinkIcon"
                      label="Online photo gallery URL"
                      description="Displayed along with a QR code after a photo is saved."
                    />
                  </div>

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
                {videoDevices.length ? (
                  <SelectField
                    label="Video device"
                    defaultSelectedKey={videoId || videoDevices[0]?.deviceId}
                    onSelectionChange={(key) => setVideoId(key as string)}
                  >
                    {videoDevices.map((dev) => (
                      <Item key={dev.deviceId}>{getDeviceName(dev.label) || dev.label}</Item>
                    ))}
                  </SelectField>
                ) : null}

                {audioDevices.length ? (
                  <SelectField
                    label="Audio device"
                    defaultSelectedKey={audioId || audioDevices[0]?.deviceId}
                    onSelectionChange={(key) => setAudioId(key as string)}
                  >
                    {audioDevices.map((dev) => (
                      <Item key={dev.deviceId}>{getDeviceName(dev.label) || dev.label}</Item>
                    ))}
                  </SelectField>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getDeviceName(str: string) {
  const idx = str.lastIndexOf('(');
  return str.substring(0, idx);
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
      trailingIcon={saved ? 'CheckCircleIcon' : null}
      trailingIconProps={saved ? successIconProps : undefined}
      onBlur={() => setSaved(false)}
      onChange={(value) => {
        setSaved(false);
        setValue(value);
        props.onChange && props.onChange(value);
      }}
    />
  );
}

const successIconProps = { className: 'text-green-500' };
