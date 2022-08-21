import * as React from 'react';
import { toCanvas } from 'qrcode';

interface Props {
  url: string;
}

export function QrCode({ url }: Props) {
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    if (!canvas.current || !url) {
      return;
    }

    const { width, height } = canvas.current.getBoundingClientRect();

    toCanvas(canvas.current, url, {
      width: Math.min(width, height),
      margin: 0,
      color: { light: '#ffffff00', dark: '#0f766e' },
    });
  }, [url, canvas]);

  return <canvas ref={canvas} className="w-full h-full aspect-1 mx-auto" />;
}
