"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, HeartHandshake, UserCircle, PlusCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Needs", href: "/needs", icon: HeartHandshake },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-neutral-200 p-2 pb-safe md:hidden z-50">
      <div className="flex justify-around items-center h-14 relative">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                isActive ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <motion.div
                animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-amber-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
        {/* Floating Action Button for logging Needs  */}
        <Link 
          href="/needs/log"
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full p-4 shadow-xl shadow-amber-200 border-4 border-white"
          >
            <PlusCircle size={32} />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
