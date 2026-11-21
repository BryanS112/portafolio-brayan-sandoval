import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { DEMO_BADGE } from "@/config/site";

export default function DemoBar({ name }: { name: string }) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-3xl">
      <div className="flex items-center justify-between gap-3 rounded-full border border-slate-700 bg-slate-950/90 backdrop-blur px-3 py-2 text-white shadow-xl">
        <Link href="/#demos" className="flex items-center gap-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-3 py-1.5 transition">
          <ArrowLeft size={16} /> Volver al portafolio
        </Link>
        <span className="hidden sm:inline text-sm font-medium text-slate-300">{name}</span>
        <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-violet-300 font-medium pr-2">
          <FlaskConical size={14} /> <span className="hidden md:inline">{DEMO_BADGE}</span><span className="md:hidden">Demo ficticia</span>
        </span>
      </div>
    </div>
  );
}
