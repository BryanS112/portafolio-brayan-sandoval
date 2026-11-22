"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, Percent, Package, AlertTriangle, Search, LayoutDashboard, Hammer, Plus, MessageCircle } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import DemoCtaBanner from "@/components/DemoCtaBanner";
import { cop, DEMO_BADGE, whatsappLink } from "@/config/site";
import { addDays, formatBogotaDate, localIsoDate } from "@/lib/date";

const PERIODS = [
  { id: "7", label: "Últimos 7 días", days: 7 },
  { id: "30", label: "Este mes", days: 30 },
  { id: "90", label: "Trimestre", days: 90 },
] as const;
const CATS = ["Todas", "Herramientas", "Construcción", "Pinturas", "Eléctrico", "Plomería"];

type P = { sku: string; name: string; cat: string; price: number; cost: number; baseStock: number; min: number; base: number };
const PRODUCTS: P[] = [
  { sku: "HR-001", name: "Taladro percutor 650W", cat: "Herramientas", price: 235000, cost: 160000, baseStock: 45, min: 5, base: 1 },
  { sku: "HR-002", name: "Martillo carpintero", cat: "Herramientas", price: 28000, cost: 17000, baseStock: 92, min: 10, base: 3 },
  { sku: "HR-003", name: "Juego destornilladores x6", cat: "Herramientas", price: 42000, cost: 26000, baseStock: 82, min: 8, base: 2 },
  { sku: "CO-001", name: "Cemento gris 50 kg", cat: "Construcción", price: 31000, cost: 26500, baseStock: 390, min: 60, base: 9 },
  { sku: "CO-002", name: "Varilla corrugada 3/8", cat: "Construcción", price: 24500, cost: 20000, baseStock: 198, min: 40, base: 6 },
  { sku: "CO-003", name: "Arena de río (m³)", cat: "Construcción", price: 95000, cost: 70000, baseStock: 39, min: 4, base: 1 },
  { sku: "PI-001", name: "Pintura vinilo blanco galón", cat: "Pinturas", price: 78000, cost: 52000, baseStock: 125, min: 12, base: 3 },
  { sku: "PI-002", name: "Esmalte sintético rojo", cat: "Pinturas", price: 64000, cost: 43000, baseStock: 64, min: 8, base: 2 },
  { sku: "PI-003", name: "Rodillo felpa 9\"", cat: "Pinturas", price: 15000, cost: 8000, baseStock: 130, min: 15, base: 3 },
  { sku: "EL-001", name: "Cable THHN #12 (rollo)", cat: "Eléctrico", price: 185000, cost: 140000, baseStock: 37, min: 6, base: 1 },
  { sku: "EL-002", name: "Breaker 20A", cat: "Eléctrico", price: 18000, cost: 10500, baseStock: 122, min: 12, base: 4 },
  { sku: "EL-003", name: "Bombillo LED 12W", cat: "Eléctrico", price: 7500, cost: 4000, baseStock: 450, min: 50, base: 10 },
  { sku: "PL-001", name: "Tubo PVC 1/2\" x 6 m", cat: "Plomería", price: 19000, cost: 13000, baseStock: 205, min: 20, base: 5 },
  { sku: "PL-002", name: "Llave de lavamanos", cat: "Plomería", price: 52000, cost: 33000, baseStock: 71, min: 6, base: 2 },
  { sku: "PL-003", name: "Tanque 500 L", cat: "Plomería", price: 340000, cost: 255000, baseStock: 31, min: 3, base: 1 },
];

// Ventas diarias determinísticas (ficticias): unidades por producto y día
function units(pi: number, day: number, base: number) {
  const v = Math.abs(Math.sin((pi + 1) * 12.9898 + (day + 1) * 78.233)) * 43758.5453;
  const r = v - Math.floor(v);
  const weekend = day % 7 === 5 || day % 7 === 6 ? 1.3 : 1;
  return Math.max(0, Math.round(base * (0.4 + r * 1.4) * weekend));
}

