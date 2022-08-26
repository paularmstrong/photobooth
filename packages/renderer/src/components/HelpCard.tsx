import * as React from 'react';
import clsx from 'clsx';
import type { TransitionStatus } from 'react-transition-group';
import { keyImages, transition } from '../modules';
import { Card } from './Card';
import { H2, Text } from './Text';
import { useLocation } from '../context';

interface Props {
  title?: string;
  description?: string;
  keysWithoutDescription?: boolean;
  status?: TransitionStatus;
}

const defaultTitle = 'What am I doing here?';

export function HelpCard({ description, keysWithoutDescription = true, status, title = defaultTitle }: Props) {
  const {
    state: { keys },
  } = useLocation();

  const rememberedKeys = React.useMemo(
    () => keys.filter((key) => key && (keysWithoutDescription || key.description)),
    []
  );

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-screen h-screen p-12 overflow-hidden flex flex-col justify-end items-center',
        status ? transition(status, 'slideUp') : undefined
      )}
    >
      <Card blur className="min-w-[512px]">
        {title ? <H2>{title}</H2> : null}
        {description ? <Text className="text-3xl">{description}</Text> : null}
        <div className="flex flex-row gap-12 justify-around">
          {rememberedKeys.map((key, i) => {
            const Icon = keyImages[key!.key];
            return (
              <div className={clsx('flex flex-col gap-2 items-center')} key={i}>
                <button
                  className="rounded-xl p-2 bg-black/80"
                  onClick={() => {
                    window.api.send('transition', { type: key!.type, key: key!.key });
                  }}
                >
                  <Icon />
                </button>
                {key!.description ? <span className="text-2xl">{key!.description}</span> : null}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
