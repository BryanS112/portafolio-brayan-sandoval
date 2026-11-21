"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { DEMO_BADGE } from "@/config/site";

export default function DemoBar({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-3xl"
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#09090b]/85 backdrop-blur-xl px-3 py-2 text-white shadow-2xl shadow-black/30">
        <Link href="/#demos" className="flex items-center gap-1.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 text-sm font-semibold px-3 py-1.5 transition">
          <ArrowLeft size={16} /> Volver al portafolio
        </Link>
        <span className="hidden sm:inline text-sm font-medium text-zinc-300">{name}</span>
        <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-violet-300 font-medium pr-2">
          <FlaskConical size={14} /> <span className="hidden md:inline">{DEMO_BADGE}</span><span className="md:hidden">Demo ficticia</span>
        </span>
      </div>
    </motion.div>
  );
}
