"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, X, Send, Eye, Check, Flame, ArrowDown } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import DemoCtaBanner from "@/components/DemoCtaBanner";
import Photo from "@/components/Photo";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

type Item = { id: number; name: string; desc: string; price: number; cat: string; img: string };
const CATS = ["Todos", "Entradas", "Carnes y Asados", "Hamburguesas", "Bebidas"];

const MENU: Item[] = [
  { id: 1, name: "Patacones con hogao", desc: "Plátano verde crocante con hogao criollo.", price: 14000, cat: "Entradas", img: "1511690743698-d9d85f2fbf38" },
  { id: 2, name: "Empanadas de carne (x3)", desc: "Fritas al momento con ají de la casa.", price: 12000, cat: "Entradas", img: "1601050690597-df0568f70950" },
  { id: 3, name: "Chicharrón crocante", desc: "Con yuca frita y limón.", price: 18000, cat: "Entradas", img: "1529692236671-f1f6cf9683ba" },
  { id: 4, name: "Churrasco 300 g", desc: "Con papa criolla, ensalada y chimichurri.", price: 48000, cat: "Carnes y Asados", img: "1529692236671-f1f6cf9683ba" },
  { id: 5, name: "Picada para dos", desc: "Res, cerdo, chorizo, yuca y papa.", price: 62000, cat: "Carnes y Asados", img: "1558030006-450675393462" },
  { id: 6, name: "Costillas BBQ", desc: "Cocción lenta con salsa ahumada.", price: 52000, cat: "Carnes y Asados", img: "1544025162-d76694265947" },
  { id: 7, name: "Hamburguesa Sabana", desc: "Carne 180 g, queso, tocineta y salsa de la casa.", price: 32000, cat: "Hamburguesas", img: "1568901346375-23c9450c58cd" },
  { id: 8, name: "Hamburguesa Criolla", desc: "Con hogao, queso costeño y plátano maduro.", price: 29000, cat: "Hamburguesas", img: "1550547660-d9450f859349" },
  { id: 9, name: "Hamburguesa Pollo Crispy", desc: "Pechuga apanada y coleslaw.", price: 27000, cat: "Hamburguesas", img: "1626082927389-6cd097cdc6ec" },
  { id: 10, name: "Limonada de coco", desc: "Cremosa y bien fría.", price: 11000, cat: "Bebidas", img: "1513558161293-cdaf765ed2fd" },
  { id: 11, name: "Jugo de maracuyá", desc: "Natural, en agua o leche.", price: 8000, cat: "Bebidas", img: "1600271886742-f049cd451bba" },
  { id: 12, name: "Cerveza nacional", desc: "Botella 330 ml.", price: 7000, cat: "Bebidas", img: "1535958636474-b021ee887b13" },
];
const DELIVERY = 5000;
const EMBER = "#C2410C";
const CART_KEY = "sabanagrill-demo-cart";
const VALID_IDS = new Set(MENU.map((m) => m.id));

