import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evolve Meter",
  description: "Energy-based needs fulfilment system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen relative`}>
        {/* Animated Background Elements */}
        <div className="energy-blob bg-amber-200 -top-48 -left-48" />
        <div className="energy-blob bg-indigo-200 -bottom-48 -right-48" style={{ animationDelay: '-4s' }} />
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
