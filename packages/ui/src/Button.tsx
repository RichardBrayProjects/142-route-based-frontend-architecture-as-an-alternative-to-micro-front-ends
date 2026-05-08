import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
