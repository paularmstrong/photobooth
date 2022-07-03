import * as React from 'react';
import { CountdownCircle, HelpCard } from '../components';
import { useMediaStream } from '../context';
import stopIcon from '../img/stop.svg';

const chunkLengthMs = 1_000;

export function VideoRecord() {
  const mediaStream = useMediaStream();
  const [stop, setStop] = React.useState<() => void>(() => () => {});

  React.useEffect(() => {
    let stopFn = stop;

    async function record(mediaStream: MediaStream) {
      const chunks: Array<Blob> = [];

      const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp9' });

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          console.log('got data', event.data.size);
          chunks.push(event.data);
        }
      });

      recorder.addEventListener('stop', async () => {
        console.log('stopped');
        const blob = new Blob(chunks, { type: 'video/webm' });
        const result = await blob.arrayBuffer();
        window.api.send('video', { data: result });
        console.log('leave');
      });

      recorder.start(chunkLengthMs);

      stopFn = () => {
        // Stop after 1.1x the chunk length to ensure we capture everything
        setTimeout(() => {
          recorder.stop();
        }, chunkLengthMs * 1.1);
      };
      setStop(() => stopFn);
    }

    if (mediaStream) {
      record(mediaStream);
    }

    return () => {
      console.log('unloading', stopFn);
      stopFn();
    };
  }, [mediaStream]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <CountdownCircle
        duration={30}
        onComplete={function handleStop() {
          console.log('DONE');
          stop();
          window.api.send('transition', { type: 'DONE' });
        }}
      />
      <HelpCard
        title="Recording now!"
        items={[{ description: 'Press to finish recording early', icon: stopIcon }]}
        visible
      />
    </div>
  );
}
