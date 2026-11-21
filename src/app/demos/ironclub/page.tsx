"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dumbbell, Flame, Zap, Crown, Check, X, MessageCircle, Users, Wallet, Clock, AlertTriangle,
  Calculator, CalendarDays, Plus, RefreshCw, Bell, ArrowRight, Bike, Swords, Timer, Activity, Target, Trophy,
} from "lucide-react";
import DemoBar from "@/components/DemoBar";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

const NEON = "#CCFF00";

type PlanId = "basico" | "pro" | "vip";
const PLANS: { id: PlanId; name: string; price: number; days: number; icon: typeof Dumbbell; img: string; perks: string[]; badge?: string; monthly: number }[] = [
  { id: "basico", name: "Plan Básico Mensual", price: 75000, days: 30, monthly: 75000, icon: Dumbbell, img: "1534438327276-14e5300c3a48", perks: ["Acceso a zona de pesas y cardio", "Horario libre de 5 a.m. a 9 p.m.", "Valoración inicial gratuita"] },
  { id: "pro", name: "Plan Pro + Funcional", price: 110000, days: 30, monthly: 110000, icon: Flame, img: "1534258936925-c58bed479fcb", badge: "Más elegido", perks: ["Todo el Plan Básico", "Clases funcionales, boxeo y spinning", "Seguimiento mensual de medidas"] },
  { id: "vip", name: "Trimestral VIP", price: 270000, days: 90, monthly: 90000, icon: Crown, img: "1517836357463-d25dfeac3438", perks: ["Todo el Plan Pro por 3 meses", "2 sesiones de entrenador personal", "Ahorras $60.000 vs. pagar mes a mes"] },
];
const planOf = (id: PlanId) => PLANS.find((p) => p.id === id)!;

const GOALS = ["Bajar grasa", "Ganar masa muscular", "Rendimiento"] as const;
type Goal = (typeof GOALS)[number];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
type Cls = { id: string; day: string; time: string; name: string; coach: string; spots: number; icon: typeof Dumbbell; img: string };
const mk = (day: string, time: string, name: string, coach: string, spots: number): Cls => {
  const meta: Record<string, [typeof Dumbbell, string]> = {
    "Cross-Training": [Zap, "1599058917212-d750089bc07e"],
    Spinning: [Bike, "1540497077202-7c8a3999166f"],
    Boxeo: [Swords, "1526506118085-60ce8714f8c5"],
    Funcional: [Activity, "1534258936925-c58bed479fcb"],
  };
  return { id: `${day}-${time}`, day, time, name, coach, spots, icon: meta[name][0], img: meta[name][1] };
};
const CLASSES: Cls[] = [
  mk("Lunes", "06:00", "Cross-Training", "Coach Andrés", 4), mk("Lunes", "18:30", "Spinning", "Coach Valeria", 9), mk("Lunes", "20:00", "Boxeo", "Coach Mateo", 0),
  mk("Martes", "06:00", "Funcional", "Coach Laura", 7), mk("Martes", "19:00", "Cross-Training", "Coach Andrés", 3), mk("Martes", "20:15", "Spinning", "Coach Valeria", 12),
  mk("Miércoles", "06:00", "Boxeo", "Coach Mateo", 6), mk("Miércoles", "18:30", "Funcional", "Coach Laura", 10), mk("Miércoles", "20:00", "Cross-Training", "Coach Andrés", 2),
  mk("Jueves", "06:00", "Spinning", "Coach Valeria", 8), mk("Jueves", "19:00", "Boxeo", "Coach Mateo", 5), mk("Jueves", "20:15", "Funcional", "Coach Laura", 1),
  mk("Viernes", "06:00", "Cross-Training", "Coach Andrés", 6), mk("Viernes", "18:00", "Spinning", "Coach Valeria", 11), mk("Viernes", "19:30", "Boxeo", "Coach Mateo", 4),
  mk("Sábado", "08:00", "Funcional", "Coach Laura", 14), mk("Sábado", "09:30", "Cross-Training", "Coach Andrés", 5), mk("Sábado", "11:00", "Spinning", "Coach Valeria", 0),
];

