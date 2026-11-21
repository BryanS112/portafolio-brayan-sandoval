import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: `${siteConfig.brandName} — Desarrollo web, automatización e IA`,
  description:
    "Páginas web, automatizaciones y herramientas inteligentes para negocios de la región Caribe colombiana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
