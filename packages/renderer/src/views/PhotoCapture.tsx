import * as React from 'react';
import { useMediaStream, useNavigation, usePhotos } from '../context';
import { Card, CountdownCircle, Preview, Shutter } from '../components';

export function PhotoCapture() {
  const { state } = useNavigation();
  const [taking, setTaking] = React.useState(false);
  const { addPhoto } = usePhotos();
  const mediaStream = useMediaStream();

  const steps = state.split('.');

  return (
    <>
      <Preview />
      <div className="w-screen h-screen flex justify-center items-center">
        <Card blur>
          {state === 'photo.capturing.four' || state === 'photo.capturing.done' ? null : (
            <CountdownCircle
              key={state}
              duration={3}
              onComplete={() => {
                if (!mediaStream) {
                  throw new Error('no canvas');
                }
                setTaking(true);
                const track = mediaStream.getVideoTracks()[0];
                const imageCapture = new ImageCapture(track);
                const start = Date.now();
                console.log('taking');
                imageCapture.grabFrame().then((bitmap) => {
                  setTimeout(() => {
                    console.log('unset taking');
                    setTaking(false);
                  }, Math.min(1_000, 1_000 - (Date.now() - start)));

                  addPhoto(bitmap);
                  window.api.send('transition', { type: 'DONE' });
                });
              }}
            />
          )}
          <div className="text-black text-6xl">{`Photos taken: ${steps[steps.length - 1]}`}</div>
        </Card>
      </div>
      {taking ? <Shutter /> : null}
    </>
  );
}
