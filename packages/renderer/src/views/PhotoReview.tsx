import * as React from 'react';
import clsx from 'clsx';
import { Card, H1, H3, Photo, Text } from '../components';
import { useNavigation } from '../context';
import qrCode from '../img/qr.svg';

export function PhotoReview() {
  const {
    meta: { photos },
  } = useNavigation();
  const [numPhotos, setNumPhotos] = React.useState(1);

  React.useEffect(() => {
    if (numPhotos < 6) {
      setTimeout(() => {
        setNumPhotos((numPhotos) => numPhotos + 1);
      }, 100);
    }
  }, [numPhotos]);

  return (
    <div className="flex flex-row items-center justify-around h-screen bg-white/80">
      <div className="basis-2/3 grow-0 relative h-screen flex flex-col items-center">
        <div className="h-1/5 flex flex-col justify-around">
          <H1>Great shots!</H1>
        </div>
        {photos.slice(photos.length - 6, photos.length - 6 + numPhotos).map((filename, i) => (
          <div key={filename} className={clsx('absolute top-1/4 -mt-1/3', rotations[i % rotations.length])}>
            <Photo src={`pb:${filename}`} />
          </div>
        ))}
      </div>
      <div className="basis-1/3 grow-0 flex flex-col items-center">
        <Card>
          <img src={qrCode} alt="" className="w-96 h-96" />
          <H3>Download at:</H3>
          <Text className="text-2xl underline text-teal-700">***REMOVED***</Text>
        </Card>
      </div>
    </div>
  );
}

const rotations = [
  '-rotate-6 translate-y-4 shadow-lg',
  'rotate-6 translate-x-3 shadow-lg',
  '-rotate-3 -translate-x-3 -translate-y-2 shadow-xl',
  'rotate-3 shadow-xl',
  'rotate-2 shadow-2xl',
  '-rotate-2 shadow-2xl',
];
