"use client"

import { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  hoverLift?: boolean
}

export function GlassCard({ children, className, hoverLift = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverLift ? { y: -8, transition: { duration: 0.2 } } : undefined}
      className={cn("glass-card overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
