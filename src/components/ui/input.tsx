import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-4 py-2 text-base shadow-sm transition-all duration-300",
          "border-gray-200 dark:border-gray-700", // Border colors matching Card
          "text-gray-900 dark:text-gray-100", // Text colors matching Card
          "placeholder:text-gray-500 dark:placeholder:text-gray-400", // Placeholder colors matching CardDescription
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gradient-to-r focus-visible:ring-blue-500 dark:focus-visible:ring-blue-600", // Gradient ring for focus
          "hover:border-blue-300 dark:hover:border-blue-600", // Hover border matching GroupHistory
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900 dark:file:text-gray-100", // File input styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm tracking-tight", // Typography matching CardTitle
          className
        )}
        ref={ref}
        {...props}
        aria-label={props["aria-label"] || "Input field"} // Ensure accessibility
      />
    );
  }
);
Input.displayName = "Input";

export { Input };