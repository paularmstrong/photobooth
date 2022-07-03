import * as React from 'react';
import { useMediaStream } from '../context';

export function Preview() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const mediaStream = useMediaStream();

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef.current, mediaStream]);

  return (
    <div className="w-screen h-screen absolute">
      <video autoPlay muted className="w-screen h-screen -scale-x-100" ref={videoRef} />
    </div>
  );
}
