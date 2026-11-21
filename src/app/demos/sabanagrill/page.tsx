"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, X, MessageCircle, Flame, Eye, CheckCircle2 } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import { cop, whatsappLink, DEMO_BADGE } from "@/config/site";

type Item = { id: number; name: string; desc: string; price: number; cat: string; emoji: string };
const CATS = ["Todos", "Entradas", "Carnes y Asados", "Hamburguesas", "Bebidas"];
const MENU: Item[] = [
  { id: 1, name: "Patacones con hogao", desc: "Plátano verde crocante con hogao criollo.", price: 14000, cat: "Entradas", emoji: "🍌" },
  { id: 2, name: "Empanadas de carne (x3)", desc: "Fritas al momento con ají de la casa.", price: 12000, cat: "Entradas", emoji: "🥟" },
  { id: 3, name: "Chicharrón crocante", desc: "Con yuca frita y limón.", price: 18000, cat: "Entradas", emoji: "🥓" },
  { id: 4, name: "Churrasco 300 g", desc: "Con papa criolla, ensalada y chimichurri.", price: 48000, cat: "Carnes y Asados", emoji: "🥩" },
  { id: 5, name: "Picada para dos", desc: "Res, cerdo, chorizo, yuca y papa.", price: 62000, cat: "Carnes y Asados", emoji: "🍖" },
  { id: 6, name: "Costillas BBQ", desc: "Cocción lenta con salsa ahumada.", price: 52000, cat: "Carnes y Asados", emoji: "🍖" },
  { id: 7, name: "Hamburguesa Sabana", desc: "Carne 180 g, queso, tocineta y salsa de la casa.", price: 32000, cat: "Hamburguesas", emoji: "🍔" },
  { id: 8, name: "Hamburguesa Criolla", desc: "Con hogao, queso costeño y plátano maduro.", price: 29000, cat: "Hamburguesas", emoji: "🍔" },
  { id: 9, name: "Hamburguesa Pollo Crispy", desc: "Pechuga apanada y coleslaw.", price: 27000, cat: "Hamburguesas", emoji: "🍔" },
  { id: 10, name: "Limonada de coco", desc: "Cremosa y bien fría.", price: 11000, cat: "Bebidas", emoji: "🥥" },
  { id: 11, name: "Jugo de maracuyá", desc: "Natural, en agua o leche.", price: 8000, cat: "Bebidas", emoji: "🍹" },
  { id: 12, name: "Cerveza nacional", desc: "Botella 330 ml.", price: 7000, cat: "Bebidas", emoji: "🍺" },
];
const DELIVERY = 5000;

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
    setTimeout(() => setToast(""), 1500);
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
      "🔥 *Nuevo pedido — SabanaGrill (DEMO)*",
      "",
      `👤 Nombre: ${f.nombre}`,
      `📍 Dirección/Barrio: ${f.dir}`,
      `💳 Pago: ${f.pago}`,
      f.obs ? `📝 Observaciones: ${f.obs}` : "",
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

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <DemoBar name="SabanaGrill" />
      <header className="pt-24 pb-10 bg-gradient-to-b from-red-700 to-orange-600 text-amber-50 text-center px-5">
        <Flame className="mx-auto mb-2" size={40} />
        <h1 className="text-4xl sm:text-5xl font-extrabold">SabanaGrill</h1>
        <p className="mt-2 text-amber-100">Parrilla costeña · Pide en minutos y recibe en casa</p>
        <p className="mt-4 inline-block rounded-full bg-black/30 px-4 py-1 text-xs font-medium">{DEMO_BADGE}</p>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${cat === c ? "bg-red-700 text-white border-red-700" : "bg-white border-amber-300 hover:bg-amber-100"}`}>{c}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white border border-amber-200 shadow-sm overflow-hidden flex flex-col">
              <div className="h-28 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-6xl">{m.emoji}</div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-red-700 font-semibold">{m.cat}</p>
                <h3 className="font-bold text-lg">{m.name}</h3>
                <p className="text-sm text-stone-600 flex-1">{m.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-extrabold text-lg">{cop(m.price)}</span>
                  <button onClick={() => add(m)} className="flex items-center gap-1 rounded-full bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2"><Plus size={16} /> Agregar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-stone-900 text-white px-5 py-3 shadow-xl hover:bg-stone-800">
        <ShoppingCart size={20} /> Carrito
        <span className="rounded-full bg-orange-500 text-xs font-bold px-2 py-0.5">{count}</span>
      </button>
      {toast && <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-lg bg-green-700 text-white text-sm px-4 py-2 shadow-lg"><CheckCircle2 size={16} /> {toast}</div>}

      {open && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-full max-w-md bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold">Tu pedido</h2>
              <button aria-label="Cerrar" onClick={() => setOpen(false)}><X /></button>
            </div>
            {!count ? <p className="text-stone-500 py-10 text-center">Tu carrito está vacío. Agrega algo delicioso 🍔</p> : (
              <>
                <ul className="divide-y">
                  {lines.map((l) => (
                    <li key={l.id} className="py-3 flex items-center gap-3">
                      <span className="text-2xl">{l.emoji}</span>
                      <div className="flex-1"><p className="font-semibold text-sm">{l.name}</p><p className="text-xs text-stone-500">{cop(l.price)} c/u</p></div>
                      <div className="flex items-center gap-2">
                        <button aria-label="Restar" onClick={() => change(l.id, -1)} className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center"><Minus size={14} /></button>
                        <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                        <button aria-label="Sumar" onClick={() => change(l.id, 1)} className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center"><Plus size={14} /></button>
                        <button aria-label="Eliminar" onClick={() => change(l.id, -l.qty)} className="text-red-600 ml-1"><Trash2 size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm space-y-1 border-t pt-3">
                  <div className="flex justify-between"><span>Subtotal</span><span>{cop(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Domicilio</span><span>{cop(DELIVERY)}</span></div>
                  <div className="flex justify-between font-extrabold text-lg"><span>Total</span><span>{cop(total)}</span></div>
                </div>

                <div className="mt-5 space-y-3">
                  <input placeholder="Nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <input placeholder="Dirección / Barrio" value={f.dir} onChange={(e) => setF({ ...f, dir: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  <select value={f.pago} onChange={(e) => setF({ ...f, pago: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                    {["Efectivo", "Nequi", "Transferencia", "Datáfono al recibir"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <textarea placeholder="Observaciones (sin cebolla, timbre dañado…)" rows={2} value={f.obs} onChange={(e) => setF({ ...f, obs: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  {err && <p className="text-red-600 text-sm">{err}</p>}
                  <button onClick={() => validate() && setPreview(true)} className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-red-700 text-red-700 font-semibold py-2 hover:bg-red-50"><Eye size={18} /> Ver mensaje del pedido</button>
                  {preview && <pre className="whitespace-pre-wrap text-xs bg-green-50 border border-green-200 rounded-lg p-3">{message()}</pre>}
                  <button
                    onClick={() => { if (validate()) { setPreview(true); window.open(whatsappLink(message()), "_blank", "noopener"); } }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold py-3"
                  ><MessageCircle size={18} /> Enviar pedido por WhatsApp</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
