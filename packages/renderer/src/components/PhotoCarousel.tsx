import * as React from 'react';
import clsx from 'clsx';
import { useLocation } from '../context';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Photo } from './Photo';

export function PhotoCarousel() {
  const {
    state: { photos },
  } = useLocation();
  const photoBuckets = React.useMemo(
    () =>
      photos.reduce(
        (memo, photo, index) => {
          memo[index % 3].push({
            photo,
            index: photos.length - 1 - index,
            rotation: rotations[Math.floor(Math.random() * rotations.length)],
          });
          return memo;
        },
        new Array(MAX_PHOTOS).fill(null).map(() => [] as Array<{ photo: string; index: number; rotation: string }>)
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
    <div className="flex flex-row gap-6 max-w-screen-2xl self-center">
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
            <CSSTransition appear key={visible.index} classNames={transitionClassnames(visible.rotation)} timeout={300}>
              <Photo src={`pb:${visible.photo}`} />
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

function transitionClassnames(rotation: string) {
  return {
    appear: clsx(allClasses, initial),
    appearActive: clsx(allClasses, initial),
    appearDone: clsx(allClasses, rotation, 'opacity-1 scale-100 transition-all ease-in-out duration-300'),
    enter: clsx(allClasses, initial),
    enterActive: clsx(allClasses, initial),
    enterDone: clsx(allClasses, rotation, 'opacity-1 scale-100 transition-all ease-in-out duration-300'),
    exit: clsx(allClasses, rotation, 'opacity-1 scale-100'),
    exitActive: clsx(allClasses, 'opacity-0 -rotate-90 scale-50 transition-all ease-in-out duration-300'),
    exitDone: clsx(allClasses, 'opacity-0'),
  };
}

const initial = 'opacity-0 rotate-90 scale-125';
const allClasses = 'shadow-2xl';

const rotations = [
  'rotate-6',
  '-rotate-6',
  'rotate-3',
  '-rotate-3',
  'rotate-12',
  '-rotate-12',
  'rotate-2',
  '-rotate-2',
];
