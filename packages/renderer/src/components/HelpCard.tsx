import * as React from 'react';
import clsx from 'clsx';
import type { TransitionStatus } from 'react-transition-group';
import { transition } from '../modules';
import { Card } from './Card';
import { H2, Text } from './Text';

interface Item {
  icon: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  description: string;
}

interface Props {
  title?: string;
  description?: string;
  items: Array<Item>;
  status?: TransitionStatus;
}

const defaultTitle = 'What am I doing here?';

export function HelpCard({ description, items, status, title = defaultTitle }: Props) {
  return (
    <div
      className={clsx(
        'absolute top-0 left-0 w-screen h-screen p-12 overflow-hidden flex flex-col justify-end items-center',
        status ? transition(status, 'slideUp') : undefined
      )}
    >
      <Card blur>
        <div className="flex flex-col gap-2">
          {title ? <H2>{title}</H2> : null}
          {description ? <Text className="text-3xl">{description}</Text> : null}
          <div className="flex flex-row gap-8 justify-center">
            {items.map(({ icon: Icon, description }, i) => (
              <div className="flex flex-row gap-2 items-center" key={i}>
                <span className="rounded-xl p-2 bg-black/80">
                  <Icon />
                </span>
                <span className="text-2xl">{description}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
