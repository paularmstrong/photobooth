import * as React from 'react';
import { Countdown } from './Countdown';

interface Props {
  imageCapture: ImageCapture;
}

export function PhotoCapture({ imageCapture }: Props) {
  const [images, setImages] = React.useState<Record<string, Blob>>({});
  const [running, setRunning] = React.useState(false);

  const takePhoto = React.useCallback(async () => {
    if (!imageCapture) {
      throw new Error('no image capture');
    }

    performance.mark('takeStart');

    const blob = await imageCapture.takePhoto();
    const imageUrl = URL.createObjectURL(blob);

    performance.mark('takeStop');
    performance.measure('take photo', 'takeStart', 'takeStop');

    setImages((images) => ({ ...images, [imageUrl]: blob }));
  }, [imageCapture]);

  React.useEffect(() => {
    const remove = window.api.addListener('transition', ({ value, ...rest }) => {
      console.log(value, rest);
      if (value[value.length - 1] === 'photo.capturing') {
        setRunning(true);
        setImages({});
      }
    });

    return remove;
  }, []);

  const numImages = Object.keys(images).length;

  return (
    <div className="absolute w-screen h-screen overflow-hidden flex flex-col flex-wrap justify-center items-center">
      {running && numImages < 4 ? <Countdown key={numImages} takePhoto={takePhoto} /> : null}

      <div className="flex flex-row gap-10 px-10">
        {Object.keys(images).map((image) => (
          <div key={image} className="basis-1/5 grow-0 shrink-1">
            <img src={image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
