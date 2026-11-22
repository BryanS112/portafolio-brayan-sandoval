"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe, Workflow, Layers, BarChart3, Wrench, MessageCircle, Menu, X, ArrowRight,
  FlaskConical, CheckCircle2, Mail, MapPin, ChevronDown, Copy, Check, Sun, Moon,
} from "lucide-react";
import { siteConfig, whatsappLink, mailtoLink, demoQuoteLink, DEMO_BADGE } from "@/config/site";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import HeroAutomationCard from "@/components/HeroAutomationCard";

const SERVICE_OPTIONS = [
  "Desarrollo de páginas y aplicaciones web",
  "Automatización de procesos",
  "Sistemas de gestión y administración",
  "Analítica y dashboards",
  "Soluciones tecnológicas personalizadas",
] as const;

const services = [
  {
    icon: Globe,
    title: "Desarrollo web",
    text: "Páginas y aplicaciones web rápidas, claras y adaptadas a dispositivos móviles.",
    problem: "Resuelve la falta de presencia profesional en internet y facilita que tus clientes encuentren tu oferta y te contacten directo.",
  },
  {
    icon: Workflow,
    title: "Automatización",
    text: "Conexión de formularios, WhatsApp y herramientas de oficina para reducir tareas manuales.",
    problem: "Elimina la captura repetitiva de pedidos, cotizaciones o registros que hoy se pierden en chats.",
  },
  {
    icon: Layers,
    title: "Sistemas de gestión",
    text: "Aplicaciones web internas para administrar clientes, citas, mensualidades o pedidos.",
    problem: "Reemplaza cuadernos y hojas de cálculo desordenadas por un control centralizado de tu operación diaria.",
  },
  {
    icon: BarChart3,
    title: "Analítica y dashboards",
    text: "Tableros visuales que resumen ventas, márgenes, inventarios y alertas en tiempo real.",
    problem: "Permite tomar decisiones con datos claros sin revisar reportes dispersos ni depender de cálculos manuales.",
  },
  {
    icon: Wrench,
    title: "Soluciones personalizadas",
    text: "Herramientas diseñadas alrededor del flujo particular de cada empresa o emprendimiento.",
    problem: "Cubre necesidades específicas que los programas genéricos no resuelven o complican innecesariamente.",
  },
];

const demos = [
  {
    slug: "sabanagrill",
    sector: "Gastronomía",
    name: "SabanaGrill",
    type: "Restaurante y pedidos a WhatsApp",
    need: "Ideal para restaurantes y comidas rápidas que necesitan recibir pedidos estructurados y mostrar su menú digital.",
    problem: "Pedidos desordenados por chat y errores en cuentas y direcciones.",
    tech: ["Next.js", "Framer Motion", "Tailwind", "WhatsApp"],
    preview: <Photo id="1544025162-d76694265947" alt="Costillas BBQ sobre tabla de madera" className="h-full w-full bg-zinc-800" sizes="(max-width: 768px) 100vw, 50vw" />,
  },
  {
    slug: "caribestay",
    sector: "Hotelería",
    name: "Caribe Stay",
    type: "Hotel boutique en el Caribe",
    need: "Pensado para hoteles, hostales y cabañas que quieren cotizar estadías por fechas y recibir reservas directas.",
    problem: "Cotizar noches y habitaciones manualmente toma tiempo y se pierden reservas.",
    tech: ["Next.js", "TypeScript", "Cálculo de fechas"],
    preview: <Photo id="1520250497591-112f2f40a3f4" alt="Piscina de hotel tropical entre palmeras" className="h-full w-full bg-emerald-900" sizes="(max-width: 768px) 100vw, 50vw" />,
  },
  {
    slug: "ferrecontrol",
    sector: "Comercio y B2B",
    name: "FerreControl",
    type: "Dashboard de ventas e inventario",
    need: "Enfocado en ferreterías, distribuidoras y comercios que requieren visibilidad de ventas, márgenes y stock mínimo.",
    problem: "No se sabe qué se vende más ni qué productos están por agotarse.",
    tech: ["Recharts", "TypeScript", "Filtros dinámicos"],
    preview: <Photo id="1530124566582-a618bc2615dc" alt="Herramientas de ferretería organizadas en estante" className="h-full w-full bg-slate-800" sizes="(max-width: 768px) 100vw, 50vw" />,
  },
  {
    slug: "smartbooking",
    sector: "Salud y Servicios",
    name: "SmartBooking",
    type: "Sistema de agendamiento de citas",
    need: "Adecuado para clínicas, consultorios, barberías y centros de servicios que agendan por horarios.",
    problem: "Agendar por llamada genera cruces de horarios y citas olvidadas.",
    tech: ["React", "localStorage", "Flujo por pasos"],
    preview: <Photo id="1629909613654-28e377c37b09" alt="Consultorio odontológico moderno" className="h-full w-full bg-sky-900" sizes="(max-width: 768px) 100vw, 50vw" />,
  },
  {
    slug: "ironclub",
    sector: "Fitness",
    name: "IronClub Gym",
    type: "Fitness y gestión de miembros",
    need: "Diseñado para gimnasios y centros de entrenamiento que necesitan captar socios, cobrar pases diarios y controlar mensualidades.",
    problem: "Mensualidades en cuadernos y Excel: socios vencidos que nadie cobra a tiempo.",
    tech: ["localStorage", "Framer Motion", "Calculadora IMC", "WhatsApp"],
    preview: <Photo id="1605296867304-46d5465a13f1" alt="Atleta levantando una barra en un gimnasio oscuro" className="h-full w-full bg-zinc-900" sizes="(max-width: 768px) 100vw, 90vw" />,
  },
];

const processSteps = [
  { n: "01", title: "Conocer las necesidades del negocio", text: "Conversamos sobre cómo opera tu empresa hoy, qué procesos te quitan tiempo y qué buscas mejorar." },
  { n: "02", title: "Analizar el problema y proponer una solución", text: "Definimos el alcance, las funciones necesarias y la mejor herramienta para resolverlo con claridad." },
  { n: "03", title: "Diseñar y desarrollar el sistema", text: "Construyo la página web o aplicación cuidando tanto la facilidad de uso como la estabilidad técnica." },
  { n: "04", title: "Realizar pruebas y ajustes", text: "Revisamos juntos cada flujo en computador y celular para afinar detalles antes del lanzamiento." },
  { n: "05", title: "Entregar y acompañar según lo acordado", text: "Ponemos el sistema en marcha y brindamos acompañamiento para su uso y evolución conforme a lo pactado." },
];

const faqs = [
  {
    q: "¿Qué tipo de negocios pueden contratar mis servicios?",
    a: "Trabajo con pequeñas y medianas empresas, emprendimientos y negocios locales (restaurantes, hoteles, comercios, clínicas, gimnasios y empresas de servicios) en el Atlántico, la región Caribe y el resto de Colombia.",
  },
  {
    q: "¿Puedo solicitar una solución personalizada?",
    a: "Sí. Las demostraciones del portafolio muestran ejemplos prácticos, pero cada proyecto se diseña y adapta según los procesos, reglas y objetivos particulares de tu negocio.",
  },
  {
    q: "¿Cómo puedo solicitar una cotización?",
    a: "Puedes escribirme directamente por WhatsApp o mediante el formulario de contacto contando brevemente qué necesitas. Con esa información revisamos el alcance y te presento una propuesta acorde a tu proyecto.",
  },
  {
    q: "¿Puedo solicitar cambios después de la entrega?",
    a: "Sí. Tanto los ajustes de puesta a punto como nuevas funciones o mejoras futuras se pueden planificar y acordar según las necesidades que vayan surgiendo en tu operación.",
  },
  {
    q: "¿Cómo funciona el proceso de desarrollo?",
    a: "Iniciamos entendiendo tu operación actual, definimos una propuesta clara, desarrollamos el sistema por etapas visibles, validamos juntos con pruebas en móvil y computador, y realizamos la entrega según lo acordado.",
  },
];

