"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, Percent, Package, AlertTriangle, Search, LayoutDashboard, Hammer } from "lucide-react";
import DemoBar from "@/components/DemoBar";
import { cop, DEMO_BADGE } from "@/config/site";

const PERIODS = [
  { id: "7", label: "Últimos 7 días", days: 7 },
  { id: "30", label: "Este mes", days: 30 },
  { id: "90", label: "Trimestre", days: 90 },
] as const;
const CATS = ["Todas", "Herramientas", "Construcción", "Pinturas", "Eléctrico", "Plomería"];

type P = { sku: string; name: string; cat: string; price: number; cost: number; stock: number; min: number; base: number };
const PRODUCTS: P[] = [
  { sku: "HR-001", name: "Taladro percutor 650W", cat: "Herramientas", price: 235000, cost: 160000, stock: 14, min: 5, base: 1 },
  { sku: "HR-002", name: "Martillo carpintero", cat: "Herramientas", price: 28000, cost: 17000, stock: 3, min: 10, base: 3 },
  { sku: "HR-003", name: "Juego destornilladores x6", cat: "Herramientas", price: 42000, cost: 26000, stock: 22, min: 8, base: 2 },
  { sku: "CO-001", name: "Cemento gris 50 kg", cat: "Construcción", price: 31000, cost: 26500, stock: 120, min: 60, base: 9 },
  { sku: "CO-002", name: "Varilla corrugada 3/8", cat: "Construcción", price: 24500, cost: 20000, stock: 18, min: 40, base: 6 },
  { sku: "CO-003", name: "Arena de río (m³)", cat: "Construcción", price: 95000, cost: 70000, stock: 9, min: 4, base: 1 },
  { sku: "PI-001", name: "Pintura vinilo blanco galón", cat: "Pinturas", price: 78000, cost: 52000, stock: 35, min: 12, base: 3 },
  { sku: "PI-002", name: "Esmalte sintético rojo", cat: "Pinturas", price: 64000, cost: 43000, stock: 4, min: 8, base: 2 },
  { sku: "PI-003", name: "Rodillo felpa 9\"", cat: "Pinturas", price: 15000, cost: 8000, stock: 40, min: 15, base: 3 },
  { sku: "EL-001", name: "Cable THHN #12 (rollo)", cat: "Eléctrico", price: 185000, cost: 140000, stock: 7, min: 6, base: 1 },
  { sku: "EL-002", name: "Breaker 20A", cat: "Eléctrico", price: 18000, cost: 10500, stock: 2, min: 12, base: 4 },
  { sku: "EL-003", name: "Bombillo LED 12W", cat: "Eléctrico", price: 7500, cost: 4000, stock: 150, min: 50, base: 10 },
  { sku: "PL-001", name: "Tubo PVC 1/2\" x 6 m", cat: "Plomería", price: 19000, cost: 13000, stock: 55, min: 20, base: 5 },
  { sku: "PL-002", name: "Llave de lavamanos", cat: "Plomería", price: 52000, cost: 33000, stock: 11, min: 6, base: 2 },
  { sku: "PL-003", name: "Tanque 500 L", cat: "Plomería", price: 340000, cost: 255000, stock: 1, min: 3, base: 1 },
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
      const date = new Date(); date.setDate(date.getDate() - d);
      series.push({ dia: date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }), ventas: daySales });
    }
    // Agrupar en semanas si el periodo es largo, para legibilidad
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
  }, [days, filtered]);

  const low = filtered.filter(({ p }) => p.stock <= p.min);
  const rows = filtered
    .filter(({ p }) => (!onlyLow || p.stock <= p.min) && (p.name + p.sku).toLowerCase().includes(q.toLowerCase()))
    .map(({ p }) => p);

  const cards = [
    { icon: DollarSign, label: `Ventas (${PERIODS.find((p) => p.id === period)!.label.toLowerCase()})`, value: cop(kpi.sales), color: "text-cyan-400" },
    { icon: Percent, label: "Margen estimado", value: `${kpi.margin.toFixed(1)} %`, color: "text-emerald-400" },
    { icon: Package, label: "Total productos", value: String(filtered.length), color: "text-violet-400" },
    { icon: AlertTriangle, label: "Alertas de stock bajo", value: String(low.length), color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <DemoBar name="FerreControl" />
      <div className="pt-20 mx-auto max-w-6xl px-4 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center"><Hammer /></div>
            <div><h1 className="text-2xl font-extrabold flex items-center gap-2"><LayoutDashboard size={20} /> FerreControl</h1><p className="text-xs text-slate-500">Ferretería El Constructor (ficticia)</p></div>
          </div>
          <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1">{DEMO_BADGE}</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center rounded-xl bg-white border border-slate-200 p-3 mb-5">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {PERIODS.map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)} className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${period === p.id ? "bg-slate-900 text-white" : "hover:bg-white"}`}>{p.label}</button>
            ))}
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
            {CATS.map((c) => <option key={c}>{c === "Todas" ? "Todas las categorías" : c}</option>)}
          </select>
          {cat !== "Todas" && <button onClick={() => setCat("Todas")} className="text-sm text-cyan-700 underline">Limpiar categoría</button>}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl bg-slate-900 text-white p-4">
              <Icon className={color} size={20} />
              <p className="text-xs text-slate-400 mt-2">{label}</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 mt-5">
          <h2 className="font-bold mb-3">Ventas en el tiempo {cat !== "Todas" && <span className="text-slate-500 font-normal">· {cat}</span>}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} minTickGap={20} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} width={55} />
                <Tooltip formatter={(v) => [cop(Number(v)), "Ventas"]} />
                <Area type="monotone" dataKey="ventas" stroke="#0891b2" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="font-bold">Inventario</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 text-sm"><Search size={16} className="text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o SKU" className="outline-none" />
              </label>
              <button onClick={() => setOnlyLow(!onlyLow)} className={`text-sm rounded-lg px-3 py-1.5 border transition ${onlyLow ? "bg-red-600 border-red-600 text-white" : "border-slate-300 hover:bg-slate-50"}`}>Solo stock crítico</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-500 border-b"><th className="py-2">SKU</th><th>Producto</th><th>Categoría</th><th className="text-right">Precio</th><th className="text-right">Vendidas</th><th className="text-right">Stock</th><th className="text-center">Estado</th></tr></thead>
              <tbody>
                {rows.map((p) => {
                  const crit = p.stock <= p.min;
                  return (
                    <tr key={p.sku} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-2 text-slate-500">{p.sku}</td><td className="font-medium">{p.name}</td><td>{p.cat}</td>
                      <td className="text-right">{cop(p.price)}</td><td className="text-right">{ranking[p.sku] ?? 0}</td>
                      <td className="text-right">{p.stock} <span className="text-slate-400">/ mín {p.min}</span></td>
                      <td className="text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${crit ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{crit ? "Stock crítico" : "Normal"}</span></td>
                    </tr>
                  );
                })}
                {!rows.length && <tr><td colSpan={7} className="py-8 text-center text-slate-500">Sin resultados para tu búsqueda.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
