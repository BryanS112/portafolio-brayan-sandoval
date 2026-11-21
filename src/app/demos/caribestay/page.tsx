"use client";

import { useMemo, useState } from "react";
import { Wifi, Wind, Waves, Coffee, Tv, Bath, MessageCircle, Moon, Users, CalendarDays, Palmtree } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

const ROOMS = [
  { id: "std", name: "Habitación Brisa", price: 280000, cap: 2, desc: "Acogedora, con balcón y vista al jardín.", am: [[Wifi, "Wi-Fi"], [Wind, "Aire acond."], [Tv, "TV smart"]] },
  { id: "sup", name: "Suite Marina", price: 450000, cap: 3, desc: "Cama king, sala y vista parcial al mar.", am: [[Wifi, "Wi-Fi"], [Wind, "Aire acond."], [Coffee, "Desayuno"], [Bath, "Jacuzzi"]] },
  { id: "vil", name: "Villa Coral", price: 780000, cap: 5, desc: "Privada con piscina y terraza frente al mar.", am: [[Wifi, "Wi-Fi"], [Waves, "Piscina"], [Coffee, "Desayuno"], [Wind, "Aire acond."]] },
] as const;

const today = () => new Date().toISOString().slice(0, 10);

export default function CaribeStay() {
  const [room, setRoom] = useState<string>("std");
  const [inD, setIn] = useState("");
  const [outD, setOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const r = ROOMS.find((x) => x.id === room)!;
  const nights = useMemo(() => {
    if (!inD || !outD) return 0;
    const d = (new Date(outD).getTime() - new Date(inD).getTime()) / 86400000;
    return d > 0 ? Math.round(d) : 0;
  }, [inD, outD]);
  const total = nights * r.price;

  function pickRoom(id: string) {
    setRoom(id);
    const cap = ROOMS.find((x) => x.id === id)!.cap;
    if (guests > cap) setGuests(cap);
    document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
  }

  function send() {
    if (!inD || !outD) return setErr("Selecciona las fechas de entrada y salida.");
    if (nights < 1) return setErr("La salida debe ser posterior a la entrada.");
    if (name.trim().length < 2) return setErr("Escribe tu nombre.");
    setErr("");
    const msg = `Hola, soy ${name}. Quisiera verificar disponibilidad en Caribe Stay (DEMO):\n\n🏨 ${r.name}\n📅 Entrada: ${inD}\n📅 Salida: ${outD}\n🌙 Noches: ${nights}\n👥 Huéspedes: ${guests}\n💰 Total estimado: ${cop(total)} COP`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  }

  return (
    <div className="min-h-screen bg-[#faf6ee] text-slate-800">
      <DemoBar name="Caribe Stay" />
      <header className="pt-28 pb-16 text-center bg-gradient-to-b from-[#0b2545] to-[#13538a] text-white px-5">
        <Palmtree className="mx-auto text-amber-300" size={40} />
        <h1 className="text-4xl sm:text-5xl font-serif mt-3">Caribe Stay</h1>
        <p className="text-sky-100 mt-2">Hotel boutique frente al mar · Atlántico, Colombia</p>
        <p className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1 text-xs">{DEMO_BADGE}</p>
        <div><a href="#reserva" className="mt-6 inline-block rounded-full bg-amber-300 text-[#0b2545] font-semibold px-6 py-3 hover:bg-amber-200">Cotizar mi estadía</a></div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 space-y-14">
        <section>
          <h2 className="text-3xl font-serif text-[#0b2545] mb-6">Nuestras habitaciones</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ROOMS.map((x) => (
              <div key={x.id} className={`rounded-2xl bg-white overflow-hidden shadow-sm border-2 transition ${room === x.id ? "border-[#13538a]" : "border-transparent"}`}>
                <div className="h-36 bg-gradient-to-br from-amber-200 via-sky-200 to-[#13538a] flex items-end p-3">
                  <span className="rounded-full bg-white/90 text-xs px-2 py-1 flex items-center gap-1"><Users size={12} /> Hasta {x.cap}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-[#0b2545]">{x.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{x.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {x.am.map(([Icon, l]) => <span key={l} className="flex items-center gap-1 text-xs bg-sky-50 text-[#13538a] rounded-full px-2 py-1"><Icon size={12} /> {l}</span>)}
                  </div>
                  <p className="mt-4 text-2xl font-bold text-[#0b2545]">{cop(x.price)} <span className="text-sm font-normal text-slate-500">/ noche</span></p>
                  <button onClick={() => pickRoom(x.id)} className={`mt-3 w-full rounded-full py-2 font-semibold transition ${room === x.id ? "bg-[#13538a] text-white" : "bg-[#0b2545] text-white hover:bg-[#13538a]"}`}>{room === x.id ? "Seleccionada ✓" : "Seleccionar"}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="reserva" className="rounded-3xl bg-white shadow-lg p-6 sm:p-8 border border-amber-100">
          <h2 className="text-3xl font-serif text-[#0b2545] flex items-center gap-2"><CalendarDays /> Cotiza tu reserva</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <label className="text-sm">Habitación
              <select value={room} onChange={(e) => pickRoom(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">{ROOMS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
            </label>
            <label className="text-sm">Huéspedes (máx. {r.cap})
              <input type="number" min={1} max={r.cap} value={guests} onChange={(e) => setGuests(Math.min(r.cap, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
            <label className="text-sm">Fecha de entrada
              <input type="date" min={today()} value={inD} onChange={(e) => { setIn(e.target.value); if (outD && outD <= e.target.value) setOut(""); }} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
            <label className="text-sm">Fecha de salida
              <input type="date" min={inD || today()} value={outD} onChange={(e) => setOut(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
            <label className="text-sm sm:col-span-2">Tu nombre
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
          </div>
          <div className="mt-6 rounded-2xl bg-sky-50 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#0b2545]"><Moon size={20} /> <span className="font-semibold">{nights} {nights === 1 ? "noche" : "noches"}</span> × {cop(r.price)}</div>
            <div className="text-right"><p className="text-xs text-slate-500">Total estimado</p><p className="text-3xl font-bold text-[#0b2545]">{cop(total)}</p></div>
          </div>
          {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
          <button onClick={send} className="mt-5 w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3"><MessageCircle size={18} /> Solicitar disponibilidad por WhatsApp</button>
        </section>
      </main>
    </div>
  );
}
