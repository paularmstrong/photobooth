import { h } from 'preact';
import type * as Preact from 'preact';

interface Props {
  children: Preact.ComponentChildren;
  color?: keyof typeof ButtonColors;
  disabled?: boolean;
  href?: string;
  onPress?: (event: Event) => void;
  type?: keyof typeof ButtonTypes;
}

export function Button({
  children,
  color = 'teal',
  disabled = false,
  href,
  onPress,
  type = 'contained',
  ...attrs
}: Props) {
  let classes = `whitespace-nowrap flex flex-col items-center space-x-1 ${ButtonTypes[type]} ${
    ButtonColors[disabled ? 'disabled' : color][type]
  } font-sans inline-flex font-bold text-base px-4 py-2 rounded outline-none focus:outline-none ring-opacity-50 transition-shadow transition-colors ${
    disabled ? 'cursor-not-allowed' : 'focus:ring-2 cursor-pointer'
  }`;

  if (disabled) {
    classes = classes.replace(/(?:focus|active|hover):[^ ]+/g, '');
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      onPress && onPress(event);
    }
  }

  const Element = href ? 'a' : 'div';

  return (
    <Element
      role="button"
      aria-disabled={disabled ? 'true' : 'false'}
      tabIndex={0}
      className={classes}
      href={href}
      onClick={disabled ? undefined : onPress}
      onKeyUp={handleKeyUp}
      {...attrs}
    >
      {children}
    </Element>
  );
}

const ButtonTypes = {
  contained: 'text-white shadow focus:shadow-xl hover:shadow-md',
  outlined: '',
  text: 'transition-opacity',
};

const ButtonColors = {
  teal: {
    contained: 'bg-teal-500 focus:bg-teal-400 active:bg-teal-600 ring-teal-300',
    outlined:
      'text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:bg-opacity-20 focus:bg-teal-500 focus:bg-opacity-40 active:bg-teal-500 active:bg-opacity-40',
    text: 'text-teal-500 hover:bg-teal-500 hover:bg-opacity-20 focus:bg-teal-500 focus:bg-opacity-40 active:bg-teal-500 active:bg-opacity-40',
  },
  red: {
    contained: 'bg-red-500 focus:bg-red-400 active:bg-red-600 ring-red-300',
    outlined:
      'text-red-500 border-2 border-red-500 hover:bg-red-500 hover:bg-opacity-20 focus:bg-red-500 focus:bg-opacity-40 active:bg-red-500 active:bg-opacity-40',
    text: 'text-red-500 hover:bg-red-500 hover:bg-opacity-20 focus:bg-red-500 focus:bg-opacity-40 active:bg-red-500 active:bg-opacity-40',
  },
  green: {
    contained: 'bg-green-500 focus:bg-green-400 active:bg-green-600 ring-green-300',
    outlined:
      'text-green-500 border-2 border-green-500 hover:bg-green-500 hover:bg-opacity-20 focus:bg-green-500 focus:bg-opacity-40 active:bg-green-500 active:bg-opacity-40',
    text: 'text-green-500 hover:bg-green-500 hover:bg-opacity-20 focus:bg-green-500 focus:bg-opacity-40 active:bg-green-500 active:bg-opacity-40',
  },
  gray: {
    contained: 'bg-gray-500 focus:bg-gray-400 active:bg-gray-600 ring-gray-300',
    outlined:
      'text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:bg-opacity-20 focus:bg-gray-500 focus:bg-opacity-40 active:bg-gray-500 active:bg-opacity-40',
    text: 'text-gray-500 hover:bg-gray-500 hover:bg-opacity-20 focus:bg-gray-500 focus:bg-opacity-40 active:bg-gray-500 active:bg-opacity-40',
  },
  disabled: {
    contained: 'bg-gray-400',
    outlined:
      'text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:bg-opacity-20 focus:bg-gray-500 focus:bg-opacity-40 active:bg-gray-500 active:bg-opacity-40',
    text: 'text-gray-500 hover:bg-gray-500 hover:bg-opacity-20 focus:bg-gray-500 focus:bg-opacity-40 active:bg-gray-500 active:bg-opacity-40',
  },
  black: {
    contained: '',
    outlined: '',
    text: 'text-black',
  },
};
