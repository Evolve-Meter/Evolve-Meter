"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { EnergyMeter } from "@/components/EnergyMeter";
import { JouleBar } from "@/components/JouleBar";
import { Card } from "@/components/ui/Card";
import { Copy, PlusCircle, Share2, Zap, CheckCheck, QrCode, Users, Activity as ActivityIcon, Heart, X, Globe, ShieldCheck, TrendingUp, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getMeterStats, getSchoolStats, getClassroomRoster, getPublicUrl, deleteActivity } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveQR } from "@/components/InteractiveQR";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [schoolStats, setSchoolStats] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const meterNumber = localStorage.getItem("meterNumber");
      if (!meterNumber) {
        setLoading(false);
        return;
      }

      try {
        const [meterData, schoolData, rosterData, pUrl] = await Promise.all([
          getMeterStats(meterNumber),
          getSchoolStats(),
          getClassroomRoster(),
          getPublicUrl()
        ]);
        setStats(meterData);
        setSchoolStats(schoolData);
        setRoster(rosterData);
        setPublicUrl(pUrl);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivity(id);
      setSchoolStats((prev: any) => ({
        ...prev,
        recentActivities: prev.recentActivities.filter((a: any) => a.id !== id)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const role = stats?.user?.role || "TEACHER";
  const shareUrl = publicUrl || (typeof window !== 'undefined' ? window.location.origin : "https://evolvemeter.com");

  return (
    <AppLayout
      title={`${role.charAt(0) + role.slice(1).toLowerCase()} Dashboard`}
      action={
        <div className="flex gap-2">
          <Button onClick={() => setShowQr(true)} variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <QrCode className="w-4 h-4" /> Share QR
          </Button>
        </div>
      }
    >
      <div className="space-y-8 pb-12">
        {/* Greetings & Stewardship Status */}
        <div className="px-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div className="text-left">
             <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
               {role === "TEACHER" ? "Hello, Educator! 📚" : role === "PARENT" ? "Welcome, Guardian! ❤️" : "Hey there, Hero! ⚡"}
             </h2>
             <p className="text-muted-foreground">Monitor and manage community energy flows.</p>
           </div>
           <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Stewardship Locked: Phase 3</span>
           </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 bg-white border-neutral-100 relative overflow-hidden shadow-sm">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <EnergyMeter needed={stats?.joulesNeeded || 0} fulfilled={stats?.joulesFulfilled || 0} className="scale-110" />
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-neutral-700">{stats?.user?.name || "Member"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase tracking-tighter">LEVEL {stats?.user?.level || 1}</span>
                       <span className="text-xs text-neutral-400 font-bold uppercase tracking-tighter">{stats?.user?.points || 0} XP</span>
                    </div>
                  </div>
                  <JouleBar needed={stats?.joulesNeeded || 0} fulfilled={stats?.joulesFulfilled || 0} />
                  <div className="flex items-center justify-between bg-neutral-50 p-2 px-4 rounded-xl border border-neutral-100">
                    <span className="font-mono text-xs text-neutral-500">{stats?.meterNumber || "Loading..."}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(stats.meterNumber)} className="h-8 text-amber-600">
                      {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-200 flex flex-col justify-between text-left">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-200" />
              <h3 className="font-semibold text-lg text-indigo-50">School Pulse</h3>
            </div>
            <div className="space-y-4">
               <div>
                 <div className="text-4xl font-bold">{Math.round(schoolStats?.totals?._sum?.joulesFulfilled || 0)}J</div>
                 <div className="text-[10px] text-indigo-200 uppercase tracking-widest font-black">Fulfilled State</div>
               </div>
               <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
               </div>
               <div className="flex justify-between text-[10px] text-indigo-100 font-bold uppercase tracking-tight">
                 <span>{schoolStats?.activeMeters || 0} Meters Active</span>
                 <span>72% Growth</span>
               </div>
            </div>
          </Card>
        </div>

        {/* Global Context */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <Card className="lg:col-span-3 p-6 bg-white border-neutral-100 shadow-sm overflow-hidden relative text-left">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <Globe size={160} />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                       <TrendingUp size={20} />
                       <h3 className="font-black text-xs uppercase tracking-widest">Global Energy Projection</h3>
                    </div>
                    <p className="text-2xl font-bold text-neutral-800">1,248,500 <span className="text-neutral-400 font-normal text-lg">Total Network Joules</span></p>
                    <p className="text-xs text-neutral-500 max-w-md">Your school is currently contributing <span className="font-bold text-neutral-800">0.04%</span> to the global energy network.</p>
                 </div>
                 <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                    <Globe size={20} />
                 </div>
              </div>
           </Card>
           
           <Card className="p-6 bg-amber-500 text-white border-none shadow-xl shadow-amber-100 flex flex-col justify-center items-center text-center">
              <Info size={24} className="mb-2 opacity-80" />
              <h4 className="font-bold text-sm">Value Logic</h4>
              <p className="text-[10px] leading-tight mt-1 opacity-90">Visible verified movement from Unmet Need → Fulfilled State.</p>
           </Card>
        </div>

        {/* Tools & Participation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-lg px-1 text-left">Project Tools</h3>
              <div className="grid grid-cols-1 gap-4">
                {role === "TEACHER" && (
                  <Link href="/needs/log">
                    <Button className="w-full h-16 bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-sm flex items-center justify-start gap-4 px-6 rounded-2xl group text-left">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-500 group-hover:text-white"><PlusCircle size={20} /></div>
                      <span className="font-bold">Log New Gap</span>
                    </Button>
                  </Link>
                )}
                <Link href="/needs">
                  <Button className="w-full h-16 bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-sm flex items-center justify-start gap-4 px-6 rounded-2xl group text-left">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg group-hover:bg-rose-500 group-hover:text-white"><Heart size={20} /></div>
                    <span className="font-bold">Community Energy Gaps</span>
                  </Button>
                </Link>
                <Button onClick={() => setShowQr(true)} className="w-full h-16 bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-sm flex items-center justify-start gap-4 px-6 rounded-2xl group text-left">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white"><QrCode size={20} /></div>
                  <span className="font-bold">Share Project QR</span>
                </Button>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-lg flex items-center gap-2 text-left"><ActivityIcon className="w-5 h-5 text-orange-500" /> Live Participation</h3>
              </div>
              <Card className="divide-y divide-neutral-100 bg-white shadow-sm overflow-hidden">
                <AnimatePresence initial={false}>
                  {(schoolStats?.recentActivities || []).slice(0, 5).map((activity: any) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-4 flex items-center gap-4 group hover:bg-neutral-50/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                        {activity.type === 'FULFILLED' ? <Zap size={18} className="text-emerald-500" /> : <PlusCircle size={18} className="text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                         <p className="text-sm font-medium text-neutral-800 truncate">{activity.message}</p>
                         <p className="text-[10px] text-neutral-400 font-bold uppercase">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activity.user?.name}</p>
                      </div>
                      {/* ALWAYS VISIBLE FOR DEMO */}
                      <button 
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Activity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {schoolStats?.recentActivities?.length === 0 && (
                  <div className="p-12 text-center text-neutral-400 italic text-sm">No recent activity.</div>
                )}
              </Card>
           </div>
        </div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQr && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQr(false)} className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center">
               <button onClick={() => setShowQr(false)} className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600"><X size={24} /></button>
               <h3 className="text-2xl font-bold text-neutral-800 mb-6 tracking-tighter">Venture OS Access</h3>
               <div className="flex justify-center mb-6"><InteractiveQR value={shareUrl} size={180} /></div>
               <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 mb-6 flex flex-col items-center gap-2 text-center">
                  <Globe size={20} className="text-indigo-200" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Live Global Network</p>
                  <p className="text-[10px] leading-tight opacity-90">Scanning this fulfills the visibility requirement for the Evolve System.</p>
               </div>
               <Button onClick={() => handleCopy(shareUrl)} className="w-full bg-neutral-900 text-white rounded-2xl py-4 flex items-center justify-center gap-2">
                 {copied ? <CheckCheck size={20} /> : <Share2 size={20} />} {copied ? "Link Copied!" : "Copy Global Link"}
               </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
