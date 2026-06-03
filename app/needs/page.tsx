"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { NeedCard } from "@/components/NeedCard";
import { getNeeds, proposeFulfillment, confirmFulfillment, getMeterStats } from "../actions";
import { Need } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap } from "lucide-react";

export default function NeedsPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [meterNumber, setMeterNumber] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  const loadData = async () => {
    const mNumber = localStorage.getItem("meterNumber");
    if (!mNumber) return;
    try {
      const [needsData, stats] = await Promise.all([
        getNeeds(mNumber),
        getMeterStats(mNumber)
      ]);
      setNeeds(needsData as any);
      setCurrentUser(stats?.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePropose = async (id: string) => {
    if (!meterNumber) return;
    try {
      await proposeFulfillment(id, meterNumber);
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await confirmFulfillment(id);
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // NEW: HANDLE DELETE LOCALLY FOR INSTANT REFRESH
  const handleDeleteLocal = (id: string) => {
    setNeeds((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNeeds = needs.filter(n => {
    if (filter === "ALL") return true;
    return n.status === filter;
  });

  return (
    <AppLayout title="Community Energy Gaps">
      <div className="space-y-6 pb-12">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/50">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" placeholder="Search gaps..." className="w-full pl-10 pr-4 py-2 bg-white/50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
           </div>
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {["ALL", "LOGGED", "PENDING", "FULFILLED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filter === f 
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                      : "bg-white text-neutral-500 border border-neutral-100 hover:bg-neutral-50"
                  }`}
                >
                  {f === "LOGGED" ? "ACTIVE" : f === "PENDING" ? "VERIFYING" : f}
                </button>
              ))}
           </div>
        </div>

        {/* Teacher Alert */}
        {currentUser?.role === "TEACHER" && needs.some(n => n.status === "PENDING") && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-600 rounded-2xl text-white flex items-center justify-between shadow-xl">
             <div className="flex items-center gap-3">
                <Zap className="animate-pulse" />
                <p className="text-sm font-bold">You have items awaiting verification!</p>
             </div>
          </motion.div>
        )}

        {/* Needs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground animate-pulse font-medium">Scanning...</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNeeds.map((need) => (
                <motion.div key={need.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <NeedCard
                    need={need}
                    currentUserId={currentUser?.id || ""}
                    userRole={currentUser?.role}
                    onUpdate={() => handlePropose(need.id)}
                    onVerify={() => handleVerify(need.id)}
                    onDelete={() => handleDeleteLocal(need.id)} // CONNECTED DELETE CALLBACK
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {!loading && filteredNeeds.length === 0 && (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-4 bg-white/20 rounded-[3rem] border-2 border-dashed border-neutral-200">
              <p className="font-bold text-neutral-400">No records found.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
