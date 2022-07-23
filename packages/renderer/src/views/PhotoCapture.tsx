import * as React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { useMediaStream, usePhotos } from '../context';
import { Card, CountdownCircle, Shutter } from '../components';
import cameraShutterSound from '../sounds/camera-shutter.mp3';
import toneSound from '../sounds/tone.wav';

export function PhotoCapture() {
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
                  addPhoto(bitmap);
                  setTimeout(() => {
                    setTaking(false);
                  }, Math.min(500, 500 - (Date.now() - start)));
                });
              }}
            />
          ) : null}
        </Card>
      </div>

      <div className="absolute inset-0 flex flex-row justify-center items-center">
        <CSSTransition in={showLastPhoto} classNames={transitionClassnames} timeout={300}>
          <canvas ref={canvas} className={clsx('w-1/2 aspect-[16/10]', { 'opacity-0': !showLastPhoto })} />
        </CSSTransition>
      </div>

      {taking ? <Shutter /> : null}
    </>
  );
}

const allClasses = 'p-3 bg-white drop-shadow-2xl transition-all ease-in-out duration-150 delay-150';
const startClasses = 'scale-90 -rotate-6 opacity-0';
const showClasses = 'scale-100 rotate-6 opacity-1';
const transitionClassnames = {
  enter: clsx(allClasses, startClasses),
  enterActive: clsx(allClasses, startClasses),
  enterDone: clsx(allClasses, showClasses),
  exit: clsx(allClasses, showClasses),
  exitActive: clsx(allClasses, showClasses),
  exitDone: clsx(allClasses, startClasses),
};
