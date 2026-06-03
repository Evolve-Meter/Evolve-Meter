"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface EnergyMeterProps {
  needed: number;
  fulfilled: number;
  className?: string;
}

export function EnergyMeter({ needed, fulfilled, className }: EnergyMeterProps) {
  const percentage = needed > 0 ? Math.min(100, Math.round((fulfilled / needed) * 100)) : 0;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center w-40 h-40", className)}>
      {/* Background circle */}
      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="stroke-muted fill-none"
          strokeWidth="12"
        />
        {/* Foreground circle with animation */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          className="stroke-amber-400 fill-none drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400"
        >
          {percentage}%
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1 font-medium">Energy Flow</span>
      </div>
    </div>
  );
}
