import React from "react";
import { cn } from "@/app/lib/utils"; // Utility for conditional class names

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl border bg-white shadow-sm p-4", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-2", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("text-xl font-semibold", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn("text-sm text-gray-700", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn("pt-4 border-t mt-4", className)} {...props} />
  );
}
