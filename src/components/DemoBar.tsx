"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, MessageCircle } from "lucide-react";
import { DEMO_BADGE, demoQuoteLink } from "@/config/site";

export default function DemoBar({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-4xl"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-full border border-white/10 bg-[#09090b]/85 backdrop-blur-xl px-2.5 sm:px-3 py-2 text-white shadow-2xl shadow-black/30">
        <Link href="/#demos" className="flex items-center gap-1.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 text-xs sm:text-sm font-semibold px-3 py-1.5 transition shrink-0">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Volver al portafolio</span><span className="sm:hidden">Portafolio</span>
        </Link>
        <span className="hidden lg:inline text-sm font-medium text-zinc-300 truncate">{name}</span>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-violet-300 font-medium truncate">
          <FlaskConical size={13} className="shrink-0" /> <span className="hidden md:inline truncate">{DEMO_BADGE}</span><span className="md:hidden">Demo ficticia</span>
        </span>
        <a
          href={demoQuoteLink(name)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-semibold px-3 py-1.5 transition shrink-0"
        >
          <MessageCircle size={14} /> <span className="hidden sm:inline">Cotizar este sistema</span><span className="sm:hidden">Cotizar</span>
        </a>
      </div>
    </motion.div>
  );
}
