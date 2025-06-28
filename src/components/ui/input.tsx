import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
          "border-gray-300 dark:border-gray-700", // Border colors for light/dark
          "text-gray-900 dark:text-white", // Text colors
          "placeholder:text-gray-500 dark:placeholder:text-gray-400", // Placeholder colors
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:focus-visible:ring-red-500", // Ring with primary color
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900 dark:file:text-white", // File input styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }