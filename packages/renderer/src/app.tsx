import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { PhotoCapture } from './PhotoCapture';

export function App() {
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
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
    <div class="bg-black w-screen h-screen overflow-hidden">
      <video autoPlay class="w-screen h-screen -scale-x-100 absolute" ref={videoRef} />
      {imageCapture ? <PhotoCapture imageCapture={imageCapture} /> : null}
    </div>
  );
}
