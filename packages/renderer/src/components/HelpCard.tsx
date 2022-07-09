import * as React from 'react';
import { Card } from './Card';
import { H2, Text } from './Text';
import clsx from 'clsx';

interface Item {
  icon: string;
  description: string;
}

interface Props {
  title?: string;
  description?: string;
  items: Array<Item>;
  visible?: boolean;
}

const defaultTitle = 'What am I doing here?';

export function HelpCard({ description, items, title = defaultTitle, visible = false }: Props) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen p-12 overflow-hidden flex flex-col justify-end items-center">
      <div
        className={clsx('transition-[transform,opacity] duration-500 delay-100', {
          'opacity-1 translate-y-0': visible,
          'opacity-0 translate-y-24': !visible,
        })}
      >
        <Card blur>
          <div className="flex flex-col gap-2">
            {title ? <H2>{title}</H2> : null}
            {description ? <Text className="text-3xl">{description}</Text> : null}
            <div className="flex flex-row gap-8 justify-center">
              {items.map(({ icon, description }, i) => (
                <div className="flex flex-row gap-2 items-center" key={i}>
                  <span className="rounded-xl p-2 bg-black/80">
                    <img src={icon} />
                  </span>
                  <span className="text-2xl">{description}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
