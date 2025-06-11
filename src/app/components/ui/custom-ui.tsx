// In: app/components/ui/custom-ui.tsx

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

// --- UTILITY FUNCTION (You might already have this, if so, you can skip it) ---
// This function merges Tailwind CSS classes without conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- BADGE COMPONENT ---

const badgeVariants = cva(
  // Base styles for all badges
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    // Different style variants
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-600 text-neutral-50 hover:bg-emerald-600/80",
        secondary:
          "border-transparent bg-neutral-700 text-neutral-200 hover:bg-neutral-700/80",
        destructive:
          "border-transparent bg-red-600 text-neutral-50 hover:bg-red-600/80",
        outline: "text-neutral-200 border-neutral-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// --- SEPARATOR COMPONENT ---

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
  }
>(
  (
    { className, orientation = "horizontal", ...props },
    ref
  ) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-neutral-800", // Using a dark-theme friendly color
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";


// --- SKELETON COMPONENT ---

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-800", // Darker neutral for the pulse effect
        className
      )}
      {...props}
    />
  );
}

// --- EXPORT ALL COMPONENTS ---
export { Badge, Separator, Skeleton };