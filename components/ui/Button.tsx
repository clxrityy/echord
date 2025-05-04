import { ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<'button'>;

export function Button({
  children,
  ...props
}: { children: ReactNode } & ButtonProps) {
  return (
    <button
      role={props.role}
      type={props.type ?? 'button'}
      aria-label={props['aria-label']}
      {...props}
      className={`cursor-pointer ${props.className}`}
    >
      {children}
    </button>
  );
}