export default function FerreControl() {
  const [period, setPeriod] = useState<string>("30");
  const [cat, setCat] = useState("Todas");
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [anchorDate, setAnchorDate] = useState("");
  const [restock, setRestock] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAnchorDate(localIsoDate());
  }, []);

  const days = PERIODS.find((p) => p.id === period)!.days;
  const filtered = useMemo(() => PRODUCTS.map((p, i) => ({ p, i })).filter(({ p }) => cat === "Todas" || p.cat === cat), [cat]);

  const { kpi, series, ranking } = useMemo(() => {
    let sales = 0, profit = 0;
    const series: { dia: string; ventas: number }[] = [];
    const per: Record<string, number> = {};
    for (let d = days - 1; d >= 0; d--) {
      let daySales = 0;
      for (const { p, i } of filtered) {
        const u = units(i, d, p.base);
        daySales += u * p.price;
        profit += u * (p.price - p.cost);
        per[p.sku] = (per[p.sku] || 0) + u;
      }
      sales += daySales;
      const label = anchorDate
        ? formatBogotaDate(addDays(anchorDate, -d), { day: "2-digit", month: "short" })
        : `Día ${days - d}`;
      series.push({ dia: label, ventas: daySales });
    }
    const group = days > 30 ? 3 : 1;
    const grouped = group === 1 ? series : Array.from({ length: Math.ceil(series.length / group) }, (_, k) => {
      const chunk = series.slice(k * group, k * group + group);
      return { dia: chunk[0].dia, ventas: chunk.reduce((s, c) => s + c.ventas, 0) };
    });
    return {
      kpi: { sales, margin: sales ? (profit / sales) * 100 : 0 },
      series: grouped,
      ranking: per,
    };
  }, [days, filtered, anchorDate]);

  const stockOf = (p: P) => Math.max(0, p.baseStock + (restock[p.sku] || 0) - (ranking[p.sku] ?? 0));
  const low = filtered.filter(({ p }) => stockOf(p) <= p.min);
  const rows = filtered
    .filter(({ p }) => (!onlyLow || stockOf(p) <= p.min) && (p.name + p.sku).toLowerCase().includes(q.toLowerCase()))
    .map(({ p }) => p);

  function handleRestock(p: P) {
    const qty = Math.max(p.min * 2, 10);
    setRestock((prev) => ({ ...prev, [p.sku]: (prev[p.sku] || 0) + qty }));
    setNotice(`Reposición simulada: +${qty} uds de ${p.name}`);
    setTimeout(() => setNotice(""), 2400);
  }

  function requestRestockWa(p: P, currentStock: number) {
    const suggested = Math.max(p.min * 2 - currentStock, p.min);
    const msg = `Hola, solicitud de reposición desde FerreControl (DEMO):\n\nSKU: ${p.sku}\nProducto: ${p.name}\nStock actual simulado: ${currentStock} (mínimo ${p.min})\nCantidad sugerida: ${suggested} unidades`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  }

  const catSales = useMemo(() => {
    const out: Record<string, number> = {};
    PRODUCTS.forEach((p, i) => {
      let s = 0;
      for (let d = 0; d < days; d++) s += units(i, d, p.base) * p.price;
      out[p.cat] = (out[p.cat] || 0) + s;
    });
    return Object.entries(out).sort((a, b) => b[1] - a[1]);
  }, [days]);
  const maxCat = Math.max(...catSales.map(([, v]) => v), 1);

  const cards = [
    { icon: DollarSign, label: "Ventas del período", value: cop(kpi.sales), tint: "bg-sky-50 text-sky-600" },
    { icon: Percent, label: "Margen estimado", value: `${kpi.margin.toFixed(1)} %`, tint: "bg-emerald-50 text-emerald-600" },
    { icon: Package, label: "Total productos", value: String(filtered.length), tint: "bg-violet-50 text-violet-600" },
    { icon: AlertTriangle, label: "Alertas de stock bajo", value: String(low.length), tint: "bg-red-50 text-red-600" },
  ];

  const card = "rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.04)]";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <DemoBar name="FerreControl" />
      <div className="pt-20 mx-auto max-w-6xl px-4 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm"><Hammer size={20} strokeWidth={1.8} /></div>
            <div><h1 className="text-xl font-bold tracking-tight flex items-center gap-2"><LayoutDashboard size={18} className="text-slate-400" /> FerreControl</h1><p className="text-xs text-slate-500">Ferretería El Constructor (ficticia) · Panel de ventas e inventario</p></div>
          </div>
          <span className="rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium px-3 py-1">{DEMO_BADGE}</span>
        </motion.div>

        <div className={`${card} flex flex-wrap gap-3 items-center p-3 mb-5`}>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {PERIODS.map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)} className={`relative px-3 py-1.5 text-sm rounded-md font-medium transition ${period === p.id ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>
                {period === p.id && <motion.span layoutId="perpill" className="absolute inset-0 rounded-md bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{p.label}</span>
              </button>
            ))}
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10">
            {CATS.map((c) => <option key={c} value={c}>{c === "Todas" ? "Todas las categorías" : c}</option>)}
          </select>
          {cat !== "Todas" && <button onClick={() => setCat("Todas")} className="text-sm text-indigo-600 hover:underline">Limpiar categoría</button>}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, label, value, tint }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -2 }} className={`${card} p-4`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${tint}`}><Icon size={16} /></span>
              </div>
              <motion.p key={value} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl font-bold tracking-tight mt-3 tabular-nums">{value}</motion.p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className={`${card} p-5 lg:col-span-2`}>
            <h2 className="font-semibold text-sm">Ventas en el tiempo {cat !== "Todas" && <span className="text-slate-400 font-normal">· {cat}</span>}</h2>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={52} />
                  <Tooltip
                    cursor={{ stroke: "#6366f1", strokeDasharray: "4 4" }}
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="text-sm font-bold flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> {cop(Number(payload[0].value))}</p>
                        </div>
                      ) : null
                    }
                  />
                  <Area type="monotone" dataKey="ventas" stroke="#6366f1" strokeWidth={2} fill="url(#g)" activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={`${card} p-5`}>
            <h2 className="font-semibold text-sm">Ventas por categoría</h2>
            <ul className="mt-4 space-y-3.5">
              {catSales.map(([c, v]) => (
                <li key={c} className={`cursor-pointer ${cat !== "Todas" && cat !== c ? "opacity-40" : ""} transition`} onClick={() => setCat(cat === c ? "Todas" : c)}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium">{c}</span><span className="text-slate-500 tabular-nums">{cop(v)}</span></div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><motion.div className="h-full rounded-full bg-indigo-500" initial={false} animate={{ width: `${(v / maxCat) * 100}%` }} transition={{ duration: 0.5 }} /></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${card} p-5 mt-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-sm">Inventario simulado (descuenta ventas del período)</h2>
              <p className="text-xs text-slate-400">Datos ficticios de demostración · Puedes simular reposiciones en ítems críticos.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"><Search size={15} className="text-slate-400" />
                <input aria-label="Buscar producto o SKU" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o SKU" className="outline-none bg-transparent" />
              </label>
              <button onClick={() => setOnlyLow(!onlyLow)} className={`text-sm rounded-lg px-3 py-1.5 border transition ${onlyLow ? "bg-red-600 border-red-600 text-white" : "border-slate-200 hover:bg-slate-50"}`}>Solo stock crítico</button>
            </div>
          </div>
          {notice && <p className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-2">{notice}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100"><th className="py-2 font-medium">SKU</th><th className="font-medium">Producto</th><th className="font-medium">Categoría</th><th className="text-right font-medium">Precio</th><th className="text-right font-medium">Vendidas</th><th className="text-right font-medium">Stock</th><th className="text-center font-medium">Estado</th><th className="text-right font-medium">Acción</th></tr></thead>
              <tbody>
                {rows.map((p) => {
                  const currentStock = stockOf(p);
                  const crit = currentStock <= p.min;
                  return (
                    <tr key={p.sku} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition">
                      <td className="py-3 text-slate-400 tabular-nums">{p.sku}</td><td className="font-medium">{p.name}</td><td className="text-slate-600">{p.cat}</td>
                      <td className="text-right tabular-nums">{cop(p.price)}</td><td className="text-right tabular-nums">{ranking[p.sku] ?? 0}</td>
                      <td className="text-right tabular-nums">{currentStock} <span className="text-slate-400">/ mín {p.min}</span></td>
                      <td className="text-center"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${crit ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"}`}><span className={`h-1.5 w-1.5 rounded-full ${crit ? "bg-red-500" : "bg-emerald-500"}`} />{crit ? "Stock crítico" : "Normal"}</span></td>
                      <td className="text-right py-2">
                        {crit ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button onClick={() => handleRestock(p)} className="inline-flex items-center gap-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-2.5 py-1.5 transition"><Plus size={12} /> Reponer</button>
                            <button onClick={() => requestRestockWa(p, currentStock)} title="Enviar solicitud por WhatsApp" className="inline-flex items-center gap-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-medium px-2 py-1.5 transition"><MessageCircle size={12} /> Pedir</button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!rows.length && <tr><td colSpan={8} className="py-10 text-center text-slate-500">Sin resultados para tu búsqueda.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DemoCtaBanner
        demoName="FerreControl"
        headline="¿Necesitas controlar inventario, ventas y alertas de stock?"
        description="Diseño tableros y sistemas de control de negocio para ferreterías, distribuidoras y comercios que hoy llevan todo en hojas sueltas."
      />
    </div>
  );
}
