import { h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  seconds?: number;
  takePhoto: () => void;
}

export function Countdown({ seconds = 3, takePhoto }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start] = useState(performance.now());

  const updateLeft = useCallback(
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

  useEffect(() => {
    if (ref.current) {
      window.requestAnimationFrame(updateLeft);
    }
  }, [ref]);

  return <div ref={ref} class="text-4xl text-white" />;
}
