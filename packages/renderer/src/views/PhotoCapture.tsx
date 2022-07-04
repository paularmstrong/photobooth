import * as React from 'react';
import { useMediaStream, useNavigation, usePhotos } from '../context';
import { Card, CountdownCircle, Shutter } from '../components';

export function PhotoCapture() {
  const { state } = useNavigation();
  const [taking, setTaking] = React.useState(false);
  const { addPhoto } = usePhotos();
  const mediaStream = useMediaStream();

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <Card blur>
          <CountdownCircle
            key={state}
            duration={4}
            onComplete={() => {
              if (!mediaStream) {
                throw new Error('no canvas');
              }
              setTaking(true);
              const track = mediaStream.getVideoTracks()[0];
              const imageCapture = new ImageCapture(track);
              const start = Date.now();
              imageCapture.grabFrame().then((bitmap) => {
                setTimeout(() => {
                  setTaking(false);
                  window.api.send('transition', { type: 'DONE' });
                }, Math.min(500, 500 - (Date.now() - start)));

                addPhoto(bitmap);
              });
            }}
          />
        </Card>
      </div>
      {taking ? <Shutter /> : null}
    </>
  );
}
