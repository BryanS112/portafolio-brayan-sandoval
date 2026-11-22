import type { Metadata } from "next";

const title = "SabanaGrill — Demo de pedidos por WhatsApp | Brayan Sandoval";
const description =
  "Demostración interactiva de menú digital y carrito conectado a WhatsApp para restaurantes y comidas rápidas (datos ficticios).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CO" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
