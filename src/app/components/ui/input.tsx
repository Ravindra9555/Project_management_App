import React from "react";
import { cn } from "@/app/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variant === "default"
            ? "bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-emerald-500 focus-visible:ring-offset-neutral-900"
            : "bg-transparent border-none text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-emerald-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };