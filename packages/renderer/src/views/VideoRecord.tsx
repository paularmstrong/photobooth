import * as React from 'react';
import type { Props } from './props';
import { ActivityIndicator, CountdownCircle, HelpCard } from '../components';
import { useLocation, useMediaStream } from '../context';
import { getFilename } from '../modules';

const chunkLengthMs = 1_000;

export function VideoRecord({ status }: Props) {
  const mediaStream = useMediaStream();
  const { pathname } = useLocation();
  const [stop, setStop] = React.useState<() => void>(() => () => {});

  const isSaving = pathname.endsWith('/saving');

  React.useEffect(() => {
    let stopFn = stop;

    async function record(mediaStream: MediaStream) {
      const chunks: Array<Blob> = [];

      const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp9' });

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });

      recorder.addEventListener('stop', async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const result = await blob.arrayBuffer();
        window.api.send('transition', {
          type: 'DONE',
          data: result,
          filename: `${getFilename()}.webm`,
        });
      });

      recorder.start(chunkLengthMs);

      stopFn = () => {
        if (recorder.state !== 'inactive') {
          // Stop after 1.1x the chunk length to ensure we capture everything
          setTimeout(() => {
            recorder.stop();
          }, chunkLengthMs * 1.1);
        }
      };
      setStop(() => stopFn);
    }

    if (mediaStream) {
      record(mediaStream);
    }

    return () => {
      stopFn();
    };
  }, [mediaStream]);

  React.useEffect(() => {
    if (isSaving) {
      stop();
    }
  }, [stop, isSaving]);

  return (
    <div className="rw-screen h-screen p-12 flex justify-end items-end">
      {!isSaving ? (
        <>
          <CountdownCircle
            duration={30}
            onComplete={function handleStop() {
              if (!isSaving) {
                window.api.send('transition', { type: 'DONE' });
              }
            }}
            status={status}
          />

          <HelpCard title={''} status={status} />
        </>
      ) : (
        <HelpCard title="Saving…" description={<ActivityIndicator />} status={status} />
      )}
    </div>
  );
}
