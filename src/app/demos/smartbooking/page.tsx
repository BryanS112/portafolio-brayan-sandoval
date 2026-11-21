"use client";

import { useEffect, useMemo, useState } from "react";
import { Smile, Stethoscope, Sparkles, Clock, CheckCircle2, XCircle, CalendarCheck, ShieldCheck, ChevronLeft, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DemoBar from "@/components/DemoBar";
import { cop, DEMO_BADGE } from "@/config/site";

const SERVICES = [
  { id: "val", name: "Valoración general", min: 30, price: 40000, icon: Stethoscope },
  { id: "lim", name: "Limpieza dental", min: 45, price: 90000, icon: Sparkles },
  { id: "bla", name: "Blanqueamiento", min: 60, price: 280000, icon: Smile },
  { id: "ort", name: "Control de ortodoncia", min: 30, price: 70000, icon: ShieldCheck },
];
type Status = "Pendiente" | "Confirmada" | "Cancelada";
type Appt = { id: string; name: string; phone: string; service: string; date: string; time: string; min: number; status: Status };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); }
  return out;
}
const DAYS = nextDays(8);

const seed = (): Appt[] => [
  { id: "s1", name: "Laura Gómez", phone: "3001112233", service: "Limpieza dental", date: iso(DAYS[0]), time: "09:00", min: 45, status: "Confirmada" },
  { id: "s2", name: "Carlos Pérez", phone: "3014445566", service: "Valoración general", date: iso(DAYS[0]), time: "11:00", min: 30, status: "Pendiente" },
  { id: "s3", name: "Andrea Mejía", phone: "3027778899", service: "Blanqueamiento", date: iso(DAYS[1]), time: "14:00", min: 60, status: "Pendiente" },
];

const KEY = "smartbooking-demo-appts";

