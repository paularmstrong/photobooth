import * as React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { transition } from '../modules';
import type { Props } from './props';
import { useMediaStream, usePhotos } from '../context';
import { CountdownCircle, Shutter } from '../components';
import cameraShutterSound from '../sounds/camera-shutter.mp3';
import toneSound from '../sounds/tone.wav';

export function PhotoCapture({ status }: Props) {
  const [taking, setTaking] = React.useState(false);
  const { addPhoto, photos } = usePhotos();
  const [showLastPhoto, setShowLastPhoto] = React.useState(false);
  const mediaStream = useMediaStream();
  const canvas = React.useRef<HTMLCanvasElement>(null);

  const shutter = React.useMemo(() => new Audio(cameraShutterSound), []);
  const tone = React.useMemo(() => new Audio(toneSound), []);

  React.useEffect(() => {
    if (photos.length && canvas.current) {
      const ctx = canvas.current.getContext('2d')!;
      const { width, height } = canvas.current;
      const photo = photos[photos.length - 1];
      setShowLastPhoto(true);
      ctx.drawImage(photo, 0, 0, photo.width, photo.height, 0, 0, width, height);
      setTimeout(() => {
        setShowLastPhoto(false);
        if (photos.length >= 4) {
          window.api.send('transition', { type: 'DONE' });
        }
      }, 1500);
    }
  }, [photos]);

  return (
    <>
      <div className="w-screen h-screen p-12 flex justify-end items-end">
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
                addPhoto(bitmap);
                setTimeout(() => {
                  setTaking(false);
                }, Math.min(500, 500 - (Date.now() - start)));
              });
            }}
            status={status}
          />
        ) : null}
      </div>

      <div className="absolute inset-0 flex flex-row justify-center items-center">
        <CSSTransition in={showLastPhoto} timeout={250}>
          {(status) => (
            <div
              className={clsx(
                'p-1 bg-white drop-shadow-2xl w-1/2 aspect-[16/10]',
                transition(status, 'zoomRotate', Math.floor(Math.random() * 4))
              )}
            >
              <canvas ref={canvas} className={clsx('w-full h-full', { 'opacity-0': !showLastPhoto })} />
            </div>
          )}
        </CSSTransition>
      </div>

      {taking ? <Shutter /> : null}
    </>
  );
}
