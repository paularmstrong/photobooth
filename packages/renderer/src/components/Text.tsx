import * as React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: Props) {
  return <h1 className={clsx('text-8xl font-semibold', className)}>{children}</h1>;
}

export function H2({ children, className }: Props) {
  return <h2 className={clsx('text-4xl font-semibold', className)}>{children}</h2>;
}

export function H3({ children, className }: Props) {
  return <h3 className={clsx('text-2xl font-semibold', className)}>{children}</h3>;
}

export function H4({ children, className }: Props) {
  return <h4 className={clsx('text-xl font-semibold', className)}>{children}</h4>;
}

export function H5({ children, className }: Props) {
  return <h5 className={clsx('text-lg font-semibold', className)}>{children}</h5>;
}

export function H6({ children, className }: Props) {
  return <h6 className={clsx('text-base', className)}>{children}</h6>;
}

export function Text({ children, className }: Props) {
  return <p className={clsx('text-lg', className)}>{children}</p>;
}
