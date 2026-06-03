"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  HeartHandshake, 
  UserCircle, 
  Zap, 
  PlusCircle,
  Settings,
  LogOut,
  Database,
  Users
} from "lucide-react";
import { cn } from "@/utils/cn";
import { getDemoMeters } from "@/app/actions";
import { useEffect, useState } from "react";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check current role from localStorage or meter prefix
    const meterNumber = localStorage.getItem("meterNumber");
    if (meterNumber?.startsWith("MTR-MANOJ")) setRole("TEACHER");
    else if (meterNumber?.startsWith("MTR-PARENT")) setRole("PARENT");
    else if (meterNumber?.startsWith("MTR-RANJITH")) setRole("CHILD");
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Energy Gaps", href: "/needs", icon: HeartHandshake },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  const handleSwitch = async (role: string) => {
    const demos = await getDemoMeters();
    let targetId = "";
    
    if (role === "TEACHER") targetId = demos.teacher;
    if (role === "PARENT") targetId = demos.parent;
    if (role === "CHILD") targetId = demos.child;

    if (targetId) {
      localStorage.setItem("meterNumber", targetId);
      window.location.reload();
    }
  };

  if (pathname === "/") return null;

  const isAdmin = role === "TEACHER";

  return (
    <aside className={cn(
      "w-64 border-r border-neutral-200 bg-white/60 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-50",
      className
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <Zap className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
          Evolve
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-amber-50 text-amber-700 font-semibold shadow-sm" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon size={22} className={cn(
                "transition-colors",
                isActive ? "text-amber-500" : "text-neutral-400 group-hover:text-neutral-600"
              )} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4">
          <Link
            href="/needs/log"
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all transform hover:-translate-y-0.5 font-medium"
          >
            <PlusCircle size={22} />
            Log New Need
          </Link>
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 border-t border-neutral-100 space-y-1">
        {/* ADMIN TOOLS - ONLY FOR TEACHER */}
        {isAdmin && (
          <div className="px-4 py-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Admin Tools</p>
             <Link 
              href="/admin/database"
              className="flex items-center gap-3 px-4 py-2 text-sm text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100"
             >
               <Database size={18} />
               Database Explorer
             </Link>
          </div>
        )}

        <div className="px-4 py-2 mb-2">
           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Switch Account (Demo)</p>
           <div className="flex gap-2">
              {[
                { r: "TEACHER", label: "T", title: "Switch to Teacher" },
                { r: "PARENT", label: "P", title: "Switch to Parent" },
                { r: "CHILD", label: "C", title: "Switch to Child" }
              ].map((item) => (
                <button 
                  key={item.r}
                  title={item.title}
                  onClick={() => handleSwitch(item.r)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all shadow-sm",
                    role === item.r ? "bg-amber-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-amber-100"
                  )}
                >
                  {item.label}
                </button>
              ))}
           </div>
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