export default function SabanaGrill() {
  const [cat, setCat] = useState("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [f, setF] = useState({ nombre: "", dir: "", pago: "Efectivo", obs: "" });
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const clean: Record<number, number> = {};
          for (const [k, v] of Object.entries(parsed)) {
            const id = Number(k);
            const qty = Number(v);
            if (VALID_IDS.has(id) && Number.isInteger(qty) && qty > 0 && qty <= 99) {
              clean[id] = qty;
            }
          }
          setCart(clean);
        }
      }
    } catch { /* fallback a carrito vacío */ }
    setReady(true);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = MENU.filter((m) => cat === "Todos" || m.cat === cat);
  const lines = useMemo(() => MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })), [cart]);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = subtotal + (count ? DELIVERY : 0);

  function add(m: Item) {
    setCart((c) => ({ ...c, [m.id]: (c[m.id] || 0) + 1 }));
    setToast(`${m.name} agregado al carrito`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  }
  function change(id: number, d: number) {
    setCart((c) => {
      const q = (c[id] || 0) + d;
      const n = { ...c };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });
  }
  const message = () =>
    [
      "*Nuevo pedido — SabanaGrill (DEMO)*",
      "",
      `Nombre: ${f.nombre}`,
      `Dirección/Barrio: ${f.dir}`,
      `Pago: ${f.pago}`,
      f.obs ? `Observaciones: ${f.obs}` : "",
      "",
      "*Pedido:*",
      ...lines.map((l) => `• ${l.qty} x ${l.name} — ${cop(l.qty * l.price)}`),
      "",
      `Subtotal: ${cop(subtotal)}`,
      `Domicilio: ${cop(DELIVERY)}`,
      `*Total: ${cop(total)}*`,
    ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");

  function validate() {
    if (!count) return setErr("Agrega al menos un producto."), false;
    if (f.nombre.trim().length < 2) return setErr("Escribe tu nombre."), false;
    if (f.dir.trim().length < 4) return setErr("Escribe tu dirección y barrio."), false;
    setErr("");
    return true;
  }
  const field = "w-full border border-stone-300 bg-white rounded-md px-3 py-2.5 text-sm outline-none focus:border-stone-900 transition";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      <DemoBar name="SabanaGrill" />

      <header className="relative bg-[#141210] text-[#FAF8F5] overflow-hidden">
        <Photo id="1558030006-450675393462" alt="Cortes de carne asada sobre tabla de madera" className="absolute inset-0 bg-[#141210] opacity-45" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/80 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-12 sm:pt-36 sm:pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="flex items-center gap-2 text-[#D9A441] text-xs tracking-[0.3em] uppercase"><Flame size={14} /> Parrilla costeña · Desde 2012</p>
            <h1 className="font-serif-grill text-5xl sm:text-7xl mt-4 sm:mt-5 leading-[1.02] tracking-tight">Sabana<span className="italic text-[#D9A441]">Grill</span></h1>
            <p className="mt-4 sm:mt-5 max-w-md text-stone-300 leading-relaxed">Fuego de leña, cortes seleccionados y recetas de la región. Arma tu pedido y recíbelo en casa.</p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
              <a href="#carta" className="inline-flex items-center gap-2 bg-[#D9A441] hover:bg-[#e6b556] text-[#141210] font-semibold px-6 py-3 transition">Ver la carta <ArrowDown size={16} /></a>
              <span className="text-xs border border-white/20 px-3 py-1.5 text-stone-300">{DEMO_BADGE}</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main id="carta" className="mx-auto max-w-5xl px-6 pt-12 pb-24 sm:py-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500">Nuestra carta</p>
          <h2 className="font-serif-grill text-4xl mt-2 tracking-tight">Del fuego a tu mesa</h2>
        </div>

        <LayoutGroup>
          <div className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-2 border-y border-stone-300 py-3">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`relative px-3.5 sm:px-4 py-2 text-sm font-medium transition ${cat === c ? "text-white" : "text-stone-600 hover:text-stone-900"}`}>
                {cat === c && <motion.span layoutId="catpill" className="absolute inset-0 -z-0" style={{ background: EMBER }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid md:grid-cols-2 gap-x-14 gap-y-9">
            <AnimatePresence mode="popLayout">
              {items.map((m) => (
                <motion.article layout key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className="flex gap-4 group">
                  <Photo id={m.img} alt={m.name} sizes="96px" className="h-24 w-24 shrink-0 rounded-sm bg-stone-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif-grill text-xl leading-tight">{m.name}</h3>
                      <span className="flex-1 border-b border-dotted border-stone-400 translate-y-[-4px]" />
                      <span className="font-semibold tabular-nums">{cop(m.price)}</span>
                    </div>
                    <p className="text-sm text-stone-600 mt-1">{m.desc}</p>
                    <button onClick={() => add(m)} className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline underline-offset-4 active:scale-95 transition" style={{ color: EMBER }}>
                      <Plus size={15} /> Agregar al pedido
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </main>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        aria-label={`Abrir carrito (${count} productos)`}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[#141210] text-[#FAF8F5] px-4 py-3 shadow-2xl hover:bg-stone-800 transition"
      >
        <ShoppingBag size={18} strokeWidth={1.6} /> <span className="font-medium text-sm">Mi pedido</span>
        <motion.span key={count} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="rounded-full bg-[#D9A441] text-[#141210] text-xs font-bold px-2 py-0.5">{count}</motion.span>
      </motion.button>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-700 text-white text-sm px-4 py-2.5 shadow-lg">
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div role="dialog" aria-modal="true" aria-labelledby="sg-cart-title" className="fixed inset-0 z-[110] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 36 }} className="relative w-full max-w-md bg-[#FAF8F5] h-full overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 id="sg-cart-title" className="font-serif-grill text-3xl">Tu pedido</h2>
                <button type="button" aria-label="Cerrar carrito" onClick={() => setOpen(false)} className="p-1.5 hover:bg-stone-200 rounded"><X /></button>
              </div>
              {!count ? <p className="text-stone-500 py-12 text-center">Tu pedido está vacío. Elige algo de la carta.</p> : (
                <>
                  <ul className="divide-y divide-stone-300">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.li key={l.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="py-3.5 flex items-center gap-3">
                            <div className="flex-1"><p className="font-serif-grill text-lg leading-tight">{l.name}</p><p className="text-xs text-stone-500">{cop(l.price)} c/u</p></div>
                            <div className="flex items-center gap-1.5">
                              <button type="button" aria-label={`Restar ${l.name}`} onClick={() => change(l.id, -1)} className="h-7 w-7 border border-stone-300 hover:bg-stone-200 flex items-center justify-center"><Minus size={13} /></button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                              <button type="button" aria-label={`Sumar ${l.name}`} onClick={() => change(l.id, 1)} className="h-7 w-7 border border-stone-300 hover:bg-stone-200 flex items-center justify-center"><Plus size={13} /></button>
                              <button type="button" aria-label={`Eliminar ${l.name}`} onClick={() => change(l.id, -l.qty)} className="text-red-700 ml-1.5 hover:scale-110 transition"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="mt-4 text-sm space-y-1.5 border-t border-stone-900 pt-4">
                    <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{cop(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Domicilio</span><span className="tabular-nums">{cop(DELIVERY)}</span></div>
                    <div className="flex justify-between font-serif-grill text-2xl pt-1"><span>Total</span><span className="tabular-nums">{cop(total)}</span></div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <input aria-label="Nombre" placeholder="Nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} className={field} />
                    <input aria-label="Dirección o barrio" placeholder="Dirección / Barrio" value={f.dir} onChange={(e) => setF({ ...f, dir: e.target.value })} className={field} />
                    <select aria-label="Método de pago" value={f.pago} onChange={(e) => setF({ ...f, pago: e.target.value })} className={field}>
                      {["Efectivo", "Nequi", "Transferencia", "Datáfono al recibir"].map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <textarea aria-label="Observaciones" placeholder="Observaciones (sin cebolla, timbre dañado…)" rows={2} value={f.obs} onChange={(e) => setF({ ...f, obs: e.target.value })} className={field} />
                    {err && <p className="text-red-700 text-sm">{err}</p>}
                    <button type="button" onClick={() => validate() && setPreview(true)} className="w-full flex items-center justify-center gap-2 border border-stone-900 font-semibold py-2.5 hover:bg-stone-900 hover:text-white transition"><Eye size={17} /> Ver mensaje del pedido</button>
                    <AnimatePresence>
                      {preview && <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="whitespace-pre-wrap text-xs bg-white border border-stone-300 p-3 overflow-hidden">{message()}</motion.pre>}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => { if (validate()) { setPreview(true); window.open(whatsappLink(message()), "_blank", "noopener"); } }}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 transition"
                    ><Send size={17} /> Enviar pedido por WhatsApp</button>
                  </div>
                </>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      <DemoCtaBanner
        demoName="SabanaGrill"
        headline="¿Tienes un restaurante y quieres recibir pedidos sin comisiones?"
        description="Implemento menús digitales, carritos conectados a WhatsApp y herramientas de gestión a la medida para restaurantes, comidas rápidas y cafeterías."
      />
    </div>
  );
}
