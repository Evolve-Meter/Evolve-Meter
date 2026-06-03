"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Zap, Activity, ShieldCheck, ArrowRight, Mail, HelpCircle, Key, RefreshCcw, Sparkles, Database, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { activateMeter, verifyMeter, recoverMeterId } from "./actions";
import Link from "next/link";

export default function ActivationPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState<"New" | "Returning" | "Recover">("New");
  const [role, setRole] = useState<"Teacher" | "Parent" | "Child" | null>("Teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meterIdInput, setMeterIdInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveredId, setRecoveredId] = useState<string | null>(null);

  useEffect(() => {
    // Keep splash for exactly 5 seconds as requested
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleActivate = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (!role || !name) return;
      const meterNumber = await activateMeter(role, name, email);
      localStorage.setItem("meterNumber", meterNumber);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to create meter.");
      setIsProcessing(false);
    }
  };

  const handleLogin = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const meter = await verifyMeter(meterIdInput.toUpperCase());
      if (meter) {
        localStorage.setItem("meterNumber", meter.meterNumber);
        router.push("/dashboard");
      } else {
        setError("Invalid Meter ID.");
        setIsProcessing(false);
      }
    } catch (error) {
      setError("Connection error.");
      setIsProcessing(false);
    }
  };

  const handleRecover = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const id = await recoverMeterId(email);
      setRecoveredId(id);
      setIsProcessing(false);
    } catch (error: any) {
      setError(error.message || "No account found.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white font-sans">
      {/* 1. LUMINOUS SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(40px)", scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center text-center p-8"
          >
            <div className="absolute inset-0">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, ease: "easeOut" }} 
              className="relative mb-12 z-10"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3rem] flex items-center justify-center shadow-2xl border-4 border-white transform rotate-3">
                <Zap className="text-white w-16 h-16 fill-white" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-15px] border-2 border-dashed border-amber-200 rounded-full opacity-30"
              />
            </motion.div>

            <div className="space-y-8 max-w-2xl relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 1.2 }}
              >
                <h2 className="text-4xl md:text-6xl font-light text-neutral-800 tracking-tight leading-[1.1]">
                  "Energy is not just power; <br />
                  <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">it is the bridge</span> <br /> 
                  that connects us all."
                </h2>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 2.2, duration: 1 }} 
                className="flex flex-col items-center gap-4"
              >
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="flex items-center justify-center gap-3 text-neutral-500 text-[12px] font-black uppercase tracking-[0.5em]">
                  <Sparkles size={18} className="text-amber-500 animate-bounce" />
                  Empowering the school community
                  <Sparkles size={18} className="text-amber-500 animate-bounce" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN ACTIVATION PAGE */}
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        <div className="absolute inset-0 z-0">
           {[...Array(15)].map((_, i) => (
             <motion.div
              key={i}
              animate={{
                x: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
                opacity: [0.05, 0.2, 0.05],
              }}
              transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-3 h-3 bg-amber-400 rounded-full blur-md"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
             />
           ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }} 
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm z-10"
        >
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 tracking-tighter">
              Evolve Meter
            </h1>
            <div className="px-4 py-1 bg-white rounded-full border border-neutral-100 shadow-sm">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Empowering the school community
              </p>
            </div>
          </div>

          <Card className="p-1 bg-neutral-100 rounded-2xl mb-4 flex gap-1 border-none shadow-inner">
            <button onClick={() => { setMode("New"); setError(null); }} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === "New" ? "bg-white text-amber-600 shadow-md" : "text-neutral-500"}`}>New Meter</button>
            <button onClick={() => { setMode("Returning"); setError(null); }} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === "Returning" ? "bg-white text-amber-600 shadow-md" : "text-neutral-500"}`}>Login</button>
          </Card>

          <Card className="p-8 space-y-6 relative overflow-hidden border-none shadow-2xl shadow-neutral-200/50 rounded-[2.5rem] bg-white">
            <AnimatePresence mode="wait">
              {mode === "New" ? (
                <motion.div key="new" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] text-center">Your Persona</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Teacher", "Parent", "Child"].map((r) => (
                        <button key={r} onClick={() => setRole(r as any)} className={`py-3 rounded-xl text-[10px] font-bold transition-all border ${role === r ? "bg-amber-500 text-white border-amber-400 shadow-lg scale-105" : "bg-neutral-50 text-neutral-500 border-neutral-100 hover:bg-neutral-100"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-400 uppercase ml-1 tracking-widest">Full Name</label>
                      <input type="text" placeholder="e.g. Sanvi" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all font-medium" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-400 uppercase ml-1 tracking-widest">Recovery Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                        <input type="email" placeholder="email@school.com" className="w-full pl-12 pr-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-amber-200" onClick={handleActivate} disabled={!role || !name.trim() || isProcessing}>
                    {isProcessing ? "Activating..." : "Activate Meter"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              ) : mode === "Returning" ? (
                <motion.div key="returning" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1 tracking-widest text-center block">Enter Meter ID</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                      <input type="text" placeholder="MTR-XXXXXX" className="w-full pl-12 pr-5 py-5 bg-neutral-50 border border-neutral-100 rounded-2xl font-mono text-xl font-black focus:ring-2 focus:ring-amber-400 outline-none transition-all uppercase text-center tracking-widest" value={meterIdInput} onChange={(e) => setMeterIdInput(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full h-16 bg-neutral-900 text-lg font-bold rounded-2xl" onClick={handleLogin} disabled={!meterIdInput || isProcessing}>
                    {isProcessing ? "Verifying..." : "Access Meter"}
                  </Button>
                  <button onClick={() => setMode("Recover")} className="w-full text-center text-[11px] font-bold text-amber-600 hover:underline flex items-center justify-center gap-2">
                    <HelpCircle size={14} /> Forgot Meter ID? Recover here
                  </button>
                </motion.div>
              ) : (
                <motion.div key="recover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase ml-1 tracking-widest">Registered Email</label>
                    <input type="email" placeholder="Enter your email" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  {recoveredId ? (
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">ID Recovered!</p>
                      <p className="text-2xl font-mono font-black text-emerald-700 mb-6 tracking-wider">{recoveredId}</p>
                      <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl" onClick={() => { setMeterIdInput(recoveredId); setMode("Returning"); setRecoveredId(null); }}>Use this to Login</Button>
                    </div>
                  ) : (
                    <Button className="w-full h-16 bg-amber-600 text-lg font-bold rounded-2xl" onClick={handleRecover} disabled={!email || isProcessing}>
                      <RefreshCcw className={`mr-2 w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} /> {isProcessing ? "Searching..." : "Recover ID"}
                    </Button>
                  )}
                  <button onClick={() => setMode("Returning")} className="w-full text-center text-[11px] font-bold text-neutral-400 hover:text-neutral-600 uppercase tracking-widest">Back to Login</button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-[10px] text-center text-red-500 font-black bg-red-50 py-3 rounded-2xl border border-red-100">{error}</p>}
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
