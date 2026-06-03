"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MojoCategory, NeedsLevel } from "@/types";
import { Info, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { logNeed } from "../../actions";

const CATEGORIES: MojoCategory[] = ["Learning", "Nutrition", "Safety", "Wellbeing", "Tools", "Restoration"];

export default function LogNeed() {
  const router = useRouter();
  const [target, setTarget] = useState<"self" | "student">("student");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MojoCategory>("Learning");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meterNumber, setMeterNumber] = useState<string | null>(null);

  useEffect(() => {
    setMeterNumber(localStorage.getItem("meterNumber"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterNumber) return;
    setIsSubmitting(true);
    try {
      await logNeed(meterNumber, title, category, description);
      router.push("/needs");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Log EnergyGap">
      <div className="max-w-2xl mx-auto md:py-8">
        <form onSubmit={handleSubmit} className="space-y-6 pb-8 pt-2">
        
        {/* Quick Help */}
        <Card className="p-4 bg-amber-50 border-amber-100 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">Describe the need simply. This creates a visible Energy Gap to attract fulfilment.</p>
        </Card>

        {/* Title */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">Title</label>
          <input 
            type="text"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="e.g., Winter Boots for Student"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Target */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">Who is this for?</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setTarget("student")} className={`flex-1 py-3 rounded-xl border-2 transition-all ${target === "student" ? "border-amber-400 bg-amber-50 text-amber-900 font-medium" : "border-neutral-200 text-neutral-600 scale-95"}`}>
              Student
            </button>
            <button type="button" onClick={() => setTarget("self")} className={`flex-1 py-3 rounded-xl border-2 transition-all ${target === "self" ? "border-amber-400 bg-amber-50 text-amber-900 font-medium" : "border-neutral-200 text-neutral-600 scale-95"}`}>
              Myself / Classroom
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">Mojo Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button 
                key={c} type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-2 border rounded-full text-sm transition-all ${category === c ? "bg-amber-400 border-amber-400 text-white font-medium" : "bg-white border-neutral-200 text-neutral-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-sm font-semibold flex justify-between">
            <span>Description</span>
            <span className="text-xs font-normal text-muted-foreground">Private (Teacher Only)</span>
          </label>
          <textarea 
            className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white min-h-[100px]"
            placeholder="E.g., Student A needs size 4 winter boots."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 mb-8 text-white"
            disabled={!title || !description || isSubmitting || !meterNumber}
          >
            {isSubmitting ? "Generating..." : <><Zap className="w-5 h-5 mr-2" /> Publish Energy Gap</>}
          </Button>
        </motion.div>
      </form>
    </div>
  </AppLayout>
  );
}
