import * as React from 'react';
import clsx from 'clsx';

interface Props {
  dim?: boolean;
}

export function Preview({ dim = false }: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    async function getStream() {
      if (!videoRef.current) {
        return;
      }
      const mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { aspectRatio: 1.6, facingMode: 'user' },
      });

      videoRef.current.srcObject = mediaStream;
    }

    getStream();
  }, [videoRef]);

  return (
    <div className={clsx('w-screen h-screen absolute', { 'opacity-75': dim })}>
      <video autoPlay className="w-screen h-screen -scale-x-100" ref={videoRef} />
    </div>
  );
}
