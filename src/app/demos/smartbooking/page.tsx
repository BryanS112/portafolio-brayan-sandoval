"use client";

import { useEffect, useMemo, useState } from "react";
import { Smile, Stethoscope, Sparkles, Clock, CheckCircle2, XCircle, CalendarCheck, ShieldCheck, ChevronLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white text-slate-800">
      <DemoBar name="SmartBooking" />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-teal-600 text-white flex items-center justify-center"><Smile /></div>
          <h1 className="text-3xl font-extrabold mt-3">SmartBooking</h1>
          <p className="text-slate-500">Clínica Odontológica Sonrisa Caribe (ficticia)</p>
          <span className="inline-block mt-3 rounded-full bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1">{DEMO_BADGE}</span>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {([["cliente", "Agendar cita"], ["admin", "Vista Administrador (Demo)"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === k ? "bg-teal-600 text-white shadow" : "text-slate-600"}`}>{l}</button>
            ))}
          </div>
        </div>

        {tab === "cliente" && (
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-7">
            <ol className="flex items-center gap-2 mb-6 text-xs">
              {["Servicio", "Fecha y hora", "Tus datos", "Confirmación"].map((l, i) => (
                <li key={l} className="flex-1"><div className={`h-1.5 rounded-full ${step > i ? "bg-teal-600" : "bg-slate-200"}`} /><span className={`mt-1 block ${step === i + 1 ? "font-bold text-teal-700" : "text-slate-400"}`}>{i + 1}. {l}</span></li>
              ))}
            </ol>

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => { setSvc(s); setTime(""); setStep(2); }} className={`text-left rounded-xl border-2 p-4 hover:border-teal-500 transition ${svc?.id === s.id ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}>
                    <s.icon className="text-teal-600" />
                    <p className="font-bold mt-2">{s.name}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1"><Clock size={14} /> {s.min} min · {cop(s.price)}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && svc && (
              <div>
                <p className="font-semibold mb-2">Elige el día</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const v = iso(d);
                    return <button key={v} onClick={() => { setDate(v); setTime(""); }} className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${date === v ? "bg-teal-600 text-white border-teal-600" : "hover:border-teal-500"}`}>{d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })}</button>;
                  })}
                </div>
                {date && (
                  <>
                    <p className="font-semibold mt-5 mb-2">Horarios para {svc.name} ({svc.min} min)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {slots.map(({ t, free }) => (
                        <button key={t} disabled={!free} onClick={() => setTime(t)} className={`rounded-lg border py-2 text-sm transition ${!free ? "bg-slate-100 text-slate-300 line-through cursor-not-allowed" : time === t ? "bg-teal-600 text-white border-teal-600" : "hover:border-teal-500"}`}>{t}</button>
                      ))}
                    </div>
                  </>
                )}
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-500"><ChevronLeft size={16} /> Atrás</button>
                  <button disabled={!date || !time} onClick={() => setStep(3)} className="rounded-full bg-teal-600 disabled:bg-slate-300 text-white font-semibold px-6 py-2">Continuar</button>
                </div>
              </div>
            )}

            {step === 3 && svc && (
              <div className="space-y-3">
                <div className="rounded-lg bg-teal-50 p-3 text-sm"><b>{svc.name}</b> · <span className="capitalize">{dayLabel(date)}</span> · {time}</div>
                <input placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                <input placeholder="Celular (3001234567)" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-slate-500"><ChevronLeft size={16} /> Atrás</button>
                  <button onClick={confirm} className="rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2">Confirmar cita</button>
                </div>
              </div>
            )}

            {step === 4 && last && (
              <div className="text-center py-4">
                <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
                <h2 className="text-2xl font-extrabold mt-3">¡Cita agendada!</h2>
                <p className="text-slate-600 mt-2">{last.name}, te esperamos para <b>{last.service}</b></p>
                <p className="capitalize text-slate-600">{dayLabel(last.date)} a las {last.time}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={reset} className="rounded-full border border-teal-600 text-teal-700 font-semibold px-5 py-2">Agendar otra</button>
                  <button onClick={() => setTab("admin")} className="rounded-full bg-teal-600 text-white font-semibold px-5 py-2">Verla en Vista Administrador</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "admin" && (
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold flex items-center gap-2"><CalendarCheck size={18} /> Citas agendadas ({appts.length})</h2>
              <button onClick={() => setAppts(seed())} className="text-xs text-slate-500 underline">Restablecer demo</button>
            </div>
            <ul className="divide-y">
              {sorted.map((a) => (
                <li key={a.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="font-semibold">{a.name} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${badge(a.status)}`}>{a.status}</span></p>
                    <p className="text-sm text-slate-500 capitalize">{a.service} · {dayLabel(a.date)} · {a.time} · {a.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={a.status === "Confirmada"} onClick={() => setStatus(a.id, "Confirmada")} className="flex items-center gap-1 rounded-lg bg-emerald-600 disabled:opacity-40 text-white text-sm px-3 py-1.5"><CheckCircle2 size={14} /> Confirmar</button>
                    <button disabled={a.status === "Cancelada"} onClick={() => setStatus(a.id, "Cancelada")} className="flex items-center gap-1 rounded-lg bg-red-600 disabled:opacity-40 text-white text-sm px-3 py-1.5"><XCircle size={14} /> Cancelar</button>
                  </div>
                </li>
              ))}
              {!sorted.length && <li className="py-8 text-center text-slate-500">No hay citas.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
