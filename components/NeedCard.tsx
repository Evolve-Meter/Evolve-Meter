"use client";

import { useState } from "react";
import { Need } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MojoBadge } from "@/components/MojoBadge";
import { Zap, CheckCircle2, Clock, User, Heart, ShieldCheck, Send, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { sendThanks, deleteNeed } from "@/app/actions";

interface NeedCardProps {
  need: Need;
  currentUserId: string;
  onUpdate?: () => void;
  onVerify?: () => void;
  onDelete?: () => void;
  userRole?: string;
}

export function NeedCard({ need, currentUserId, onUpdate, onVerify, onDelete, userRole }: NeedCardProps) {
  const [showThanksInput, setShowThanksInput] = useState(false);
  const [thanksText, setThanksText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isFulfilled = need.status === "FULFILLED";
  const isPending = need.status === "PENDING";
  const isLogged = need.status === "LOGGED";
  const isOwner = need.userId === currentUserId;
  const hasThanks = !!need.thanksMessage;

  const handleSendThanks = async () => {
    if (!thanksText.trim()) return;
    setIsSending(true);
    try {
      await sendThanks(need.id, thanksText);
      setShowThanksInput(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setIsDeleting(true);
    try {
      await deleteNeed(need.id);
      if (onDelete) onDelete();
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn(
      "p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 group",
      isFulfilled ? "bg-emerald-50 border-emerald-100 shadow-sm" : 
      isPending ? "bg-blue-50 border-blue-100" : "bg-white border-neutral-100 hover:border-amber-200"
    )}>
      {/* Category & Status */}
      <div className="flex justify-between items-start">
        <MojoBadge category={need.category as any} />
        <div className="flex items-center gap-2">
           {/* ALWAYS VISIBLE FOR DEMO */}
           <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Delete Record"
           >
             <Trash2 size={16} />
           </button>
           <div className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
            isFulfilled ? "text-emerald-600 bg-emerald-100" : 
            isPending ? "text-blue-600 bg-blue-100 animate-pulse" : "text-amber-600 bg-amber-100"
           )}>
            {isFulfilled ? "Energy Flowing" : isPending ? "Verifying..." : "Gap Active"}
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-bold text-lg text-neutral-800 text-left">{need.title}</h3>
        {need.description && <p className="text-sm text-neutral-500 line-clamp-2 text-left">{need.description}</p>}
      </div>

      {/* Recipient & Energy Target */}
      <div className="grid grid-cols-2 gap-4 py-3 border-y border-neutral-50">
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Zap size={16} fill="currentColor" />
          </div>
          <div>
            <p className="text-[8px] font-bold text-neutral-400 uppercase leading-none mb-1">Target</p>
            <p className="text-sm font-bold text-neutral-700">{need.jouleProxy}J</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-left">
           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
             <User size={16} />
           </div>
           <div>
             <p className="text-[8px] font-bold text-neutral-400 uppercase leading-none mb-1">For Student</p>
             <p className="text-sm font-bold text-neutral-700">{(need as any).user?.name || "Member"}</p>
           </div>
        </div>
      </div>

      {/* Fulfiller & Gratitude Info */}
      {(isFulfilled || isPending) && need.fulfilledBy && (
        <div className="space-y-2">
          <div className={cn("p-2 rounded-xl flex items-center gap-2", isFulfilled ? "bg-emerald-100/50" : "bg-blue-100/50")}>
             <Heart size={14} className={isFulfilled ? "text-emerald-500 fill-emerald-500" : "text-blue-500"} />
             <p className={cn("text-[10px] font-bold text-left", isFulfilled ? "text-emerald-700" : "text-blue-700")}>
               {isFulfilled ? "Fulfilled by" : "Being helped by"} {need.fulfilledBy.name}
             </p>
          </div>
          
          {hasThanks && (
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm relative italic text-xs text-neutral-600 flex gap-2 text-left">
               <MessageSquare size={14} className="text-emerald-400 shrink-0" />
               "{need.thanksMessage}"
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-neutral-400">
           {isFulfilled ? <CheckCircle2 size={16} className="text-emerald-500" /> : isPending ? <ShieldCheck size={16} className="text-blue-500" /> : <Clock size={16} />}
           <span className="text-[10px] font-bold uppercase tracking-tight">
             {isFulfilled ? (hasThanks ? "Gratitude Shared" : "Awaiting Thanks") : isPending ? "Teacher Verification" : isOwner ? "Your Request" : "Open Opportunity"}
           </span>
        </div>

        {/* BUTTON LOGIC */}
        {isLogged && !isOwner && (
          <Button variant="default" size="sm" onClick={onUpdate} className="rounded-xl h-10 px-5">I've got this! ⚡</Button>
        )}

        {isPending && (userRole === "TEACHER") && (
          <Button variant="default" size="sm" onClick={onVerify} className="rounded-xl h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">Verify Received 🛡️</Button>
        )}

        {isFulfilled && isOwner && !hasThanks && !showThanksInput && (
          <Button variant="outline" size="sm" onClick={() => setShowThanksInput(true)} className="rounded-xl h-10 px-5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            Say Thanks 💖
          </Button>
        )}
      </div>

      {/* THANKS INPUT */}
      <AnimatePresence>
        {showThanksInput && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 border-t border-neutral-100 space-y-3">
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-left">Write a note to {need.fulfilledBy?.name}</p>
             <textarea 
              value={thanksText}
              onChange={(e) => setThanksText(e.target.value)}
              placeholder="e.g. Thank you so much!"
              className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none h-24"
             />
             <div className="flex gap-2">
                <Button onClick={handleSendThanks} disabled={isSending} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                  {isSending ? "Sending..." : "Send Note"} <Send size={14} className="ml-2" />
                </Button>
                <Button variant="ghost" onClick={() => setShowThanksInput(false)} className="rounded-xl">Cancel</Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
