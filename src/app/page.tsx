"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe, Workflow, BrainCircuit, BarChart3, MessageCircle, Menu, X, ArrowRight,
  FlaskConical, CheckCircle2, Mail, MapPin, Zap, TrendingUp, CalendarDays,
} from "lucide-react";
import { siteConfig, whatsappLink, DEMO_BADGE } from "@/config/site";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";

const services = [
  { icon: Globe, title: "Desarrollo Web", text: "Sitios y tiendas rápidas, optimizadas para celular y buscadores.", example: "Un restaurante recibe pedidos online sin comisiones de plataformas." },
  { icon: Workflow, title: "Automatización de Procesos", text: "Elimino tareas repetitivas conectando tus herramientas.", example: "Una cotización llega por WhatsApp y se registra sola en una hoja de cálculo." },
  { icon: BrainCircuit, title: "Inteligencia Artificial", text: "Asistentes y flujos con IA que atienden y clasifican a tus clientes.", example: "Un chatbot responde preguntas frecuentes de un hotel las 24 horas." },
  { icon: BarChart3, title: "Sistemas y Análisis de Datos", text: "Tableros que convierten tus ventas e inventario en decisiones.", example: "Una ferretería detecta productos con stock crítico antes de agotarse." },
];

function MiniDashboard() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className="h-8 rounded-md bg-white shadow-sm" />)}</div>
      <div className="flex-1 rounded-md bg-white shadow-sm p-2">
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
          <defs><linearGradient id="mg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0891b2" stopOpacity=".4" /><stop offset="1" stopColor="#0891b2" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 45 L25 38 L50 42 L75 25 L100 30 L125 15 L150 22 L175 8 L200 12 V60 H0Z" fill="url(#mg)" />
          <path d="M0 45 L25 38 L50 42 L75 25 L100 30 L125 15 L150 22 L175 8 L200 12" fill="none" stroke="#0891b2" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
function MiniCalendar() {
  return (
    <div className="absolute inset-0 bg-white p-4 grid grid-cols-7 gap-1.5 content-center">
      {Array.from({ length: 21 }).map((_, i) => (
        <div key={i} className={`aspect-square rounded-md ${i === 9 ? "bg-sky-600" : i % 5 === 0 ? "bg-slate-100" : "bg-sky-50 border border-sky-100"}`} />
      ))}
    </div>
  );
}

const demos = [
  { slug: "sabanagrill", name: "SabanaGrill", type: "Restaurante y pedidos a WhatsApp", problem: "Pedidos desordenados por chat y errores en cuentas y direcciones.", tech: ["Next.js", "Framer Motion", "Tailwind", "WhatsApp"], preview: <Photo id="1544025162-d76694265947" alt="Costillas BBQ sobre tabla de madera" className="absolute inset-0 bg-zinc-800" w={900} /> },
  { slug: "caribestay", name: "Caribe Stay", type: "Hotel boutique en el Caribe", problem: "Cotizar noches y habitaciones manualmente toma tiempo y se pierden reservas.", tech: ["Next.js", "TypeScript", "Cálculo de fechas"], preview: <Photo id="1520250497591-112f2f40a3f4" alt="Piscina de hotel tropical entre palmeras" className="absolute inset-0 bg-emerald-900" w={900} /> },
  { slug: "ferrecontrol", name: "FerreControl", type: "Dashboard de ventas e inventario", problem: "No se sabe qué se vende más ni qué productos están por agotarse.", tech: ["Recharts", "TypeScript", "Filtros dinámicos"], preview: <MiniDashboard /> },
  { slug: "smartbooking", name: "SmartBooking", type: "Sistema de agendamiento de citas", problem: "Agendar por llamada genera cruces de horarios y citas olvidadas.", tech: ["React", "localStorage", "Flujo por pasos"], preview: <MiniCalendar /> },
  { slug: "ironclub", name: "IronClub Gym", type: "Fitness y gestión de miembros", problem: "Mensualidades en cuadernos y Excel: socios vencidos que nadie cobra a tiempo.", tech: ["localStorage", "Framer Motion", "Calculadora IMC", "WhatsApp"], preview: <Photo id="1605296867304-46d5465a13f1" alt="Atleta levantando una barra en un gimnasio oscuro" className="absolute inset-0 bg-zinc-900" w={1200} /> },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTicks((n) => n + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const steps = ["Cliente escribe por WhatsApp", "Bot clasifica la solicitud", "Pedido se registra en el sistema", "Equipo recibe la alerta"];
  const active = ticks % steps.length;
  const orders = 120 + ticks * 3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.nombre.trim().length < 2) er.nombre = "Escribe tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Ingresa un correo válido.";
    if (form.mensaje.trim().length < 10) er.mensaje = "Cuéntame un poco más (mínimo 10 caracteres).";
    setErrors(er);
    if (Object.keys(er).length) return;
    const subject = encodeURIComponent(`Consulta de ${form.nombre}`);
    const body = encodeURIComponent(`${form.mensaje}\n\nCorreo de contacto: ${form.email}`);
    setSent(true);
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
  }

  const nav = [["Servicios", "#servicios"], ["Demostraciones", "#demos"], ["Contacto", "#contacto"]];
  const wa = whatsappLink("Hola Brayan, quiero hablar sobre un proyecto para mi negocio.");
  const input = "mt-1.5 w-full rounded-lg bg-white/[0.03] border border-white/10 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 outline-none px-3.5 py-2.5 text-sm transition";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#09090b]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 h-16">
          <a href="#inicio" className="font-display font-bold tracking-tight text-lg">
            BRAYAN <span className="text-cyan-400">SANDOVAL</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            {nav.map(([l, h]) => <a key={h} href={h} className="hover:text-white transition">{l}</a>)}
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-white text-zinc-900 hover:bg-zinc-200 font-semibold px-4 py-2 transition">Hablemos</a>
          </nav>
          <button aria-label="Menú" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-white/10 bg-[#09090b]">
              <div className="px-5 py-4 flex flex-col gap-4">
                {nav.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
                <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-white text-zinc-900 font-semibold px-4 py-2 text-center">Hablemos</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="inicio" className="relative pt-36 pb-28 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-40 right-[-10%] h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 mb-6"><MapPin size={13} className="text-cyan-400" /> {siteConfig.location} · Región Caribe</span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Transformo ideas y procesos en <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-500 bg-clip-text text-transparent">soluciones digitales.</span>
            </h1>
            <p className="mt-6 text-zinc-400 text-lg leading-relaxed">Desarrollo páginas web, automatizaciones y herramientas inteligentes que ayudan a los negocios a crecer, optimizar su tiempo y mejorar la experiencia de sus clientes.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#demos" className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 font-semibold px-6 py-3 transition">Explorar proyectos <ArrowRight size={18} /></a>
              <a href="#contacto" className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:bg-white/5 px-6 py-3 font-semibold transition">Hablemos de tu proyecto</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <GlowCard className="p-5 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold flex items-center gap-2"><Zap size={16} className="text-violet-400" /> Flujo automatizado (simulación)</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> En vivo</span>
              </div>
              <ol className="space-y-2">
                {steps.map((s, i) => (
                  <li key={s} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-500 ${i === active ? "border-cyan-400/50 bg-cyan-400/10 text-white" : "border-white/10 text-zinc-500"}`}>
                    <span className={`h-6 w-6 rounded-full text-xs font-semibold flex items-center justify-center transition ${i <= active ? "bg-cyan-400 text-zinc-950" : "bg-white/10"}`}>{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className="text-xs text-zinc-500">Pedidos procesados</p><p className="font-display text-2xl font-bold text-cyan-400 tabular-nums">{orders}</p></div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className="text-xs text-zinc-500">Tiempo ahorrado</p><p className="font-display text-2xl font-bold text-violet-400 flex items-center gap-1 tabular-nums"><TrendingUp size={18} />{(orders * 0.07).toFixed(1)} h</p></div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      <section id="servicios" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm font-medium text-cyan-400">Qué hago</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Servicios</h2>
            <p className="text-zinc-400 mt-3 max-w-xl">Soluciones prácticas para negocios reales.</p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(({ icon: Icon, title, text, example }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <GlowCard className="p-6 h-full">
                  <div className="h-10 w-10 rounded-lg border border-white/10 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 flex items-center justify-center mb-5"><Icon size={19} className="text-cyan-300" strokeWidth={1.6} /></div>
                  <h3 className="font-display font-semibold text-lg tracking-tight">{title}</h3>
                  <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{text}</p>
                  <p className="text-zinc-500 text-sm mt-4 pt-4 border-t border-white/10"><span className="text-cyan-300">Ejemplo · </span>{example}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demos" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm font-medium text-violet-400">Portafolio</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Demostraciones interactivas</h2>
            <p className="text-zinc-400 mt-3">Cinco aplicaciones funcionales. Pruébalas tú mismo.</p>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {demos.map(({ slug, name, type, problem, tech, preview }, i) => (
              <Reveal key={slug} delay={(i % 2) * 0.08} className={slug === "ironclub" ? "md:col-span-2" : ""}>
                <GlowCard className="flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden border-b border-white/10">
                    {preview}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-400/30 text-violet-300 text-xs font-medium px-2.5 py-1"><FlaskConical size={12} /> {DEMO_BADGE}</span>
                    <h3 className="font-display text-xl font-semibold tracking-tight mt-4">{name}</h3>
                    <p className="text-sm text-cyan-300">{type}</p>
                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed"><strong className="text-zinc-200 font-medium">Problema que resuelve:</strong> {problem}</p>
                    <div className="flex flex-wrap gap-2 mt-4">{tech.map((t) => <span key={t} className="text-xs rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">{t}</span>)}</div>
                    <Link href={`/demos/${slug}`} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 font-semibold px-5 py-2.5 text-sm transition group/b">Ver demostración <ArrowRight size={16} className="transition group-hover/b:translate-x-0.5" /></Link>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[700px] rounded-full bg-violet-500/15 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-center">¿Tienes un negocio y quieres mejorarlo con tecnología?</h2>
            <p className="text-zinc-400 text-center mt-3">Cuéntame tu idea y te respondo con una propuesta.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 space-y-4">
              {([["nombre", "Nombre", "text"], ["email", "Correo electrónico", "email"]] as const).map(([k, l, t]) => (
                <div key={k}>
                  <label className="text-sm text-zinc-300">{l}</label>
                  <input type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={input} />
                  {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm text-zinc-300">Mensaje</label>
                <textarea rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} className={input} />
                {errors.mensaje && <p className="text-red-400 text-xs mt-1">{errors.mensaje}</p>}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-3 transition"><Mail size={18} /> Enviar mensaje</button>
                <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3 transition"><MessageCircle size={18} /> Escribir por WhatsApp</a>
              </div>
              <AnimatePresence>
                {sent && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle2 size={16} /> ¡Listo! Se abrió tu aplicación de correo con el mensaje preparado.</motion.p>}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500 flex flex-wrap items-center justify-center gap-x-2">
        <CalendarDays size={14} className="hidden" />
        © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.location} · {siteConfig.contactEmail}
      </footer>
    </div>
  );
}
