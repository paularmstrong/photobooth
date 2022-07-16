import * as React from 'react';
import { useMediaStream, usePhotos } from '../context';
import { Card, CountdownCircle, Shutter } from '../components';
import cameraShutterSound from '../sounds/camera-shutter.mp3';
import toneSound from '../sounds/tone.wav';

export function PhotoCapture() {
  const [taking, setTaking] = React.useState(false);
  const { addPhoto, photos } = usePhotos();
  const mediaStream = useMediaStream();

  const shutter = React.useMemo(() => new Audio(cameraShutterSound), []);
  const tone = React.useMemo(() => new Audio(toneSound), []);

  React.useEffect(() => {
    if (photos.length >= 4) {
      window.api.send('transition', { type: 'DONE' });
    }
  }, [photos]);

  return (
    <>
      <div className="w-screen h-screen p-12 flex justify-end items-end">
        <Card blur mode="more-transparent">
          {photos.length < 4 ? (
            <CountdownCircle
              key={photos.length}
              duration={4}
              onUpdate={(remainingTime) => {
                if (remainingTime) {
                  tone.play();
                }
              }}
              onComplete={() => {
                shutter.play();
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
                    addPhoto(bitmap);
                  }, Math.min(500, 500 - (Date.now() - start)));
                });
              }}
            />
          ) : null}
        </Card>
      </div>
      {taking ? <Shutter /> : null}
    </>
  );
}
