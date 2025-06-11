"use client";

import * as React from "react";
import { DayPicker as CalendarPrimitive } from "react-day-picker";
import { cn } from "@/app/lib/utils"; // or replace with your classNames utility

import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof CalendarPrimitive>;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <CalendarPrimitive
      className={cn(
        "p-3 bg-neutral-900 text-white rounded-md shadow-md",
        className
      )}
      {...props}
    />
  );
}
