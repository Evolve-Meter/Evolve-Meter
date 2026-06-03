"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout({ children, title, action }: { 
  children: React.ReactNode, 
  title?: string,
  action?: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-neutral-50/50">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header - Centered for Short Box look */}
        {(title || action) && (
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-neutral-100 w-full">
            <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <div className="text-left">
                {title && <h1 className="text-xl md:text-2xl font-bold text-neutral-800 tracking-tight">{title}</h1>}
              </div>
              {action && <div className="flex items-center gap-4">{action}</div>}
            </div>
          </header>
        )}
        
        {/* Content Area - Centered Max-Width Box */}
        <div className="flex-1 w-full flex justify-center p-6 md:p-8">
          <div className="w-full max-w-6xl">
            {children}
          </div>
        </div>
        
        {/* Mobile Spacer */}
        <div className="h-24 md:hidden" />
      </main>

      <BottomNav className="md:hidden z-50" />
    </div>
  );
}
