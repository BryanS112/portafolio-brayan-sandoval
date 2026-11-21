"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Globe, Workflow, BrainCircuit, BarChart3, MessageCircle, Menu, X, ArrowRight,
  Utensils, Hotel, Boxes, CalendarCheck, FlaskConical, CheckCircle2, Mail, MapPin, Zap, TrendingUp,
} from "lucide-react";
import { siteConfig, whatsappLink, DEMO_BADGE } from "@/config/site";

const services = [
  { icon: Globe, title: "Desarrollo Web", text: "Sitios y tiendas rápidas, optimizadas para celular y buscadores.", example: "Ej.: un restaurante recibe pedidos online sin comisiones de plataformas." },
  { icon: Workflow, title: "Automatización de Procesos", text: "Elimino tareas repetitivas conectando tus herramientas.", example: "Ej.: una cotización llega por WhatsApp y se registra sola en una hoja de cálculo." },
  { icon: BrainCircuit, title: "Inteligencia Artificial", text: "Asistentes y flujos con IA que atienden y clasifican a tus clientes.", example: "Ej.: un chatbot responde preguntas frecuentes de un hotel las 24 horas." },
  { icon: BarChart3, title: "Sistemas y Análisis de Datos", text: "Tableros que convierten tus ventas e inventario en decisiones.", example: "Ej.: una ferretería detecta productos con stock crítico antes de quedarse sin ellos." },
];

