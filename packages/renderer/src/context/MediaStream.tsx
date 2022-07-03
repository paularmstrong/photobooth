import * as React from 'react';

const MediaStreamContext = React.createContext<MediaStream | null>(null);

export function MediaStreamProvider({ children }: { children: React.ReactNode }) {
  const [mediaStream, setMediaStream] = React.useState<MediaStream | null>(null);
  React.useEffect(() => {
    async function getStream() {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { aspectRatio: 1.6, facingMode: 'user' },
      });
      setMediaStream(stream);
    }
    !mediaStream && getStream();
  }, [mediaStream]);

  return <MediaStreamContext.Provider value={mediaStream}>{children}</MediaStreamContext.Provider>;
}

export function useMediaStream() {
  return React.useContext(MediaStreamContext);
}
