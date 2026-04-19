import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'dark' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_0_0_rgba(25,26,35,0.2)]',
      secondary: 'bg-secondary text-dark hover:bg-secondary/80 border-2 border-dark',
      outline: 'border-2 border-dark bg-transparent hover:bg-dark hover:text-white text-dark',
      dark: 'bg-dark text-white hover:bg-dark/90',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition-all active:translate-y-[2px] active:shadow-none disabled:opacity-50',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex w-full rounded-2xl border-2 border-dark bg-white px-6 py-4 text-sm transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-secondary/30',
          className
        )}
        {...props}
      />
    );
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex w-full rounded-2xl border-2 border-dark bg-white px-6 py-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-secondary/30 appearance-none cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

export const Badge = ({ children, variant = 'available', className }: { children: React.ReactNode, variant?: 'available' | 'sold' | 'outline', className?: string }) => {
  const variants = {
    available: 'bg-secondary text-dark border-dark',
    sold: 'bg-zinc-200 text-zinc-600 border-zinc-400',
    outline: 'bg-white border-dark/20 text-dark',
  };

  return (
    <span className={cn('px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border-2', variants[variant], className)}>
      {children}
    </span>
  );
};
