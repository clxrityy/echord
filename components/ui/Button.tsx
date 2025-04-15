import { ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<'button'>;

export function Button({
  children,
  ...props
}: { children: ReactNode } & ButtonProps) {
  return (
    <button
      role='button'
      type='button'
      {...props}
      className={`cursor-pointer ${props.className}`}
    >
      {children}
    </button>
  );
}
