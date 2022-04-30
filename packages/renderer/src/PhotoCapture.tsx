import * as React from 'react';
import { Button } from './components';
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

  // useEffect(() => {
  //   const numImages = Object.keys(images).length;
  //   if (running && numImages === 5) {
  //     setRunning(false);

  //     async function upload() {
  //       for (const [name, blob] of Object.entries(images)) {
  //         const nameParts = name.split('/');
  //         const imageRef = ref(storage, `photobooth/${nameParts[nameParts.length - 1]}.jpg`);
  //         await uploadFile(imageRef, blob, {
  //           cacheControl: 'public,max-age=31536000',
  //           contentType: 'image/jpeg',
  //         });
  //       }
  //     }

  //     upload();
  //   }
  // }, [running, images]);

  const numImages = Object.keys(images).length;

  return (
    <div className="absolute w-screen h-screen overflow-hidden flex flex-col flex-wrap justify-center items-center">
      <Button
        onPress={() => {
          setRunning(true);
          setImages({});
        }}
      >
        Start
      </Button>
      {running && numImages < 5 ? <Countdown key={numImages} takePhoto={takePhoto} /> : null}

      {/*uploading ? (
        <div className="text-6xl text-white">
          <ActivityIndicator /> Uploading!
        </div>
      ) : null*/}

      <div className="flex flex-row gap-10 px-10">
        {Object.keys(images).map((image) => (
          <div key={image} className="basis-1/6 grow-0 shrink-1">
            <img src={image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