const THEME_KEY = "landing-theme";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    nombre: "",
    negocio: "",
    servicio: SERVICE_OPTIONS[0] as string,
    mensaje: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else {
        setTheme(mq.matches ? "dark" : "light");
      }
    } catch {
      setTheme(mq.matches ? "dark" : "light");
    }
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(THEME_KEY)) {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch { /* sin storage */ }
  }

  function validateForm() {
    const er: Record<string, string> = {};
    if (form.nombre.trim().length < 2) er.nombre = "Escribe tu nombre.";
    if (form.mensaje.trim().length < 10) er.mensaje = "Describe brevemente tu necesidad (mínimo 10 caracteres).";
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  function buildInquiryText() {
    return [
      `Hola Brayan, soy ${form.nombre.trim()}.`,
      form.negocio.trim() ? `Negocio: ${form.negocio.trim()}` : "",
      `Servicio de interés: ${form.servicio}`,
      `Necesidad: ${form.mensaje.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function sendByWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatusMsg("Abriendo WhatsApp con tu solicitud preparada.");
    window.open(whatsappLink(buildInquiryText()), "_blank", "noopener");
  }

  function sendByMailto() {
    if (!validateForm()) return;
    const subject = `Solicitud de información — ${form.servicio}`;
    const body = `${buildInquiryText()}\n\nEnviado desde el portafolio de ${siteConfig.brandName}.`;
    setStatusMsg("Abriendo tu aplicación de correo. Si usas correo en el navegador y no se abre, puedes copiar el correo aquí abajo.");
    window.location.href = mailtoLink(subject, body);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatusMsg(`Correo de contacto: ${siteConfig.contactEmail}`);
    }
  }

  const nav = [
    ["Servicios", "#servicios"],
    ["Demostraciones", "#demos"],
    ["Proceso", "#proceso"],
    ["Preguntas", "#faq"],
    ["Contacto", "#contacto"],
  ];
  const waGeneral = whatsappLink("Hola Brayan, quiero solicitar información sobre tus servicios para mi negocio.");
  const input =
    "mt-1.5 w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 dark:bg-white/[0.03] dark:border-white/10 dark:text-zinc-100 dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/10 outline-none px-3.5 py-2.5 text-sm transition";
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-[#09090b] text-zinc-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-200/80 bg-white/85 dark:border-white/10 dark:bg-[#09090b]/75 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 h-16">
          <a href="#inicio" className="font-display font-bold tracking-tight text-lg text-slate-900 dark:text-white">
            BRAYAN <span className="text-sky-600 dark:text-cyan-400">SANDOVAL</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-zinc-400">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-slate-950 dark:hover:text-white transition">{l}</a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href={waGeneral} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold px-4 py-2 transition">
              <MessageCircle size={15} /> WhatsApp
            </a>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 flex items-center justify-center transition"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button aria-label="Menú" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#09090b]">
              <div className="px-5 py-4 flex flex-col gap-4 text-slate-800 dark:text-zinc-100">
                {nav.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
                <a href={waGeneral} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-zinc-900 font-semibold px-4 py-2 text-center">Solicitar información</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* A. PROPUESTA DE VALOR / HERO */}
      <section id="inicio" className="relative pt-36 pb-24 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-sky-400/20 dark:bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-40 right-[-10%] h-96 w-96 rounded-full bg-violet-400/15 dark:bg-violet-500/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 px-3 py-1 text-xs mb-6 shadow-xs dark:shadow-none">
              <MapPin size={13} className="text-sky-600 dark:text-cyan-400" /> {siteConfig.brandName} · {siteConfig.location} · Región Caribe
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
              Soluciones digitales prácticas para{" "}
              <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 dark:from-cyan-300 dark:via-cyan-400 dark:to-violet-500 bg-clip-text text-transparent">
                impulsar tu negocio.
              </span>
            </h1>
            <p className="mt-6 text-slate-600 dark:text-zinc-400 text-lg leading-relaxed">
              Soy <strong className="text-slate-900 dark:text-zinc-200 font-semibold">{siteConfig.brandName}</strong>. Desarrollo páginas web, automatizaciones, sistemas de gestión y tableros de datos para ayudar a PyMEs y emprendimientos a ordenar su operación, ahorrar tiempo y atender mejor a sus clientes.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={waGeneral} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 font-semibold px-6 py-3 transition shadow-sm">
                <MessageCircle size={18} /> Solicitar información
              </a>
              <a href="#demos" className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold px-6 py-3 transition shadow-sm">
                Ver demostraciones <ArrowRight size={18} />
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
              ¿Prefieres detallar tu proyecto primero?{" "}
              <a href="#contacto" className="text-sky-700 hover:text-sky-600 dark:text-cyan-300 dark:hover:text-cyan-200 font-medium underline underline-offset-4 transition">
                Enviar solicitud por formulario
              </a>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <HeroAutomationCard />
          </motion.div>
        </div>
      </section>

      {/* B. SERVICIOS */}
      <section id="servicios" className="py-24 border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm font-semibold text-sky-600 dark:text-cyan-400">Cómo puedo ayudarte</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-950 dark:text-white">Servicios orientados a resolver problemas reales</h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-3 max-w-2xl">Herramientas web claras y funcionales para negocios que quieren dejar atrás procesos manuales.</p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(({ icon: Icon, title, text, problem }, i) => (
              <Reveal key={title} delay={i * 0.06} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <GlowCard className="p-6 h-full flex flex-col">
                  <div className="h-10 w-10 rounded-lg border border-sky-200 bg-sky-50 dark:border-white/10 dark:bg-gradient-to-br dark:from-cyan-400/20 dark:to-violet-500/20 flex items-center justify-center mb-5">
                    <Icon size={19} className="text-sky-600 dark:text-cyan-300" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display font-semibold text-lg tracking-tight text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-slate-600 dark:text-zinc-300 text-sm mt-2 leading-relaxed">{text}</p>
                  <p className="text-slate-500 dark:text-zinc-400 text-sm mt-4 pt-4 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                    <span className="text-sky-700 dark:text-cyan-300 font-medium">Qué resuelve: </span>{problem}
                  </p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* C. PROYECTOS Y DEMOSTRACIONES */}
      <section id="demos" className="py-24 border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">Portafolio interactivo</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-950 dark:text-white">Demostraciones por tipo de negocio</h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-3 max-w-2xl">
              Cinco aplicaciones demostrativas con datos ficticios y almacenamiento local en tu navegador, pensadas para que pruebes cómo funcionaría cada solución antes de desarrollarla a la medida de tu empresa.
            </p>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {demos.map(({ slug, sector, name, type, need, problem, tech, preview }, i) => (
              <Reveal key={slug} delay={(i % 2) * 0.08} className={slug === "ironclub" ? "md:col-span-2" : ""}>
                <GlowCard className="flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden border-b border-slate-200 dark:border-white/10">
                    {preview}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 rounded-full bg-black/65 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 border border-white/15">
                      {sector}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-400/30 dark:text-violet-300 text-xs font-medium px-2.5 py-1">
                      <FlaskConical size={12} /> {DEMO_BADGE}
                    </span>
                    <h3 className="font-display text-xl font-semibold tracking-tight mt-4 text-slate-900 dark:text-white">{name}</h3>
                    <p className="text-sm font-medium text-sky-600 dark:text-cyan-300">{type}</p>
                    <p className="text-slate-600 dark:text-zinc-300 text-sm mt-3 leading-relaxed">{need}</p>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                      <strong className="text-slate-800 dark:text-zinc-200 font-medium">Problema que atiende:</strong> {problem}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tech.map((t) => (
                        <span key={t} className="text-xs rounded-md border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 px-2 py-1">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/demos/${slug}`} className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold px-5 py-2.5 text-sm transition group/b">
                        Ver demostración <ArrowRight size={16} className="transition group-hover/b:translate-x-0.5" />
                      </Link>
                      <a href={demoQuoteLink(name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-300 font-semibold px-4 py-2.5 text-sm transition">
                        <MessageCircle size={15} /> ¿Necesitas un sistema similar?
                      </a>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* D. PROCESO DE TRABAJO */}
      <section id="proceso" className="py-24 border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm font-semibold text-sky-600 dark:text-cyan-400">Metodología</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-950 dark:text-white">Cómo trabajo cada proyecto</h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-3 max-w-2xl">Un proceso claro de principio a fin para que sepas qué estamos construyendo en cada etapa.</p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:shadow-none dark:border-white/10 dark:bg-white/[0.02] p-5 h-full flex flex-col">
                  <span className="font-display text-2xl font-extrabold text-sky-600 dark:text-cyan-400">{s.n}</span>
                  <h3 className="font-display font-semibold text-base mt-3 leading-snug text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* E. PREGUNTAS FRECUENTES */}
      <section id="faq" className="py-24 border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 text-center">Dudas comunes</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-center mt-2 text-slate-950 dark:text-white">Preguntas frecuentes</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:shadow-none dark:border-white/10 dark:bg-white/[0.02] overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-slate-900 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className={`shrink-0 text-slate-400 dark:text-zinc-400 transition-transform ${isOpen ? "rotate-180 text-sky-600 dark:text-cyan-400" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* F. FORMULARIO DE CONTACTO Y CIERRE COMERCIAL */}
      <section id="contacto" className="py-24 border-t border-slate-200 dark:border-white/10 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[700px] rounded-full bg-violet-400/15 dark:bg-violet-500/15 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-5">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-center text-slate-950 dark:text-white">
              Conversemos sobre lo que necesita tu negocio
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-center mt-3 max-w-xl mx-auto">
              Cuéntame brevemente qué proceso quieres mejorar o qué aplicación necesitas y revisamos la mejor alternativa por WhatsApp o correo electrónico.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={sendByWhatsApp} noValidate className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm dark:shadow-none dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-sm p-6 sm:p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-nombre" className="text-sm font-medium text-slate-700 dark:text-zinc-300">Nombre *</label>
                  <input id="c-nombre" type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" className={input} />
                  {errors.nombre && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="c-negocio" className="text-sm font-medium text-slate-700 dark:text-zinc-300">Nombre del negocio (opcional)</label>
                  <input id="c-negocio" type="text" value={form.negocio} onChange={(e) => setForm({ ...form, negocio: e.target.value })} placeholder="Ej. Restaurante, clínica, tienda…" className={input} />
                </div>
              </div>

              <div>
                <label htmlFor="c-servicio" className="text-sm font-medium text-slate-700 dark:text-zinc-300">Servicio de interés</label>
                <select id="c-servicio" value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} className={input}>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100">{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="c-mensaje" className="text-sm font-medium text-slate-700 dark:text-zinc-300">Descripción breve de tu necesidad *</label>
                <textarea id="c-mensaje" rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="Cuéntame qué problema quieres resolver o qué sistema te gustaría cotizar…" className={input} />
                {errors.mensaje && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.mensaje}</p>}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 font-semibold px-6 py-3 transition">
                  <MessageCircle size={18} /> Enviar solicitud por WhatsApp
                </button>
                <button type="button" onClick={sendByMailto} className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 text-white font-semibold px-6 py-3 transition">
                  <Mail size={18} /> Enviar por correo
                </button>
                <button type="button" onClick={copyEmail} className="inline-flex items-center gap-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-white/15 dark:hover:bg-white/10 dark:text-zinc-200 text-sm font-medium px-4 py-3 transition">
                  {copied ? <><Check size={15} className="text-emerald-600 dark:text-emerald-400" /> Correo copiado</> : <><Copy size={15} /> Copiar correo</>}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-500 pt-1">
                Este formulario prepara tu mensaje directamente para WhatsApp o abre tu aplicación de correo (<code className="text-slate-700 dark:text-zinc-400">mailto:</code>); no almacena tus datos en ningún servidor.
              </p>

              <AnimatePresence>
                {statusMsg && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
                    <CheckCircle2 size={16} /> {statusMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <a href={waGeneral} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-emerald-400/40 p-5 flex items-center justify-between transition shadow-xs dark:shadow-none">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">WhatsApp directo</p>
                <p className="font-display font-semibold text-lg mt-1 text-slate-900 dark:text-white">{siteConfig.whatsappDisplay}</p>
              </div>
              <span className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center"><MessageCircle size={20} /></span>
            </a>
            <a href={mailtoLink("Solicitud de información", "Hola Brayan,\n\nMe gustaría recibir información sobre tus servicios.")} className="rounded-2xl border border-slate-200 bg-white hover:border-violet-500/50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-violet-400/40 p-5 flex items-center justify-between transition shadow-xs dark:shadow-none">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">Correo electrónico</p>
                <p className="font-display font-semibold text-base sm:text-lg mt-1 text-slate-900 dark:text-white truncate">{siteConfig.contactEmail}</p>
              </div>
              <span className="h-10 w-10 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 flex items-center justify-center shrink-0"><Mail size={20} /></span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-white/10 py-8 text-center text-sm text-slate-500 dark:text-zinc-500 px-5">
        © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.location} · {siteConfig.whatsappDisplay} · {siteConfig.contactEmail}
      </footer>
    </div>
  );
}
