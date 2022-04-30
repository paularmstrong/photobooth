import * as React from 'react';

interface Props {
  seconds?: number;
  takePhoto: () => void;
}

export function Countdown({ seconds = 3, takePhoto }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [start] = React.useState(performance.now());

  const updateLeft = React.useCallback(
    function updateLeft() {
      if (ref.current) {
        const now = performance.now();
        const diff = (now - start) / 1000;
        ref.current.innerText = `${Math.ceil(seconds - diff)}`;
        if (diff <= seconds) {
          window.requestAnimationFrame(updateLeft);
        } else {
          takePhoto();
        }
      }
    },
    [start, seconds],
  );

  React.useEffect(() => {
    if (ref.current) {
      window.requestAnimationFrame(updateLeft);
    }
  }, [ref]);

  return <div ref={ref} className="text-4xl text-white" />;
}
