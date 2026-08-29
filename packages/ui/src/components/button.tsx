import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={['rounded-md bg-black px-4 py-2 text-white', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
