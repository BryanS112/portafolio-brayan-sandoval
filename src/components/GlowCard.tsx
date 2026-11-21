"use client";

import { useRef } from "react";

/** Tarjeta glass con spotlight que sigue el cursor (estética Linear/Vercel). */
export default function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.45)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.08), transparent 60%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
