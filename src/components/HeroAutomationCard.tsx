"use client";

import { useEffect, useState } from "react";
import { Zap, TrendingUp } from "lucide-react";
import GlowCard from "@/components/GlowCard";

const STEPS = [
  "Cliente escribe por WhatsApp",
  "Bot clasifica la solicitud",
  "Pedido se registra en el sistema",
  "Equipo recibe la alerta",
];

export default function HeroAutomationCard() {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTicks((n) => n + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const active = ticks % STEPS.length;
  const orders = 120 + ticks * 3;

  return (
    <GlowCard className="p-5 shadow-2xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold flex items-center gap-2">
          <Zap size={16} className="text-violet-400" /> Flujo automatizado (simulación)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> En vivo
        </span>
      </div>
      <ol className="space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-500 ${
              i === active ? "border-cyan-400/50 bg-cyan-400/10 text-white" : "border-white/10 text-zinc-500"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full text-xs font-semibold flex items-center justify-center transition ${
                i <= active ? "bg-cyan-400 text-zinc-950" : "bg-white/10"
              }`}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-zinc-500">Pedidos procesados</p>
          <p className="font-display text-2xl font-bold text-cyan-400 tabular-nums">{orders}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-zinc-500">Tiempo ahorrado</p>
          <p className="font-display text-2xl font-bold text-violet-400 flex items-center gap-1 tabular-nums">
            <TrendingUp size={18} />
            {(orders * 0.07).toFixed(1)} h
          </p>
        </div>
      </div>
    </GlowCard>
  );
}
