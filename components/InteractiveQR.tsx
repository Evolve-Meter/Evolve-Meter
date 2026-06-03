"use client";

import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface InteractiveQRProps {
  value: string;
  size?: number;
}

export function InteractiveQR({ value, size = 200 }: InteractiveQRProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-amber-100 border-4 border-amber-50 group"
    >
      {/* Background Energy Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-amber-400 rounded-[2.5rem] blur-2xl -z-10"
      />

      <div className="relative">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "", // We'll overlay a div instead for more control
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
          className="rounded-xl"
        />

        {/* Central Logo Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg shadow-lg">
           <div className="bg-amber-500 p-1.5 rounded-md">
              <Zap size={16} className="text-white fill-white" />
           </div>
        </div>
      </div>

      {/* Interactive Scan Line */}
      <motion.div 
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50 z-20"
      />
    </motion.div>
  );
}
