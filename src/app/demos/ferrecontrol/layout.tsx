import type { Metadata } from "next";

const title = "FerreControl — Demo de dashboard de ventas e inventario | Brayan Sandoval";
const description =
  "Demostración interactiva de tablero de ventas, márgenes y control de stock crítico para ferreterías y comercios (datos ficticios).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CO" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
