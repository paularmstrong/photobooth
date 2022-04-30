import * as React from 'react';
import { PhotoCapture } from './PhotoCapture';

export function App() {
  const [imageCapture, setImageCapture] = React.useState<ImageCapture | null>(null);
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

      const track = mediaStream.getVideoTracks()[0];
      setImageCapture(new ImageCapture(track));
    }

    getStream();
  }, [videoRef]);

  return (
    <div className="bg-black w-screen h-screen overflow-hidden">
      <video autoPlay className="w-screen h-screen -scale-x-100 absolute" ref={videoRef} />
      {imageCapture ? <PhotoCapture imageCapture={imageCapture} /> : null}
    </div>
  );
}
