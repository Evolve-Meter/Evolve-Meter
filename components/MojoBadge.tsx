"use client";

import { Badge } from "./ui/Badge";
import { cn } from "@/utils/cn";
import {
  BookOpen,
  Apple,
  ShieldAlert,
  HeartPulse,
  Wrench,
  BatteryCharging,
  Sparkles,
} from "lucide-react";
import React from "react";

interface CategoryStyle {
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

const categoryConfig: Record<string, CategoryStyle> = {
  Learning: {
    colorClass: "text-blue-600",
    bgClass: "bg-blue-100",
    icon: <BookOpen size={14} className="mr-1" />,
  },
  Nutrition: {
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
    icon: <Apple size={14} className="mr-1" />,
  },
  Safety: {
    colorClass: "text-red-600",
    bgClass: "bg-red-100",
    icon: <ShieldAlert size={14} className="mr-1" />,
  },
  Wellbeing: {
    colorClass: "text-purple-600",
    bgClass: "bg-purple-100",
    icon: <HeartPulse size={14} className="mr-1" />,
  },
  Tools: {
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100",
    icon: <Wrench size={14} className="mr-1" />,
  },
  Restoration: {
    colorClass: "text-teal-600",
    bgClass: "bg-teal-100",
    icon: <BatteryCharging size={14} className="mr-1" />,
  },
  Care: {
    colorClass: "text-pink-600",
    bgClass: "bg-pink-100",
    icon: <HeartPulse size={14} className="mr-1" />,
  },
  Mobility: {
    colorClass: "text-indigo-600",
    bgClass: "bg-indigo-100",
    icon: <Sparkles size={14} className="mr-1" />,
  },
};

const defaultStyle: CategoryStyle = {
  colorClass: "text-neutral-600",
  bgClass: "bg-neutral-100",
  icon: <Sparkles size={14} className="mr-1" />,
};

interface MojoBadgeProps {
  category: string;
  className?: string;
}

export function MojoBadge({ category, className }: MojoBadgeProps) {
  const config = categoryConfig[category] ?? defaultStyle;

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-none flex items-center pr-3",
        config.bgClass,
        config.colorClass,
        className
      )}
    >
      {config.icon}
      {category}
    </Badge>
  );
}
