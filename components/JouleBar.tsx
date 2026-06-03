"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface JouleBarProps {
  needed: number;
  fulfilled: number;
  className?: string;
}

export function JouleBar({ needed, fulfilled, className }: JouleBarProps) {
  const percentage = needed > 0 ? (fulfilled / needed) * 100 : 0;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between text-sm font-medium">
        <span className="text-amber-500">{fulfilled}J Fulfilled</span>
        <span className="text-muted-foreground">{needed}J Needed</span>
      </div>
      <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