/* ---------- Administración (localStorage) ---------- */
type Member = { id: string; name: string; phone: string; plan: PlanId; expires: string };
type Payment = { id: string; date: string; amount: number; concept: string };
const KEY = "ironclub-demo-v1";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const daysLeft = (s: string) => Math.round((new Date(s + "T00:00").getTime() - today0().getTime()) / 86400000);
type Status = "Al día" | "Por vencer" | "Vencido";
const statusOf = (s: string): Status => { const d = daysLeft(s); return d < 0 ? "Vencido" : d <= 5 ? "Por vencer" : "Al día"; };
const fmtDate = (s: string) => new Date(s + "T00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

function seed(): { members: Member[]; payments: Payment[] } {
  const t = today0();
  const m = (n: string, ph: string, plan: PlanId, off: number, i: number): Member => ({ id: `seed${i}`, name: n, phone: ph, plan, expires: iso(addDays(t, off)) });
  const members = [
    m("Camila Rodríguez", "3004561234", "pro", 21, 1), m("Jhon Barrios", "3015557788", "basico", 3, 2),
    m("Valentina Ortiz", "3026669900", "vip", 58, 3), m("Santiago Pardo", "3037771122", "basico", -4, 4),
    m("Daniela Cuesta", "3048883344", "pro", 12, 5), m("Luis Mercado", "3059995566", "pro", 1, 6),
    m("Andrea Polo", "3061112233", "basico", -11, 7), m("Kevin Salcedo", "3072224455", "vip", 40, 8),
  ];
  const first = new Date(t.getFullYear(), t.getMonth(), 1);
  const payments: Payment[] = [
    { id: "p1", date: iso(first), amount: 110000, concept: "Camila Rodríguez · Pro" },
    { id: "p2", date: iso(first), amount: 270000, concept: "Valentina Ortiz · VIP" },
    { id: "p3", date: iso(first), amount: 110000, concept: "Daniela Cuesta · Pro" },
    { id: "p4", date: iso(first), amount: 270000, concept: "Kevin Salcedo · VIP" },
    { id: "p5", date: iso(first), amount: 75000, concept: "Jhon Barrios · Básico" },
    { id: "p6", date: iso(first), amount: 110000, concept: "Luis Mercado · Pro" },
  ];
  return { members, payments };
}

export default function IronClub() {
  const [tab, setTab] = useState<"clientes" | "admin">("clientes");
  const [toast, setToast] = useState("");
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  /* Lead modal (cortesía / inscripción) */
  const [lead, setLead] = useState<{ title: string; text: (n: string, p: string) => string } | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "" });
  const [leadErr, setLeadErr] = useState("");
  function submitLead() {
    if (leadForm.name.trim().length < 2) return setLeadErr("Escribe tu nombre.");
    if (!/^3\d{9}$/.test(leadForm.phone.replace(/\s/g, ""))) return setLeadErr("Celular colombiano de 10 dígitos (ej. 3001234567).");
    window.open(whatsappLink(lead!.text(leadForm.name.trim(), leadForm.phone)), "_blank", "noopener");
    setLead(null); setLeadErr(""); notify("Solicitud lista en WhatsApp");
  }
  const openLead = (title: string, text: (n: string, p: string) => string) => { setLeadForm({ name: "", phone: "" }); setLeadErr(""); setLead({ title, text }); };

  /* Calculadora */
  const [calc, setCalc] = useState({ peso: "", altura: "", objetivo: "Bajar grasa" as Goal, nombre: "" });
  const [calcRes, setCalcRes] = useState<null | { imc: number; cat: string; plan: PlanId; why: string }>(null);
  const [calcErr, setCalcErr] = useState("");
  function calcular() {
    const kg = Number(calc.peso), cm = Number(calc.altura);
    if (!(kg >= 30 && kg <= 250)) return setCalcErr("Ingresa un peso válido entre 30 y 250 kg.");
    if (!(cm >= 120 && cm <= 230)) return setCalcErr("Ingresa una altura válida entre 120 y 230 cm.");
    setCalcErr("");
    const imc = kg / Math.pow(cm / 100, 2);
    const cat = imc < 18.5 ? "Bajo peso" : imc < 25 ? "Peso saludable" : imc < 30 ? "Sobrepeso" : "Obesidad";
    const plan: PlanId = calc.objetivo === "Bajar grasa" ? "pro" : calc.objetivo === "Ganar masa muscular" ? "basico" : "vip";
    const why = calc.objetivo === "Bajar grasa" ? "Combina pesas con clases funcionales, boxeo y spinning para un mayor gasto calórico."
      : calc.objetivo === "Ganar masa muscular" ? "Acceso libre a zona de pesas para progresar con sobrecarga y buena alimentación."
      : "Tres meses con entrenador personal para planificar ciclos de rendimiento.";
    setCalcRes({ imc, cat, plan, why });
  }

  /* Horario */
  const [day, setDay] = useState("Lunes");
  const [spots, setSpots] = useState<Record<string, number>>(() => Object.fromEntries(CLASSES.map((c) => [c.id, c.spots])));
  const [booked, setBooked] = useState<Record<string, boolean>>({});
  function toggleBook(c: Cls) {
    if (booked[c.id]) {
      setBooked((b) => ({ ...b, [c.id]: false })); setSpots((s) => ({ ...s, [c.id]: s[c.id] + 1 })); notify(`Cupo cancelado: ${c.name}`);
    } else if (spots[c.id] > 0) {
      setBooked((b) => ({ ...b, [c.id]: true })); setSpots((s) => ({ ...s, [c.id]: s[c.id] - 1 })); notify(`Cupo reservado: ${c.name} · ${c.day} ${c.time}`);
    }
  }

  /* Admin */
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [ready, setReady] = useState(false);
  const [nm, setNm] = useState({ name: "", phone: "", plan: "basico" as PlanId });
  const [nmErr, setNmErr] = useState("");
  const [filter, setFilter] = useState<"Todos" | Status>("Todos");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const d = raw ? JSON.parse(raw) : seed();
      setMembers(d.members); setPayments(d.payments);
    } catch { const d = seed(); setMembers(d.members); setPayments(d.payments); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify({ members, payments })); }, [members, payments, ready]);

  const kpi = useMemo(() => {
    const now = new Date();
    const month = payments.filter((p) => { const d = new Date(p.date + "T00:00"); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    return {
      activos: members.filter((m) => statusOf(m.expires) !== "Vencido").length,
      ingresos: month.reduce((s, p) => s + p.amount, 0),
      porVencer: members.filter((m) => statusOf(m.expires) === "Por vencer").length,
      vencidas: members.filter((m) => statusOf(m.expires) === "Vencido").length,
    };
  }, [members, payments]);

  function addMember() {
    if (nm.name.trim().length < 3) return setNmErr("Escribe el nombre completo.");
    if (!/^3\d{9}$/.test(nm.phone.replace(/\s/g, ""))) return setNmErr("Celular de 10 dígitos que empiece por 3.");
    const p = planOf(nm.plan);
    const id = String(Date.now());
    setMembers((m) => [{ id, name: nm.name.trim(), phone: nm.phone.replace(/\s/g, ""), plan: nm.plan, expires: iso(addDays(today0(), p.days)) }, ...m]);
    setPayments((x) => [...x, { id: "p" + id, date: iso(new Date()), amount: p.price, concept: `${nm.name.trim()} · ${p.name}` }]);
    setNm({ name: "", phone: "", plan: "basico" }); setNmErr(""); notify(`${nm.name.trim()} registrado · +${cop(p.price)}`);
  }
  function renew(m: Member) {
    const base = daysLeft(m.expires) < 0 ? today0() : new Date(m.expires + "T00:00");
    const p = planOf(m.plan);
    setMembers((all) => all.map((x) => (x.id === m.id ? { ...x, expires: iso(addDays(base, 30)) } : x)));
    setPayments((x) => [...x, { id: "p" + Date.now(), date: iso(new Date()), amount: p.monthly, concept: `${m.name} · Renovación 30 días` }]);
    notify(`${m.name} renovado 30 días · +${cop(p.monthly)}`);
  }
  function remind(m: Member) {
    const d = daysLeft(m.expires);
    const when = d < 0 ? `venció el ${fmtDate(m.expires)}` : d === 0 ? "vence hoy" : `vence pronto (${fmtDate(m.expires)})`;
    const msg = `Hola ${m.name.split(" ")[0]}, te recordamos que tu mensualidad en IronClub ${when}. Puedes renovar por Nequi, transferencia o en recepción. ¡Te esperamos para seguir entrenando! (Mensaje de demostración)`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  }
  function resetDemo() { const d = seed(); setMembers(d.members); setPayments(d.payments); notify("Datos de demostración restablecidos"); }

  const shown = [...members].sort((a, b) => a.expires.localeCompare(b.expires)).filter((m) => filter === "Todos" || statusOf(m.expires) === filter);
  const sBadge = (s: Status) => s === "Al día" ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30" : s === "Por vencer" ? "bg-yellow-400/10 text-yellow-300 ring-yellow-400/30" : "bg-red-500/10 text-red-400 ring-red-500/30";
  const dot = (s: Status) => s === "Al día" ? "bg-emerald-400" : s === "Por vencer" ? "bg-yellow-300" : "bg-red-500";
  const input = "w-full bg-[#0A0A0A] border border-white/10 focus:border-[#CCFF00] px-3.5 py-3 text-sm outline-none transition placeholder:text-zinc-600";
  const card = "bg-[#141416] border border-white/[0.07]";
  const title = "font-display font-extrabold uppercase italic tracking-tight";

  const classesToday = CLASSES.filter((c) => c.day === day);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <DemoBar name="IronClub Gym" />

      {/* Pestañas */}
      <div className="sticky top-0 z-30 pt-[68px] bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 flex items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-2 font-display font-extrabold italic uppercase tracking-tight text-lg"><Dumbbell size={22} style={{ color: NEON }} /> Iron<span style={{ color: NEON }}>Club</span></div>
          <div className="inline-flex bg-[#141416] p-1 border border-white/10">
            {([["clientes", "Vista Clientes"], ["admin", "Vista Dueño"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`relative px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide transition ${tab === k ? "text-black" : "text-zinc-400 hover:text-white"}`}>
                {tab === k && <motion.span layoutId="icpill" className="absolute inset-0" style={{ background: NEON }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "clientes" ? (
          <motion.main key="c" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {/* HERO */}
            <section className="relative overflow-hidden">
              <Photo id="1605296867304-46d5465a13f1" alt="Atleta preparando un peso muerto en un gimnasio oscuro" className="absolute inset-0 bg-[#141416]" w={1800} priority sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/20" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-36">
                <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}><Timer size={14} /> Abierto 5 a.m. – 9 p.m.</motion.p>
                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className={`${title} text-5xl sm:text-8xl mt-5 leading-[0.92]`}>
                  Supera tus límites.<br /><span style={{ color: NEON }}>Entrena con propósito.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-lg text-zinc-300 text-lg">Pesas, funcional, boxeo y spinning bajo un mismo techo. Coaches certificados y planes sin letra pequeña.</motion.p>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-9 flex flex-wrap items-center gap-4">
                  <button onClick={() => openLead("Reclamar 3 días de cortesía", (n, p) => `Hola IronClub, soy ${n} (${p}). Quiero reclamar mis 3 días de cortesía. (Demo)`)} className="inline-flex items-center gap-2 px-8 py-4 text-black font-extrabold uppercase tracking-wide hover:brightness-110 active:scale-95 transition" style={{ background: NEON }}>Reclamar 3 días de cortesía <ArrowRight size={18} /></button>
                  <a href="#planes" className="px-6 py-4 border border-white/25 hover:bg-white/10 font-bold uppercase tracking-wide text-sm transition">Ver planes</a>
                </motion.div>
                <div className="mt-12 grid grid-cols-3 max-w-md gap-4 text-center">
                  {[["+600", "Socios"], ["18", "Clases / semana"], ["6", "Coaches"]].map(([n, l]) => <div key={l} className="border-l-2 pl-3 text-left" style={{ borderColor: NEON }}><p className="font-display text-3xl font-extrabold">{n}</p><p className="text-xs text-zinc-400 uppercase tracking-wide">{l}</p></div>)}
                </div>
              </div>
            </section>

            {/* PLANES */}
            <section id="planes" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-32">
              <Reveal><p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Membresías</p><h2 className={`${title} text-4xl sm:text-5xl mt-2`}>Elige tu plan</h2></Reveal>
              <div className="mt-10 grid md:grid-cols-3 gap-5">
                {PLANS.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.08}>
                    <motion.div whileHover={{ y: -6 }} className={`${card} h-full flex flex-col relative overflow-hidden ${p.badge ? "ring-1" : ""}`} style={p.badge ? { boxShadow: `0 0 0 1px ${NEON}55` } : undefined}>
                      <Photo id={p.img} alt={p.name} w={700} className="h-40 bg-zinc-900" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="h-9 w-9 flex items-center justify-center text-black" style={{ background: NEON }}><p.icon size={18} strokeWidth={2.2} /></span>
                        {p.badge && <span className="bg-white text-black text-[10px] font-extrabold uppercase px-2 py-1">{p.badge}</span>}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display font-extrabold uppercase text-xl leading-tight">{p.name}</h3>
                        <p className="mt-3 font-display text-4xl font-extrabold" style={{ color: NEON }}>{cop(p.price)}<span className="text-xs text-zinc-400 font-sans font-medium"> COP / {p.days === 30 ? "mes" : "3 meses"}</span></p>
                        <ul className="mt-5 space-y-2.5 text-sm text-zinc-300 flex-1">{p.perks.map((x) => <li key={x} className="flex gap-2"><Check size={16} className="shrink-0 mt-0.5" style={{ color: NEON }} />{x}</li>)}</ul>
                        <button onClick={() => openLead(`Inscribirme · ${p.name}`, (n, ph) => `Hola IronClub, soy ${n} (${ph}). Quiero inscribirme al ${p.name} (${cop(p.price)} COP). (Demo)`)} className="mt-6 w-full py-3.5 font-extrabold uppercase text-sm tracking-wide border transition hover:text-black active:scale-[0.98]" style={{ borderColor: NEON, color: NEON }} onMouseEnter={(e) => (e.currentTarget.style.background = NEON)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>Inscribirme</button>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* CALCULADORA */}
            <section className="border-y border-white/10 bg-[#0f0f11]">
              <div className="mx-auto max-w-6xl px-5 py-20 grid lg:grid-cols-2 gap-12">
                <Reveal>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: NEON }}><Calculator size={14} /> Calculadora rápida</p>
                  <h2 className={`${title} text-4xl sm:text-5xl mt-2`}>¿Qué plan va contigo?</h2>
                  <p className="text-zinc-400 mt-4 max-w-md">Ingresa tus datos y te recomendamos el plan ideal. Referencia orientativa: no reemplaza una valoración profesional.</p>
                  <div className="mt-8 space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs uppercase tracking-wide text-zinc-400">Peso (kg)<input inputMode="decimal" value={calc.peso} onChange={(e) => setCalc({ ...calc, peso: e.target.value })} placeholder="70" className={`${input} mt-1.5`} /></label>
                      <label className="text-xs uppercase tracking-wide text-zinc-400">Altura (cm)<input inputMode="decimal" value={calc.altura} onChange={(e) => setCalc({ ...calc, altura: e.target.value })} placeholder="172" className={`${input} mt-1.5`} /></label>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-400 mb-1.5">Objetivo</p>
                      <div className="grid grid-cols-3 gap-2">
                        {GOALS.map((g) => <button key={g} onClick={() => setCalc({ ...calc, objetivo: g })} className={`px-2 py-3 text-xs font-bold uppercase leading-tight border transition ${calc.objetivo === g ? "text-black" : "border-white/15 text-zinc-300 hover:border-white/40"}`} style={calc.objetivo === g ? { background: NEON, borderColor: NEON } : undefined}>{g}</button>)}
                      </div>
                    </div>
                    <label className="block text-xs uppercase tracking-wide text-zinc-400">Tu nombre (opcional)<input value={calc.nombre} onChange={(e) => setCalc({ ...calc, nombre: e.target.value })} className={`${input} mt-1.5`} /></label>
                    {calcErr && <p className="text-red-400 text-sm">{calcErr}</p>}
                    <button onClick={calcular} className="w-full py-4 text-black font-extrabold uppercase tracking-wide hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2" style={{ background: NEON }}><Target size={18} /> Calcular y recomendar</button>
                  </div>
                </Reveal>
                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    {calcRes ? (
                      <motion.div key={calcRes.imc} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`${card} w-full p-7`}>
                        <p className="text-xs uppercase tracking-widest text-zinc-400">Tu IMC</p>
                        <p className="font-display text-7xl font-extrabold leading-none mt-1" style={{ color: NEON }}>{calcRes.imc.toFixed(1)}</p>
                        <p className="mt-1 font-semibold">{calcRes.cat}</p>
                        <div className="my-6 h-px bg-white/10" />
                        <p className="text-xs uppercase tracking-widest text-zinc-400">Plan recomendado</p>
                        <p className="font-display font-extrabold uppercase text-2xl mt-1">{planOf(calcRes.plan).name}</p>
                        <p className="text-zinc-300 text-sm mt-2">{calcRes.why}</p>
                        <p className="mt-3 font-display text-2xl font-extrabold">{cop(planOf(calcRes.plan).price)} <span className="text-xs font-sans font-medium text-zinc-400">COP</span></p>
                        <button
                          onClick={() => {
                            const p = planOf(calcRes.plan);
                            const msg = `Hola IronClub, ${calc.nombre.trim() ? "soy " + calc.nombre.trim() + ". " : ""}Quiero información del ${p.name}.\n\nPeso: ${calc.peso} kg\nAltura: ${calc.altura} cm\nIMC: ${calcRes.imc.toFixed(1)} (${calcRes.cat})\nObjetivo: ${calc.objetivo}\nPlan recomendado: ${p.name} (${cop(p.price)} COP)\n\n(Solicitud de demostración)`;
                            window.open(whatsappLink(msg), "_blank", "noopener"); notify("Solicitud lista en WhatsApp");
                          }}
                          className="mt-6 w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase text-sm tracking-wide flex items-center justify-center gap-2 transition"
                        ><MessageCircle size={18} /> Enviar mi solicitud por WhatsApp</button>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${card} w-full p-10 text-center`}>
                        <Trophy size={44} strokeWidth={1.2} className="mx-auto text-zinc-600" />
                        <p className="mt-4 text-zinc-400">Completa el formulario y verás aquí tu IMC y tu plan recomendado.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* HORARIO */}
            <section className="mx-auto max-w-6xl px-5 py-20">
              <Reveal><p className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: NEON }}><CalendarDays size={14} /> Horario de clases</p><h2 className={`${title} text-4xl sm:text-5xl mt-2`}>Reserva tu cupo</h2></Reveal>
              <div className="mt-8 flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button key={d} onClick={() => setDay(d)} className={`relative px-5 py-2.5 text-sm font-bold uppercase tracking-wide border transition ${day === d ? "text-black" : "border-white/15 text-zinc-300 hover:border-white/40"}`} style={day === d ? { background: NEON, borderColor: NEON } : undefined}>{d}</button>
                ))}
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {classesToday.map((c) => {
                    const left = spots[c.id], mine = booked[c.id], full = left === 0 && !mine;
                    return (
                      <motion.div layout key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.28 }} className={`${card} overflow-hidden flex flex-col`}>
                        <Photo id={c.img} alt={`Clase de ${c.name}`} w={600} className="h-32 bg-zinc-900" sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: NEON }}><Clock size={15} /> {c.time}</span>
                            <span className={`text-xs font-bold px-2 py-1 ${full ? "bg-red-500/15 text-red-400" : left <= 3 ? "bg-yellow-400/15 text-yellow-300" : "bg-white/10 text-zinc-300"}`}>{full ? "Completo" : `${left} cupos`}</span>
                          </div>
                          <h3 className="font-display font-extrabold uppercase text-xl mt-3 flex items-center gap-2"><c.icon size={18} strokeWidth={2} /> {c.name}</h3>
                          <p className="text-sm text-zinc-400">{c.coach}</p>
                          <button disabled={full} onClick={() => toggleBook(c)} className={`mt-5 py-3 text-sm font-extrabold uppercase tracking-wide transition active:scale-[0.98] ${full ? "bg-white/5 text-zinc-600 cursor-not-allowed" : mine ? "border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10" : "text-black hover:brightness-110"}`} style={!full && !mine ? { background: NEON } : undefined}>
                            {full ? "Sin cupos" : mine ? "Reservado · Cancelar" : "Reservar cupo"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          </motion.main>
        ) : (
          <motion.main key="a" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mx-auto max-w-6xl px-5 py-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Panel del dueño</p><h1 className={`${title} text-4xl sm:text-5xl mt-1`}>Control de mensualidades</h1><p className="text-zinc-400 text-sm mt-2">Adiós a los cuadernos y al Excel desordenado. Los datos se guardan en este navegador.</p></div>
              <button onClick={resetDemo} className="text-xs text-zinc-400 underline hover:text-white">Restablecer demo</button>
            </div>

            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Miembros activos", value: String(kpi.activos), color: NEON },
                { icon: Wallet, label: "Ingresos del mes", value: cop(kpi.ingresos), color: NEON },
                { icon: Clock, label: "Por vencer (5 días)", value: String(kpi.porVencer), color: "#FACC15" },
                { icon: AlertTriangle, label: "Vencidas", value: String(kpi.vencidas), color: "#F87171" },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`${card} p-5 border-t-2`} style={{ borderTopColor: color }}>
                  <Icon size={20} style={{ color }} />
                  <p className="text-xs uppercase tracking-wide text-zinc-400 mt-3">{label}</p>
                  <motion.p key={value} initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl sm:text-3xl font-extrabold mt-1 tabular-nums">{value}</motion.p>
                </motion.div>
              ))}
            </div>

            <div className={`${card} p-5 mt-6`}>
              <h2 className="font-display font-extrabold uppercase flex items-center gap-2"><Plus size={18} style={{ color: NEON }} /> Registrar nuevo miembro</h2>
              <div className="mt-4 grid sm:grid-cols-4 gap-3">
                <input placeholder="Nombre completo" value={nm.name} onChange={(e) => setNm({ ...nm, name: e.target.value })} className={`${input} sm:col-span-1`} />
                <input placeholder="Celular (3001234567)" inputMode="numeric" value={nm.phone} onChange={(e) => setNm({ ...nm, phone: e.target.value })} className={input} />
                <select value={nm.plan} onChange={(e) => setNm({ ...nm, plan: e.target.value as PlanId })} className={input}>{PLANS.map((p) => <option key={p.id} value={p.id}>{p.name} — {cop(p.price)}</option>)}</select>
                <button onClick={addMember} className="px-4 py-3 text-black font-extrabold uppercase text-sm hover:brightness-110 active:scale-95 transition" style={{ background: NEON }}>Registrar</button>
              </div>
              {nmErr && <p className="text-red-400 text-sm mt-3">{nmErr}</p>}
            </div>

            <div className={`${card} mt-6`}>
              <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07]">
                <h2 className="font-display font-extrabold uppercase">Socios ({shown.length})</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(["Todos", "Al día", "Por vencer", "Vencido"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold uppercase transition ${filter === f ? "text-black" : "bg-white/5 text-zinc-300 hover:bg-white/10"}`} style={filter === f ? { background: NEON } : undefined}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs uppercase tracking-wide text-zinc-500 border-b border-white/[0.07]"><th className="p-4 font-medium">Socio</th><th className="font-medium">Plan</th><th className="font-medium">Vence</th><th className="font-medium">Estado</th><th className="p-4 text-right font-medium">Acciones</th></tr></thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {shown.map((m) => {
                        const s = statusOf(m.expires), d = daysLeft(m.expires);
                        return (
                          <motion.tr layout key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                            <td className="p-4"><p className="font-semibold">{m.name}</p><p className="text-xs text-zinc-500">{m.phone}</p></td>
                            <td className="text-zinc-300">{planOf(m.plan).name}</td>
                            <td className="text-zinc-300 whitespace-nowrap">{fmtDate(m.expires)}<p className="text-xs text-zinc-500">{d < 0 ? `hace ${-d} d` : d === 0 ? "hoy" : `en ${d} d`}</p></td>
                            <td><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold ring-1 ${sBadge(s)}`}><span className={`h-1.5 w-1.5 rounded-full ${dot(s)}`} />{s}</span></td>
                            <td className="p-4"><div className="flex justify-end gap-2 flex-wrap">
                              {s !== "Al día" && <button onClick={() => remind(m)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10 transition"><Bell size={13} /> Enviar recordatorio</button>}
                              <button onClick={() => renew(m)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-black hover:brightness-110 active:scale-95 transition" style={{ background: NEON }}><RefreshCw size={13} /> Renovar 30 días</button>
                            </div></td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                    {!shown.length && <tr><td colSpan={5} className="p-10 text-center text-zinc-500">No hay socios con este estado.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Modal lead */}
      <AnimatePresence>
        {lead && (
          <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setLead(null)} />
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} className="relative w-full max-w-md bg-[#141416] border border-white/10 p-6">
              <button aria-label="Cerrar" onClick={() => setLead(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X /></button>
              <h3 className="font-display font-extrabold uppercase italic text-2xl pr-8">{lead.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">Déjanos tus datos y abrimos WhatsApp con tu solicitud lista.</p>
              <div className="mt-5 space-y-3">
                <input placeholder="Tu nombre" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className={input} />
                <input placeholder="Tu celular (3001234567)" inputMode="numeric" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className={input} />
                {leadErr && <p className="text-red-400 text-sm">{leadErr}</p>}
                <button onClick={submitLead} className="w-full py-3.5 text-black font-extrabold uppercase tracking-wide hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2" style={{ background: NEON }}><MessageCircle size={18} /> Enviar por WhatsApp</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[130] flex items-center gap-2 text-black text-sm font-bold px-5 py-3 shadow-2xl" style={{ background: NEON }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/10 py-8 text-center text-xs uppercase tracking-widest text-zinc-600">IronClub Gym · {DEMO_BADGE}</footer>
    </div>
  );
}
