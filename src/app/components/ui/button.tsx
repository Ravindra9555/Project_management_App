// components/ui/button.tsx
"use client";
import * as React from "react";
import { cn } from "@/app/lib/utils";
import { HTMLMotionProps } from "framer-motion";
import { motion } from 'framer-motion'; // ✅
export { motion }; // ✅

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  rounded?: "default" | "full";
  hoverEffect?: "scale" | "translate";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      rounded = "default",
      hoverEffect = "scale",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        whileHover={hoverEffect === "scale" ? { scale: 1.05 } : { y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-emerald-600 text-white hover:bg-emerald-700",
          variant === "outline" &&
            "border border-neutral-700 bg-transparent text-neutral-100 hover:bg-neutral-800",
          variant === "ghost" &&
            "bg-transparent text-neutral-100 hover:bg-neutral-800",
          variant === "link" &&
            "text-neutral-100 underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          rounded === "default" && "rounded-md",
          rounded === "full" && "rounded-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };