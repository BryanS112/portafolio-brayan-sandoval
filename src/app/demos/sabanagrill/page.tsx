"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, X, Send, Eye, Check, Flame, Beef, Sandwich, GlassWater, Salad, ArrowDown } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import Photo from "@/components/Photo";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

type Item = { id: number; name: string; desc: string; price: number; cat: string; img?: string };
const CATS = ["Todos", "Entradas", "Carnes y Asados", "Hamburguesas", "Bebidas"];
const CAT_ICON: Record<string, typeof Beef> = { Entradas: Salad, "Carnes y Asados": Beef, Hamburguesas: Sandwich, Bebidas: GlassWater };

const MENU: Item[] = [
  { id: 1, name: "Patacones con hogao", desc: "Plátano verde crocante con hogao criollo.", price: 14000, cat: "Entradas", img: "1511690743698-d9d85f2fbf38" },
  { id: 2, name: "Empanadas de carne (x3)", desc: "Fritas al momento con ají de la casa.", price: 12000, cat: "Entradas" },
  { id: 3, name: "Chicharrón crocante", desc: "Con yuca frita y limón.", price: 18000, cat: "Entradas" },
  { id: 4, name: "Churrasco 300 g", desc: "Con papa criolla, ensalada y chimichurri.", price: 48000, cat: "Carnes y Asados", img: "1529692236671-f1f6cf9683ba" },
  { id: 5, name: "Picada para dos", desc: "Res, cerdo, chorizo, yuca y papa.", price: 62000, cat: "Carnes y Asados", img: "1558030006-450675393462" },
  { id: 6, name: "Costillas BBQ", desc: "Cocción lenta con salsa ahumada.", price: 52000, cat: "Carnes y Asados", img: "1544025162-d76694265947" },
  { id: 7, name: "Hamburguesa Sabana", desc: "Carne 180 g, queso, tocineta y salsa de la casa.", price: 32000, cat: "Hamburguesas", img: "1568901346375-23c9450c58cd" },
  { id: 8, name: "Hamburguesa Criolla", desc: "Con hogao, queso costeño y plátano maduro.", price: 29000, cat: "Hamburguesas", img: "1550547660-d9450f859349" },
  { id: 9, name: "Hamburguesa Pollo Crispy", desc: "Pechuga apanada y coleslaw.", price: 27000, cat: "Hamburguesas" },
  { id: 10, name: "Limonada de coco", desc: "Cremosa y bien fría.", price: 11000, cat: "Bebidas" },
  { id: 11, name: "Jugo de maracuyá", desc: "Natural, en agua o leche.", price: 8000, cat: "Bebidas" },
  { id: 12, name: "Cerveza nacional", desc: "Botella 330 ml.", price: 7000, cat: "Bebidas" },
];
const DELIVERY = 5000;
const EMBER = "#C2410C";

export default function SabanaGrill() {
  const [cat, setCat] = useState("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [f, setF] = useState({ nombre: "", dir: "", pago: "Efectivo", obs: "" });
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(false);

  const items = MENU.filter((m) => cat === "Todos" || m.cat === cat);
  const lines = useMemo(() => MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })), [cart]);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = subtotal + (count ? DELIVERY : 0);

  function add(m: Item) {
    setCart((c) => ({ ...c, [m.id]: (c[m.id] || 0) + 1 }));
    setToast(`${m.name} agregado al carrito`);
    setTimeout(() => setToast(""), 1600);
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
        <Photo id="1558030006-450675393462" alt="Cortes de carne asada sobre tabla de madera" className="absolute inset-0 bg-[#141210] opacity-40" w={1600} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/80 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 pt-36 pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="flex items-center gap-2 text-[#D9A441] text-xs tracking-[0.3em] uppercase"><Flame size={14} /> Parrilla costeña · Desde 2012</p>
            <h1 className="font-serif-grill text-5xl sm:text-7xl mt-5 leading-[1.02] tracking-tight">Sabana<span className="italic text-[#D9A441]">Grill</span></h1>
            <p className="mt-5 max-w-md text-stone-300 leading-relaxed">Fuego de leña, cortes seleccionados y recetas de la región. Arma tu pedido y recíbelo en casa.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#carta" className="inline-flex items-center gap-2 bg-[#D9A441] hover:bg-[#e6b556] text-[#141210] font-semibold px-6 py-3 transition">Ver la carta <ArrowDown size={16} /></a>
              <span className="text-xs border border-white/20 px-3 py-1.5 text-stone-300">{DEMO_BADGE}</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main id="carta" className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500">Nuestra carta</p>
          <h2 className="font-serif-grill text-4xl mt-2 tracking-tight">Del fuego a tu mesa</h2>
        </div>

        <LayoutGroup>
          <div className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-2 border-y border-stone-300 py-3">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`relative px-4 py-2 text-sm font-medium transition ${cat === c ? "text-white" : "text-stone-600 hover:text-stone-900"}`}>
                {cat === c && <motion.span layoutId="catpill" className="absolute inset-0 -z-0" style={{ background: EMBER }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid md:grid-cols-2 gap-x-14 gap-y-9">
            <AnimatePresence mode="popLayout">
              {items.map((m) => {
                const Icon = CAT_ICON[m.cat] ?? Beef;
                return (
                  <motion.article layout key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className="flex gap-4 group">
                    {m.img ? (
                      <Photo id={m.img} alt={m.name} w={300} sizes="96px" className="h-24 w-24 shrink-0 rounded-sm bg-stone-200" />
                    ) : (
                      <div className="h-24 w-24 shrink-0 rounded-sm bg-[#141210] flex items-center justify-center"><Icon size={30} strokeWidth={1.2} className="text-[#D9A441]" /></div>
                    )}
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
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </main>

      <motion.button
        whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#141210] text-[#FAF8F5] px-5 py-3.5 shadow-2xl hover:bg-stone-800 transition"
      >
        <ShoppingBag size={19} strokeWidth={1.6} /> <span className="font-medium text-sm">Mi pedido</span>
        <motion.span key={count} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="bg-[#D9A441] text-[#141210] text-xs font-bold px-2 py-0.5">{count}</motion.span>
      </motion.button>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-24 right-5 z-50 flex items-center gap-2 bg-emerald-700 text-white text-sm px-4 py-2.5 shadow-lg">
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 36 }} className="relative w-full max-w-md bg-[#FAF8F5] h-full overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif-grill text-3xl">Tu pedido</h2>
                <button aria-label="Cerrar" onClick={() => setOpen(false)} className="p-1 hover:bg-stone-200 rounded"><X /></button>
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
                              <button aria-label="Restar" onClick={() => change(l.id, -1)} className="h-7 w-7 border border-stone-300 hover:bg-stone-200 flex items-center justify-center"><Minus size={13} /></button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                              <button aria-label="Sumar" onClick={() => change(l.id, 1)} className="h-7 w-7 border border-stone-300 hover:bg-stone-200 flex items-center justify-center"><Plus size={13} /></button>
                              <button aria-label="Eliminar" onClick={() => change(l.id, -l.qty)} className="text-red-700 ml-1.5 hover:scale-110 transition"><Trash2 size={16} /></button>
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
                    <input placeholder="Nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} className={field} />
                    <input placeholder="Dirección / Barrio" value={f.dir} onChange={(e) => setF({ ...f, dir: e.target.value })} className={field} />
                    <select value={f.pago} onChange={(e) => setF({ ...f, pago: e.target.value })} className={field}>
                      {["Efectivo", "Nequi", "Transferencia", "Datáfono al recibir"].map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <textarea placeholder="Observaciones (sin cebolla, timbre dañado…)" rows={2} value={f.obs} onChange={(e) => setF({ ...f, obs: e.target.value })} className={field} />
                    {err && <p className="text-red-700 text-sm">{err}</p>}
                    <button onClick={() => validate() && setPreview(true)} className="w-full flex items-center justify-center gap-2 border border-stone-900 font-semibold py-2.5 hover:bg-stone-900 hover:text-white transition"><Eye size={17} /> Ver mensaje del pedido</button>
                    <AnimatePresence>
                      {preview && <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="whitespace-pre-wrap text-xs bg-white border border-stone-300 p-3 overflow-hidden">{message()}</motion.pre>}
                    </AnimatePresence>
                    <button
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
    </div>
  );
}
