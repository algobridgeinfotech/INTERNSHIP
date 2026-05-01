import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const MotionComp = motion.create(Comp)

    return (
      <MotionComp
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:shadow-sky-500/25": variant === "default",
            "border border-sky-200 bg-transparent hover:bg-sky-50 text-sky-900 dark:border-sky-800 dark:text-sky-100 dark:hover:bg-sky-900/50": variant === "outline",
            "hover:bg-secondary  text-secondary-foreground ": variant === "ghost",
            "glass text-foreground  hover:bg-white/80 /80": variant === "glass",
            "h-10 px-6 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
