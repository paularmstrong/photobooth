import * as React from 'react';
import { usePhotos } from '../context';

export function PhotoReview() {
  const { clear, photos } = usePhotos();
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  React.useEffect(() => {
    if (photos.length && canvas.current) {
      const ctx = canvas.current.getContext('2d')!;
      const { width, height } = canvas.current;
      photos.forEach((photo, i) => {
        ctx.drawImage(photo, 0, 0, photo.width, photo.height, (width / 4) * i, 0, width / 4, height);
      });
    }
  }, [canvas, photos]);

  return (
    <div className="bg-black">
      <canvas className="w-screen h-screen" ref={canvas} />
    </div>
  );
}
