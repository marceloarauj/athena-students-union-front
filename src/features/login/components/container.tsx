import clsx from 'clsx';
import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  const alignClasses = clsx(
    'z-2',
    'flex',
    'relative',
    'h-screen',
    'justify-center',
    'items-center',
  );
  const containerClasses = clsx(
    'w-4/5',
    'max-w-5xl',
    'grid',
    'grid-cols-1',
    'lg:grid-cols-2',
    'rounded-md',
    'overflow-hidden',
    'border-2',
    'border-gray-300',
    'min-h-[540px]',
  );

  return (
    <div className={alignClasses}>
      <div className={containerClasses}>{children}</div>
    </div>
  );
}
