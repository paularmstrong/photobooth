import * as React from 'react';

const MediaStreamContext = React.createContext<{
  videoId: string | null;
  setVideoId: (id: string) => void;
  audioId: string | null;
  setAudioId: (id: string) => void;
  stream: MediaStream | null;
}>({ videoId: null, setVideoId: () => {}, audioId: null, setAudioId: () => {}, stream: null });

export function MediaStreamProvider({ children }: { children: React.ReactNode }) {
  const [stream, setMediaStream] = React.useState<MediaStream | null>(null);
  const [videoId, setVideoId] = React.useState<string | null>(null);
  const [audioId, setAudioId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getStream() {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: !audioId ? true : { deviceId: audioId },
        video: !videoId
          ? { aspectRatio: 1.6, facingMode: 'user' }
          : { aspectRatio: 1.6, facingMode: 'user', deviceId: videoId },
      });
      setMediaStream(stream);
      setAudioId((stream.getAudioTracks()[0].getConstraints().deviceId as string) || null);
      setVideoId((stream.getVideoTracks()[0].getConstraints().deviceId as string) || null);
    }

    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      const currentAudioId = audioTrack.getConstraints().deviceId || null;
      const currentVideoId = videoTrack.getConstraints().deviceId || null;
      if (currentAudioId !== audioId || currentVideoId !== videoId) {
        getStream();
      }
    } else {
      getStream();
    }
  }, [stream, audioId, videoId]);

  return (
    <MediaStreamContext.Provider value={{ videoId, setVideoId, audioId, setAudioId, stream }}>
      {children}
    </MediaStreamContext.Provider>
  );
}

export function useMediaStream() {
  return React.useContext(MediaStreamContext).stream! as MediaStream;
}

export function useSetMediaStream() {
  const { videoId, setVideoId, audioId, setAudioId } = React.useContext(MediaStreamContext);
  return { videoId, setVideoId, audioId, setAudioId };
}
