import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: `${siteConfig.brandName} — Desarrollo web, automatización e IA`,
  description:
    "Páginas web, automatizaciones y herramientas inteligentes para negocios de la región Caribe colombiana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} ${space.variable} ${playfair.variable} ${cormorant.variable} antialiased`}>{children}</body>
    </html>
  );
}
