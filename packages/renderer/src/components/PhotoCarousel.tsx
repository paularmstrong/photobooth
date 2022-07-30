import * as React from 'react';
import clsx from 'clsx';
import { useLocation } from '../context';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { transition } from '../modules';
import { Photo } from './Photo';

export function PhotoCarousel() {
  const {
    state: { photos },
  } = useLocation();
  const photoBuckets = React.useMemo(
    () =>
      photos.reduce(
        (memo, photo, index) => {
          memo[index % 3].push({ photo, index: photos.length - 1 - index });
          return memo;
        },
        new Array(MAX_PHOTOS).fill(null).map(() => [] as Array<{ photo: string; index: number }>)
      ),
    [photos]
  );
  const [sliceStart, setSliceStart] = React.useState(0);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    function run() {
      timeout = setTimeout(() => {
        setSliceStart((start) => (start + 1 >= photos.length ? 0 : start + 1));
        run();
      }, 3_000);
    }

    run();

    return () => {
      clearTimeout(timeout);
    };
  }, [photos]);

  return (
    <div className="flex flex-row gap-6 max-w-screen-2xl self-center justify-center">
      {photoBuckets.map((bucket, i) => {
        if (!bucket.length) {
          return null;
        }
        let visible = bucket.find(({ index }) => isVisible(sliceStart, MAX_PHOTOS, index, photos.length));

        if (!visible) {
          visible = bucket[bucket.length - 1];
        }
        return (
          <SwitchTransition key={i} mode="out-in">
            <CSSTransition appear key={visible.index} timeout={250}>
              {(status) => (
                <div className={clsx('shadow-2xl basis-1/3', transition(status, 'zoomRotate', i))}>
                  <Photo src={`pb:${visible!.photo}`} />
                </div>
              )}
            </CSSTransition>
          </SwitchTransition>
        );
      })}
    </div>
  );
}

function isVisible(sliceStart: number, count: number, index: number, total: number) {
  const visible = index >= sliceStart && index < sliceStart + count;
  if (visible) {
    return true;
  }
  const wrap = sliceStart + count - total;
  return wrap > 0 && index < wrap;
}

const MAX_PHOTOS = 3;
