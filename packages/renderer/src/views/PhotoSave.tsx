import * as React from 'react';
import type { Props } from './props';
import { useLocation } from '../context';
import { HelpCard } from '../components';
import { getFilename } from '../modules';
import QuadIcon from '@pb/images/quad.svg';
import QuadtychIcon from '@pb/images/quadtych.svg';
import CollageIcon from '@pb/images/collage.svg';
import RandomIcon from '@pb/images/random.svg';
import { usePhotos } from '../context';

// 5.8 megapixel
const TargetSize = {
  WIDTH: 3072,
  HEIGHT: 1920,
} as const;

const photoPaddingRatio = 0.005;

export function PhotoSave({ status }: Props) {
  const {
    pathname,
    state: { photoType },
  } = useLocation();
  const { clear, photos } = usePhotos();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const actualCanvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (photos.length && canvas.current) {
      drawImages(canvas.current, photos, photoType);
    }
  }, [canvas, photos, photoType]);

  React.useEffect(() => {
    if (pathname.endsWith('/saving') && actualCanvas.current && photos.length) {
      drawImages(actualCanvas.current, photos, photoType);
      actualCanvas.current.toBlob(
        async (blob: Blob | null) => {
          if (!blob) {
            throw new Error('failed to get blob');
          }
          const data = await blob.arrayBuffer();
          clear();
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
  }, [pathname, photos, photoType, actualCanvas]);

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
      {pathname.endsWith('/saving') ? (
        <HelpCard items={[]} title="Saving" description="Just a moment…" status={status} />
      ) : (
        <HelpCard items={items} title="Choose a layout" status={status} />
      )}
    </div>
  );
}

const items = [
  { icon: QuadIcon, description: '' },
  { icon: QuadtychIcon, description: '' },
  { icon: CollageIcon, description: '' },
  { icon: RandomIcon, description: '' },
];

interface LayoutArgs {
  photo: ImageBitmap;
  cWidth: number;
  cHeight: number;
  index: number;
  ctx: CanvasRenderingContext2D;
}

function drawImages(
  canvas: HTMLCanvasElement,
  photos: Array<ImageBitmap>,
  layoutType: keyof typeof drawImage = 'quad'
) {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;

  ctx.fillStyle = bgColors[layoutType]();
  ctx.rect(0, 0, width, height);
  ctx.fill();

  photos.forEach((photo, index) => {
    const draw = drawImage[layoutType];
    draw({
      photo,
      cWidth: width,
      cHeight: height,
      index,
      ctx,
    });
  });
}

const drawImage: Record<string, (args: LayoutArgs) => void> = {
  quad: ({ photo, cWidth, cHeight, index, ctx }: LayoutArgs) => {
    const { width: pWidth, height: pHeight } = photo;
    const padding = Math.round(cWidth * photoPaddingRatio);
    const halfPadding = padding / 2;
    ctx.drawImage(
      photo,
      0,
      0,
      pWidth,
      pHeight,
      halfPadding + (index % 2) * (cWidth / 2),
      halfPadding + (index < 2 ? 0 : cHeight / 2),
      cWidth / 2 - padding,
      cHeight / 2 - padding
    );
  },
  quadtych: ({ photo, cWidth, cHeight, index, ctx }: LayoutArgs) => {
    const { width: pWidth, height: pHeight } = photo;
    const padding = Math.round(cWidth * photoPaddingRatio);
    const halfPadding = padding / 2;
    ctx.drawImage(
      photo,
      3 * (pWidth / 8),
      0,
      pWidth / 4,
      pHeight,
      halfPadding + (index % 4) * (cWidth / 4),
      halfPadding,
      cWidth / 4 - padding,
      cHeight - padding
    );
  },
  collage: ({ photo, cWidth, cHeight, index, ctx }: LayoutArgs) => {
    const { width: pWidth, height: pHeight } = photo;
    const padding = Math.round(cWidth * photoPaddingRatio);
    const halfPadding = padding / 2;

    switch (index) {
      case 0: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.6;
        const ratio = dWidth / dHeight;
        const sy = 0;
        const sx = pWidth / 2 - (pHeight * ratio) / 2;
        const sWidth = pHeight * ratio;
        ctx.drawImage(photo, sx, sy, sWidth, pHeight, halfPadding, halfPadding, dWidth - padding, dHeight - padding);
        return;
      }
      case 1: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.4;
        const ratio = dWidth / dHeight;
        const sy = pHeight / 2 - pWidth / ratio / 2;
        const sx = 0;
        const sHeight = pWidth / ratio;
        ctx.drawImage(
          photo,
          sx,
          sy,
          pWidth,
          sHeight,
          cWidth / 2 + halfPadding,
          halfPadding,
          dWidth - padding,
          dHeight - padding
        );
        return;
      }
      case 2: {
        const dWidth = cWidth * 0.5;
        const dHeight = cHeight * 0.4;
        const ratio = dWidth / dHeight;
        const sy = pHeight / 2 - pWidth / ratio / 2;
        const sx = 0;
        const sHeight = pWidth / ratio;
        ctx.drawImage(
          photo,
          sx,
          sy,
          pWidth,
          sHeight,
          halfPadding,
          cHeight * 0.6 + halfPadding,
          dWidth - padding,
          dHeight - padding
        );
        return;
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
        ctx.drawImage(
          photo,
          sx,
          sy,
          sWidth,
          pHeight,
          dx + halfPadding,
          dy + halfPadding,
          dWidth - padding,
          dHeight - padding
        );
        return;
      }

      default: {
        throw new Error('too many photos');
      }
    }
  },
  random: ({ photo, cWidth, cHeight, index, ctx }: LayoutArgs) => {
    const { width: pWidth, height: pHeight } = photo;
    const padding = Math.round(cWidth * photoPaddingRatio);
    const halfPadding = padding / 2;

    const x0 = (index % 2) * (cWidth / 2);
    const y0 = index < 2 ? 0 : cHeight / 2;
    const centerX = x0 + (index % 2 ? -cWidth / 40 : cWidth / 40);
    const centerY = y0 + (index < 2 ? cHeight / 40 : -cHeight / 40);
    const rotation = rotations()[index];

    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 10;
    ctx.fillRect(-halfPadding, -halfPadding, cWidth / 2 + padding, cHeight / 2 + padding);
    ctx.shadowColor = 'transparent';

    ctx.drawImage(photo, 0, 0, pWidth, pHeight, 0, 0, cWidth / 2, cHeight / 2);

    ctx.rotate(rotation * -1);
    ctx.translate(-centerX, -centerY);
  },
};

const bgColors: Record<keyof typeof drawImage, () => string> = {
  quad: () => '#FFFFFF',
  quadtych: () => '#FFFFFF',
  collage: () => '#FFFFFF',
  random: () => ['#f1f5f9', '#f0fdfa', '#f0f9ff', '#faf5ff'][Math.floor(rand(0, 4))],
};

const rotations = () => [rand(-0.12, -0.02), rand(0.02, 0.12), rand(0.02, 0.12), rand(-0.12, -0.02)];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
