"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium",
                    "text-gray-900 placeholder:text-gray-500/70",
                    "hover:border-gray-400 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "dark:bg-gray-800 dark:border-gray-600 dark:text-slate-200 dark:placeholder:text-slate-400/70",
                    "dark:hover:border-gray-500 dark:focus-visible:ring-blue-400 dark:ring-offset-gray-900",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };