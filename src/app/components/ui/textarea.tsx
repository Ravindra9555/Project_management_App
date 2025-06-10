import React from "react";
import { cn } from "@/app/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "ghost";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md px-3 py-2 text-sm resize-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variant === "default"
            ? "bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-emerald-500 focus-visible:ring-offset-neutral-900"
            : "bg-transparent border-none text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-emerald-500",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
