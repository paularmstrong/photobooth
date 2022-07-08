import * as React from 'react';
import { HelpCard } from '../components';
import { getFilename } from '../modules';
import quadIcon from '../img/quad.svg';
import quadtychIcon from '../img/quadtych.svg';
import collageIcon from '../img/collage.svg';
import { useNavigation, usePhotos } from '../context';

// 5.8 megapixel
const TargetSize = {
  WIDTH: 3072,
  HEIGHT: 1920,
} as const;

const photoPaddingRatio = 0.005;

export function PhotoReview() {
  const { state, meta } = useNavigation();
  const { clear, photos } = usePhotos();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const actualCanvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  React.useEffect(() => {
    if (photos.length && canvas.current) {
      drawImages(canvas.current, photos, meta?.photoType);
    }
  }, [canvas, photos, meta]);

  React.useEffect(() => {
    if (state.endsWith('.saving') && actualCanvas.current) {
      drawImages(actualCanvas.current, photos, meta?.photoType);
      actualCanvas.current.toBlob(
        async (blob: Blob | null) => {
          if (!blob) {
            throw new Error('failed to get blob');
          }
          const data = await blob.arrayBuffer();
          window.api.send('transition', {
            type: 'DONE',
            data,
            filename: `${getFilename()}.jpg`,
          });
        },
        'image/jpeg',
        1
      );
    }
  }, [state, meta, actualCanvas]);

  return (
    <div className="bg-black">
      <canvas
        className="absolute w-[2560px] h-[1920px]"
        ref={actualCanvas}
        width={TargetSize.WIDTH}
        height={TargetSize.HEIGHT}
      />
      <canvas
        className="absolute w-screen h-screen"
        ref={canvas}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      {state.endsWith('.saving') ? (
        <HelpCard items={[]} title="Saving" description="Just a moment…" visible />
      ) : (
        <HelpCard items={items} title="Choose a layout" visible />
      )}
    </div>
  );
}

const items = [
  { icon: quadIcon, description: '' },
  { icon: quadtychIcon, description: '' },
  { icon: collageIcon, description: '' },
];

interface LayoutArgs {
  pWidth: number;
  pHeight: number;
  cWidth: number;
  cHeight: number;
  index: number;
}

type LayoutResponse = [
  sx: number,
  sy: number,
  sWidth: number,
  sHeight: number,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number
];

function drawImages(canvas: HTMLCanvasElement, photos: Array<ImageBitmap>, layoutType: keyof typeof layout = 'quad') {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;

  ctx.fillStyle = 'white';
  ctx.rect(0, 0, width, height);
  ctx.fill();

  const padding = Math.round(width * photoPaddingRatio);

  photos.forEach((photo, index) => {
    const fn = layout[layoutType];
    const [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = fn({
      pWidth: photo.width,
      pHeight: photo.height,
      cWidth: width,
      cHeight: height,
      index,
    });
    ctx.drawImage(photo, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = padding;
    ctx.strokeRect(dx + padding / 2, dy + padding / 2, dWidth - padding / 2, dHeight - padding / 2);
  });
}

const layout: Record<string, (args: LayoutArgs) => LayoutResponse> = {
  quad: ({ pWidth, pHeight, cWidth, cHeight, index }: LayoutArgs): LayoutResponse => {
    return [0, 0, pWidth, pHeight, (index % 2) * (cWidth / 2), index < 2 ? 0 : cHeight / 2, cWidth / 2, cHeight / 2];
  },
  quadtych: ({ pWidth, pHeight, cWidth, cHeight, index }: LayoutArgs): LayoutResponse => {
    return [3 * (pWidth / 8), 0, pWidth / 4, pHeight, (index % 4) * (cWidth / 4), 0, cWidth / 4, cHeight];
  },
  collage: ({ pWidth, pHeight, cWidth, cHeight, index }: LayoutArgs): LayoutResponse => {
    // const ratio = pWidth / pHeight;
    switch (index) {
      case 0: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.6;
        const ratio = dWidth / dHeight;
        const sy = 0;
        const sx = pWidth / 2 - (pHeight * ratio) / 2;
        const sWidth = pHeight * ratio;
        return [sx, sy, sWidth, pHeight, 0, 0, dWidth, dHeight];
      }
      case 1: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.4;
        const ratio = dWidth / dHeight;
        const sy = pHeight / 2 - pWidth / ratio / 2;
        const sx = 0;
        const sHeight = pWidth / ratio;
        return [sx, sy, pWidth, sHeight, cWidth / 2, 0, dWidth, dHeight];
      }
      case 2: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.4;
        const ratio = dWidth / dHeight;
        const sy = pHeight / 2 - pWidth / ratio / 2;
        const sx = 0;
        const sHeight = pWidth / ratio;
        return [sx, sy, pWidth, sHeight, 0, cHeight * 0.6, dWidth, dHeight];
      }
      case 3: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.6;
        const ratio = dWidth / dHeight;
        const sy = 0;
        const sx = pWidth / 2 - (pHeight * ratio) / 2;
        const sWidth = pHeight * ratio;
        const dx = dWidth;
        const dy = cHeight - dHeight;
        return [sx, sy, sWidth, pHeight, dx, dy, dWidth, dHeight];
      }

      default: {
        throw new Error('too many photos');
      }
    }
  },
};