const demos = [
  { slug: "sabanagrill", icon: Utensils, name: "SabanaGrill", type: "Restaurante y pedidos a WhatsApp", problem: "Pedidos desordenados por chat y errores en cuentas y direcciones.", tech: ["Next.js", "React", "Tailwind", "WhatsApp"], grad: "from-orange-500 to-red-600" },
  { slug: "caribestay", icon: Hotel, name: "Caribe Stay", type: "Hotel boutique en el Caribe", problem: "Cotizar noches y habitaciones manualmente toma tiempo y se pierden reservas.", tech: ["Next.js", "TypeScript", "Cálculo de fechas"], grad: "from-sky-500 to-blue-800" },
  { slug: "ferrecontrol", icon: Boxes, name: "FerreControl", type: "Dashboard de ventas e inventario", problem: "No se sabe qué se vende más ni qué productos están por agotarse.", tech: ["Recharts", "TypeScript", "Filtros dinámicos"], grad: "from-cyan-500 to-slate-700" },
  { slug: "smartbooking", icon: CalendarCheck, name: "SmartBooking", type: "Sistema de agendamiento de citas", problem: "Agendar por llamada genera cruces de horarios y citas olvidadas.", tech: ["React", "localStorage", "Flujo por pasos"], grad: "from-violet-500 to-cyan-600" },
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 h-16">
          <a href="#inicio" className="font-extrabold tracking-wider text-lg">
            BRAYAN <span className="text-cyan-400">SANDOVAL</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            {nav.map(([l, h]) => <a key={h} href={h} className="hover:text-cyan-400 transition">{l}</a>)}
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 transition">Hablemos</a>
          </nav>
          <button aria-label="Menú" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="md:hidden border-t border-slate-800 px-5 py-4 flex flex-col gap-4 bg-slate-950">
            {nav.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-500 text-slate-950 font-semibold px-4 py-2 text-center">Hablemos</a>
          </div>
        )}
      </header>

      <section id="inicio" className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 mb-6"><MapPin size={14} className="text-cyan-400" /> {siteConfig.location} · Región Caribe</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Transformo ideas y procesos en <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">soluciones digitales.</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg">Desarrollo páginas web, automatizaciones y herramientas inteligentes que ayudan a los negocios a crecer, optimizar su tiempo y mejorar la experiencia de sus clientes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demos" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 transition">Explorar proyectos <ArrowRight size={18} /></a>
              <a href="#contacto" className="inline-flex items-center gap-2 rounded-full border border-slate-700 hover:border-violet-500 px-6 py-3 font-semibold transition">Hablemos de tu proyecto</a>
            </div>
          </div>

          <div className="floaty rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold flex items-center gap-2"><Zap size={16} className="text-violet-400" /> Flujo automatizado (simulación)</span>
              <span className="flex items-center gap-1 text-xs text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> En vivo</span>
            </div>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all duration-500 ${i === active ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-slate-800 text-slate-400"}`}>
                  <span className={`h-6 w-6 rounded-full text-xs flex items-center justify-center ${i <= active ? "bg-cyan-500 text-slate-950" : "bg-slate-800"}`}>{i + 1}</span>{s}
                </li>
              ))}
            </ol>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-800/60 p-3"><p className="text-xs text-slate-400">Pedidos procesados</p><p className="text-2xl font-bold text-cyan-400">{orders}</p></div>
              <div className="rounded-lg bg-slate-800/60 p-3"><p className="text-xs text-slate-400">Tiempo ahorrado</p><p className="text-2xl font-bold text-violet-400 flex items-center gap-1"><TrendingUp size={18} />{(orders * 0.07).toFixed(1)} h</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-extrabold">Servicios</h2>
          <p className="text-slate-400 mt-2">Soluciones prácticas para negocios reales.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ icon: Icon, title, text, example }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-cyan-500/60 hover:-translate-y-1 transition">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mb-4"><Icon size={22} className="text-white" /></div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-slate-400 text-sm mt-2">{text}</p>
                <p className="text-cyan-300/90 text-sm mt-3">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demos" className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-extrabold">Demostraciones interactivas</h2>
          <p className="text-slate-400 mt-2">Cuatro aplicaciones funcionales. Pruébalas tú mismo.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {demos.map(({ slug, icon: Icon, name, type, problem, tech, grad }) => (
              <article key={slug} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col">
                <div className={`relative h-40 bg-gradient-to-br ${grad} flex items-center justify-center`}>
                  <Icon size={64} className="text-white/90" />
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <div className="h-2 flex-1 rounded bg-white/30" /><div className="h-2 w-1/4 rounded bg-white/50" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/40 text-violet-300 text-xs font-medium px-2.5 py-1"><FlaskConical size={13} /> {DEMO_BADGE}</span>
                  <h3 className="text-xl font-bold mt-3">{name}</h3>
                  <p className="text-sm text-cyan-300">{type}</p>
                  <p className="text-slate-400 text-sm mt-3"><strong className="text-slate-200">Problema que resuelve:</strong> {problem}</p>
                  <div className="flex flex-wrap gap-2 mt-4">{tech.map((t) => <span key={t} className="text-xs rounded-md bg-slate-800 px-2 py-1 text-slate-300">{t}</span>)}</div>
                  <Link href={`/demos/${slug}`} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 transition">Ver demostración <ArrowRight size={16} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-3xl font-extrabold text-center">¿Tienes un negocio y quieres mejorarlo con tecnología?</h2>
          <p className="text-slate-400 text-center mt-3">Cuéntame tu idea y te respondo con una propuesta.</p>
          <form onSubmit={submit} noValidate className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            {([["nombre", "Nombre", "text"], ["email", "Correo electrónico", "email"]] as const).map(([k, l, t]) => (
              <div key={k}>
                <label className="text-sm text-slate-300">{l}</label>
                <input type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 outline-none px-3 py-2" />
                {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
              </div>
            ))}
            <div>
              <label className="text-sm text-slate-300">Mensaje</label>
              <textarea rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 outline-none px-3 py-2" />
              {errors.mensaje && <p className="text-red-400 text-xs mt-1">{errors.mensaje}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-3 transition"><Mail size={18} /> Enviar mensaje</button>
              <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 transition"><MessageCircle size={18} /> Escribir por WhatsApp</a>
            </div>
            {sent && <p className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle2 size={16} /> ¡Listo! Se abrió tu aplicación de correo con el mensaje preparado.</p>}
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.location} · {siteConfig.contactEmail}
      </footer>
    </div>
  );
}
