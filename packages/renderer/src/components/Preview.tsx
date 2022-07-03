import * as React from 'react';

export function Preview() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    async function getStream() {
      if (!videoRef.current) {
        console.log('reusing ref');
        return;
      }

      console.log('getting stream');

      const mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { aspectRatio: 1.6, facingMode: 'user' },
      });

      videoRef.current.srcObject = mediaStream;
    }

    getStream();
  }, [videoRef.current]);

  return (
    <div className="w-screen h-screen absolute">
      <video autoPlay className="w-screen h-screen -scale-x-100" ref={videoRef} />
    </div>
  );
}
