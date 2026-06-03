"use client";

import * as React from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-3xl glass-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
