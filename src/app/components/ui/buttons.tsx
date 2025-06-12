// In: app/components/ui/button.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils"; // Or your correct path to cn

// --- THIS IS THE `buttonVariants` OBJECT ---
// We will define it once and use it everywhere.
// I've added your 'destructive' variant here.
const buttonVariants = cva(
  // Base classes applied to all buttons
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // Different style variants
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-neutral-700 bg-transparent text-neutral-100 hover:bg-neutral-800",
        ghost: "bg-transparent text-neutral-100 hover:bg-neutral-800",
        link: "text-emerald-500 underline-offset-4 hover:underline",
        secondary: "bg-neutral-800 text-neutral-50 hover:bg-neutral-800/80", // Added from your previous definition
      },
      // Different size variants
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      // Your custom 'rounded' variant
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      }
    },
    // Default styles if none are specified
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

// --- Define the props for our enhanced Button component ---
// It includes framer-motion props and our custom variants.
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof motion.button>,
    VariantProps<typeof buttonVariants> {
  hoverEffect?: "scale" | "translate";
}

// --- The Refactored Button Component ---
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant, // We now get variant, size, and rounded from props
      size,
      rounded,
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
        // The magic happens here: we call buttonVariants to get the correct classes
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";


// --- EXPORT BOTH THE COMPONENT AND THE VARIANTS ---
export { Button, buttonVariants };