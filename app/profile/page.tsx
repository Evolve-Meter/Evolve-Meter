"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/Card";
import { User, Award, Zap, Heart, Shield, LogOut, Settings, TrendingUp, Users } from "lucide-react";
import { getMeterStats } from "../actions";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const mNumber = localStorage.getItem("meterNumber");
      if (mNumber) {
        const data = await getMeterStats(mNumber);
        setStats(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const role = stats?.user?.role || "STUDENT";
  const points = stats?.user?.points || 0;
  const level = stats?.user?.level || 1;
  const shared = stats?.joulesFulfilled || 0; // The energy they contributed

  return (
    <AppLayout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border-4 border-white shadow-xl">
              <User size={40} className="text-amber-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
              LVL {level}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-neutral-800">{stats?.user?.name || "Member"}</h2>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stats?.meterNumber} • {role}</p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="p-8 bg-white border-neutral-100 text-center space-y-2 shadow-sm">
              <p className="text-4xl font-black text-amber-500">{points}</p>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Total XP Points</p>
           </Card>
           <Card className="p-8 bg-white border-neutral-100 text-center space-y-2 shadow-sm">
              <p className="text-4xl font-black text-emerald-500">{Math.round(shared)}</p>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Joules Shared</p>
           </Card>
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
           <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest text-left px-1">Achievements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Generous", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", desc: "Helped 5 community members" },
                { name: "Visionary", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", desc: "Logged 10 energy gaps" },
                { name: "Guardian", icon: Shield, color: "text-blue-500", bg: "bg-blue-50", desc: "Verified 3 fulfillment events" }
              ].map((ach) => (
                <Card key={ach.name} className="p-6 flex flex-col items-center text-center space-y-3 bg-white border-neutral-100 shadow-sm opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                  <div className={`w-12 h-12 rounded-2xl ${ach.bg} ${ach.color} flex items-center justify-center`}>
                    <ach.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">{ach.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-medium">{ach.desc}</p>
                  </div>
                </Card>
              ))}
           </div>
           <p className="text-center text-[10px] text-neutral-300 italic">Complete needs to unlock your first badge!</p>
        </div>

        {/* Community Impact Chart */}
        <Card className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-100">
           <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-indigo-200" />
              <h3 className="font-bold text-lg">School Community Impact</h3>
           </div>
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
                 <span className="font-black text-xl">75%</span>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed max-w-xs text-left">
                 Your school has bridged <span className="font-bold text-white">75% of its energy gaps</span> this month. You contributed <span className="font-bold text-white">60% of this progress!</span>
              </p>
           </div>
        </Card>

        {/* Settings Buttons */}
        <div className="grid grid-cols-1 gap-2">
           <button className="w-full p-4 bg-white border border-neutral-100 rounded-2xl text-left text-sm font-bold text-neutral-600 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
              <Settings size={18} /> Account Settings
           </button>
           <button 
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full p-4 bg-rose-50 border border-rose-100 rounded-2xl text-left text-sm font-bold text-rose-600 flex items-center gap-3 hover:bg-rose-100 transition-colors"
           >
              <LogOut size={18} /> Log Out
           </button>
        </div>
      </div>
    </AppLayout>
  );
}
