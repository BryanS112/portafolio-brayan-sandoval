import { Mail, MessageCircle } from "lucide-react";
import { demoQuoteLink, mailtoLink, siteConfig } from "@/config/site";

interface DemoCtaBannerProps {
  demoName: string;
  headline: string;
  description: string;
  theme?: "light" | "dark";
}

export default function DemoCtaBanner({
  demoName,
  headline,
  description,
  theme = "light",
}: DemoCtaBannerProps) {
  const isDark = theme === "dark";
  const mailHref = mailtoLink(
    `Consulta sobre solución similar a ${demoName}`,
    `Hola Brayan,\n\nAcabo de probar la demostración de ${demoName} y me gustaría recibir información sobre cómo implementar algo similar en mi negocio.\n\nNombre del negocio:\nCiudad:\nNecesidad principal:`,
  );

  return (
    <section
      className={
        isDark
          ? "border-t border-white/10 bg-[#0d0d10] text-zinc-100"
          : "border-t border-slate-200 bg-slate-950 text-slate-100"
      }
    >
      <div className="mx-auto max-w-5xl px-5 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Soluciones para negocios · {siteConfig.brandName}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {headline}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">{description}</p>
          <p className="mt-3 text-xs text-slate-400">
            Nota: esta vista es una demostración interactiva con datos locales simulados. Un proyecto real se adapta a tu negocio con base de datos compartida, usuarios y soporte según lo acordado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <a
            href={demoQuoteLink(demoName)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 text-sm transition"
          >
            <MessageCircle size={17} /> Solicitar información por WhatsApp
          </a>
          <a
            href={mailHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 hover:bg-white/10 text-white font-medium px-6 py-3 text-sm transition"
          >
            <Mail size={17} /> Escribir al correo
          </a>
        </div>
      </div>
    </section>
  );
}