export default function SmartBooking() {
  const [tab, setTab] = useState<"cliente" | "admin">("cliente");
  const [step, setStep] = useState(1);
  const [svc, setSvc] = useState<(typeof SERVICES)[number] | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [err, setErr] = useState("");
  const [appts, setAppts] = useState<Appt[]>([]);
  const [last, setLast] = useState<Appt | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      setAppts(s ? JSON.parse(s) : seed());
    } catch { setAppts(seed()); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(appts)); }, [appts, ready]);

  const slots = useMemo(() => {
    if (!svc || !date) return [];
    const busy = appts.filter((a) => a.date === date && a.status !== "Cancelada").map((a) => [toMin(a.time), toMin(a.time) + a.min]);
    const res: { t: string; free: boolean }[] = [];
    for (let m = 8 * 60; m + svc.min <= 17 * 60; m += 30) {
      if (m >= 12 * 60 && m < 14 * 60) continue; // almuerzo
      const free = !busy.some(([s, e]) => m < e && m + svc.min > s) && !(m < 12 * 60 && m + svc.min > 12 * 60);
      res.push({ t: fmt(m), free });
    }
    return res;
  }, [svc, date, appts]);

  function confirm() {
    if (form.name.trim().length < 3) return setErr("Escribe el nombre completo.");
    if (!/^3\d{9}$/.test(form.phone.replace(/\s/g, ""))) return setErr("Ingresa un celular colombiano de 10 dígitos (ej. 3001234567).");
    const a: Appt = { id: String(Date.now()), name: form.name.trim(), phone: form.phone, service: svc!.name, date, time, min: svc!.min, status: "Pendiente" };
    setAppts((p) => [...p, a]);
    setLast(a); setErr(""); setStep(4);
  }
  function reset() { setStep(1); setSvc(null); setDate(""); setTime(""); setForm({ name: "", phone: "" }); setLast(null); }
  function setStatus(id: string, status: Status) { setAppts((p) => p.map((a) => (a.id === id ? { ...a, status } : a))); }

  const dayLabel = (s: string) => new Date(s + "T00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const sorted = [...appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const badge = (s: Status) => s === "Confirmada" ? "bg-emerald-100 text-emerald-700" : s === "Cancelada" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";

  const stepLabels = ["Servicio", "Fecha y hora", "Tus datos", "Confirmación"];
  const field = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 transition";
  const slide = { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 }, transition: { duration: 0.25 } };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <DemoBar name="SmartBooking" />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/25"><Smile size={24} strokeWidth={1.8} /></div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">SmartBooking</h1>
          <p className="text-slate-500 text-sm">Clínica Odontológica Sonrisa Caribe (ficticia)</p>
          <span className="inline-block mt-3 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium px-3 py-1">{DEMO_BADGE}</span>
        </motion.div>

        <div className="mt-7 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {([["cliente", "Agendar cita"], ["admin", "Vista Administrador (Demo)"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`relative px-4 py-2 rounded-full text-sm font-semibold transition ${tab === k ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === k && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === "cliente" && (
          <div className="mt-7 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(2,132,199,0.07)] p-5 sm:p-8">
            <ol className="flex items-center mb-8">
              {stepLabels.map((l, i) => (
                <li key={l} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`h-8 w-8 rounded-full text-sm font-semibold flex items-center justify-center transition ${step > i + 1 ? "bg-sky-600 text-white" : step === i + 1 ? "bg-sky-600 text-white ring-4 ring-sky-100" : "bg-slate-100 text-slate-400"}`}>
                      {step > i + 1 ? <Check size={16} /> : i + 1}
                    </span>
                    <span className={`text-[11px] hidden sm:block ${step === i + 1 ? "font-semibold text-sky-700" : "text-slate-400"}`}>{l}</span>
                  </div>
                  {i < 3 && <div className={`flex-1 h-0.5 mx-2 mb-5 rounded ${step > i + 1 ? "bg-sky-600" : "bg-slate-100"}`} />}
                </li>
              ))}
            </ol>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" {...slide} className="grid sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button key={s.id} onClick={() => { setSvc(s); setTime(""); setStep(2); }} className={`text-left rounded-2xl border-2 p-5 hover:border-sky-500 hover:-translate-y-0.5 hover:shadow-md transition ${svc?.id === s.id ? "border-sky-600 bg-sky-50" : "border-slate-200"}`}>
                      <span className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><s.icon size={20} strokeWidth={1.7} /></span>
                      <p className="font-semibold mt-3">{s.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5"><Clock size={14} /> {s.min} min · {cop(s.price)}</p>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 2 && svc && (
                <motion.div key="s2" {...slide}>
                  <p className="font-semibold mb-3 text-sm">Elige el día</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {DAYS.map((d) => {
                      const v = iso(d);
                      const sel = date === v;
                      return (
                        <button key={v} onClick={() => { setDate(v); setTime(""); }} className={`rounded-2xl border py-2.5 text-center transition ${sel ? "bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/25" : "border-slate-200 hover:border-sky-400 hover:bg-sky-50"}`}>
                          <span className={`block text-[10px] uppercase tracking-wide ${sel ? "text-sky-100" : "text-slate-400"}`}>{d.toLocaleDateString("es-CO", { weekday: "short" })}</span>
                          <span className="block text-xl font-bold leading-tight">{d.getDate()}</span>
                          <span className={`block text-[10px] ${sel ? "text-sky-100" : "text-slate-400"}`}>{d.toLocaleDateString("es-CO", { month: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                  {date && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="font-semibold mt-6 mb-3 text-sm">Horarios para {svc.name} <span className="text-slate-400 font-normal">({svc.min} min)</span></p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {slots.map(({ t, free }) => (
                          <button key={t} disabled={!free} onClick={() => setTime(t)} className={`rounded-xl border py-2.5 text-sm font-medium transition ${!free ? "bg-slate-50 text-slate-300 line-through border-slate-100 cursor-not-allowed" : time === t ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/25" : "border-slate-200 hover:border-sky-500 hover:text-sky-700"}`}>{t}</button>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-slate-300" /> Disponible</span>
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sky-600" /> Seleccionado</span>
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Ocupado</span>
                      </div>
                    </motion.div>
                  )}
                  <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ChevronLeft size={16} /> Atrás</button>
                    <button disabled={!date || !time} onClick={() => setStep(3)} className="rounded-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-7 py-2.5 transition">Continuar</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && svc && (
                <motion.div key="s3" {...slide} className="space-y-3">
                  <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 text-sm flex flex-wrap gap-x-3"><b>{svc.name}</b> <span className="capitalize text-slate-600">{dayLabel(date)}</span> <span className="text-slate-600">{time}</span></div>
                  <input placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
                  <input placeholder="Celular (3001234567)" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
                  {err && <p className="text-red-600 text-sm">{err}</p>}
                  <div className="flex justify-between items-center pt-3">
                    <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ChevronLeft size={16} /> Atrás</button>
                    <button onClick={confirm} className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-7 py-2.5 transition">Confirmar cita</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && last && (
                <motion.div key="s4" {...slide} className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="text-emerald-500" size={40} /></motion.div>
                  <h2 className="text-2xl font-bold tracking-tight mt-4">¡Cita agendada!</h2>
                  <p className="text-slate-600 mt-2">{last.name}, te esperamos para <b>{last.service}</b></p>
                  <p className="capitalize text-slate-500 text-sm">{dayLabel(last.date)} a las {last.time}</p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button onClick={reset} className="rounded-full border border-sky-600 text-sky-700 hover:bg-sky-50 font-semibold px-5 py-2.5 transition">Agendar otra</button>
                    <button onClick={() => setTab("admin")} className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 transition">Verla en Vista Administrador</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tab === "admin" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-7 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(2,132,199,0.07)] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2"><CalendarCheck size={18} className="text-sky-600" /> Citas agendadas ({appts.length})</h2>
              <button onClick={() => setAppts(seed())} className="text-xs text-slate-500 underline hover:text-slate-800">Restablecer demo</button>
            </div>
            <ul className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {sorted.map((a) => (
                  <motion.li key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-4 flex flex-wrap items-center gap-3 justify-between">
                    <div>
                      <p className="font-semibold">{a.name} <span className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge(a.status)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{a.status}</span></p>
                      <p className="text-sm text-slate-500 capitalize">{a.service} · {dayLabel(a.date)} · {a.time} · {a.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={a.status === "Confirmada"} onClick={() => setStatus(a.id, "Confirmada")} className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-sm px-3 py-1.5 transition"><CheckCircle2 size={14} /> Confirmar</button>
                      <button disabled={a.status === "Cancelada"} onClick={() => setStatus(a.id, "Cancelada")} className="flex items-center gap-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 text-sm px-3 py-1.5 transition"><XCircle size={14} /> Cancelar</button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
              {!sorted.length && <li className="py-8 text-center text-slate-500">No hay citas.</li>}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
