"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, Wind, Waves, Coffee, Tv, Bath, MessageCircle, Moon, Users, CalendarDays, Check } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

const ROOMS = [
  { id: "std", name: "Habitación Brisa", price: 280000, cap: 2, img: "1582719508461-905c673771fd", desc: "Acogedora, con balcón y vista al jardín.", am: [[Wifi, "Wi-Fi"], [Wind, "Aire acondicionado"], [Tv, "TV smart"]] },
  { id: "sup", name: "Suite Marina", price: 450000, cap: 3, img: "1602002418082-a4443e081dd1", desc: "Cama king, sala y vista parcial al mar.", am: [[Wifi, "Wi-Fi"], [Wind, "Aire acondicionado"], [Coffee, "Desayuno"], [Bath, "Jacuzzi"]] },
  { id: "vil", name: "Villa Coral", price: 780000, cap: 5, img: "1566073771259-6a8506099945", desc: "Privada con piscina y terraza frente al mar.", am: [[Wifi, "Wi-Fi"], [Waves, "Piscina"], [Coffee, "Desayuno"], [Wind, "Aire acondicionado"]] },
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
    const msg = `Hola, soy ${name}. Quisiera verificar disponibilidad en Caribe Stay (DEMO):\n\nHabitación: ${r.name}\nEntrada: ${inD}\nSalida: ${outD}\nNoches: ${nights}\nHuéspedes: ${guests}\nTotal estimado: ${cop(total)} COP`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  }
  const field = "mt-2 w-full border border-[#0F292E]/25 bg-white px-3 py-3 text-sm outline-none focus:border-[#0F292E] transition";
  const lbl = "text-[11px] tracking-[0.2em] uppercase text-[#0F292E]/70";

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#0F292E]">
      <DemoBar name="Caribe Stay" />

      <header className="relative h-[88vh] min-h-[560px] flex items-end bg-[#0F292E] text-white">
        <Photo id="1540541338287-41700207dee6" alt="Resort frente al mar con piscina y palmeras" className="absolute inset-0 bg-[#0F292E]" w={1800} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F292E] via-[#0F292E]/30 to-black/20" />
        <div className="relative mx-auto max-w-6xl w-full px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#E3D3AE]">Hotel boutique · Atlántico, Colombia</p>
            <h1 className="font-serif-resort text-6xl sm:text-8xl font-medium tracking-tight mt-4 leading-[0.95]">Caribe Stay</h1>
            <p className="mt-5 max-w-lg text-white/85 text-lg leading-relaxed">Un refugio frente al mar donde el tiempo se detiene. Brisa, silencio y hospitalidad costeña.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#reserva" className="bg-[#F7F5F0] text-[#0F292E] hover:bg-white px-8 py-3.5 text-sm tracking-widest uppercase font-medium transition">Cotizar mi estadía</a>
              <span className="text-xs border border-white/30 px-3 py-2 text-white/85">{DEMO_BADGE}</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-24 space-y-28">
        <section>
          <Reveal className="max-w-xl">
            <p className={lbl}>Alojamiento</p>
            <h2 className="font-serif-resort text-5xl mt-3 tracking-tight">Nuestras habitaciones</h2>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {ROOMS.map((x, i) => (
              <Reveal key={x.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className={`bg-white group h-full flex flex-col ring-1 transition ${room === x.id ? "ring-[#0F292E]" : "ring-[#0F292E]/10"}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Photo id={x.img} alt={x.name} w={800} className="absolute inset-0 bg-[#0F292E]/80 transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute bottom-3 left-3 bg-[#F7F5F0] text-[11px] tracking-widest uppercase px-2.5 py-1 flex items-center gap-1.5"><Users size={12} /> Hasta {x.cap}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif-resort text-3xl">{x.name}</h3>
                    <p className="text-sm text-[#0F292E]/70 mt-2 leading-relaxed">{x.desc}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-[#0F292E]/80">
                      {x.am.map(([Icon, l]) => <li key={l} className="flex items-center gap-1.5"><Icon size={14} strokeWidth={1.4} className="text-[#5E6B3E]" /> {l}</li>)}
                    </ul>
                    <div className="mt-auto pt-6">
                      <p className="font-serif-resort text-3xl">{cop(x.price)} <span className="font-sans text-xs text-[#0F292E]/60">/ noche</span></p>
                      <button onClick={() => pickRoom(x.id)} className={`mt-4 w-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition flex items-center justify-center gap-2 ${room === x.id ? "bg-[#5E6B3E] text-white" : "bg-[#0F292E] text-white hover:bg-[#1b4048]"}`}>
                        {room === x.id ? <><Check size={14} /> Seleccionada</> : "Seleccionar"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-0 bg-[#0F292E] text-white overflow-hidden">
          <Photo id="1571896349842-33c89424de2d" alt="Piscina del hotel al atardecer" className="min-h-[320px] bg-[#0F292E]" w={1000} />
          <Reveal className="p-10 sm:p-14 flex flex-col justify-center">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E3D3AE]">La experiencia</p>
            <h2 className="font-serif-resort text-4xl sm:text-5xl mt-3 tracking-tight">Arquitectura tropical, ritmo pausado</h2>
            <p className="mt-4 text-white/75 leading-relaxed">Espacios abiertos, maderas nobles y jardines que invitan a quedarse un día más. Desayuno de la región incluido en suites y villas.</p>
          </Reveal>
        </section>

        <section id="reserva" className="scroll-mt-24">
          <Reveal>
            <div className="bg-white ring-1 ring-[#0F292E]/10 p-8 sm:p-12">
              <p className={lbl}>Reservas</p>
              <h2 className="font-serif-resort text-5xl mt-3 tracking-tight flex items-center gap-3"><CalendarDays size={34} strokeWidth={1.2} /> Cotiza tu reserva</h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5 mt-10">
                <label className={lbl}>Habitación
                  <select value={room} onChange={(e) => pickRoom(e.target.value)} className={`${field} normal-case tracking-normal text-[#0F292E]`}>{ROOMS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
                </label>
                <label className={lbl}>Huéspedes (máx. {r.cap})
                  <input type="number" min={1} max={r.cap} value={guests} onChange={(e) => setGuests(Math.min(r.cap, Math.max(1, Number(e.target.value) || 1)))} className={`${field} normal-case tracking-normal text-[#0F292E]`} />
                </label>
                <label className={lbl}>Fecha de entrada
                  <input type="date" min={today()} value={inD} onChange={(e) => { setIn(e.target.value); if (outD && outD <= e.target.value) setOut(""); }} className={`${field} normal-case tracking-normal text-[#0F292E]`} />
                </label>
                <label className={lbl}>Fecha de salida
                  <input type="date" min={inD || today()} value={outD} onChange={(e) => setOut(e.target.value)} className={`${field} normal-case tracking-normal text-[#0F292E]`} />
                </label>
                <label className={`${lbl} sm:col-span-2`}>Tu nombre
                  <input value={name} onChange={(e) => setName(e.target.value)} className={`${field} normal-case tracking-normal text-[#0F292E]`} />
                </label>
              </div>
              <div className="mt-8 border-t border-[#0F292E]/15 pt-6 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-2 text-[#0F292E]/80"><Moon size={18} strokeWidth={1.4} /> <span className="font-medium"><motion.span key={nights} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">{nights}</motion.span> {nights === 1 ? "noche" : "noches"}</span> × {cop(r.price)}</div>
                <div className="text-right"><p className={lbl}>Total estimado</p><motion.p key={total} initial={{ opacity: 0.4, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="font-serif-resort text-5xl">{cop(total)}</motion.p></div>
              </div>
              <AnimatePresence>{err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-700 text-sm mt-4">{err}</motion.p>}</AnimatePresence>
              <button onClick={send} className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-[#5E6B3E] hover:bg-[#6d7c48] text-white text-xs tracking-[0.2em] uppercase font-medium px-9 py-4 transition"><MessageCircle size={16} /> Solicitar disponibilidad por WhatsApp</button>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="border-t border-[#0F292E]/10 py-8 text-center text-xs tracking-widest uppercase text-[#0F292E]/50">Caribe Stay · Hotel ficticio de demostración</footer>
    </div>
  );
}
