"use client";

import { useRef } from "react";

/** Tarjeta con soporte claro/oscuro y spotlight sutil que sigue el cursor. */
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
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-[0_12px_32px_-8px_rgba(2,132,199,0.18)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:backdrop-blur-md dark:hover:border-cyan-300/40 dark:hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.45)] transition duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--x,50%) var(--y,50%), rgba(56,189,248,0.09), transparent 60%)" }}
      />
      <div className="relative flex flex-col flex-1 h-full">{children}</div>
    </div>
  );
}
