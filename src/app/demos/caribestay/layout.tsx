import type { Metadata } from "next";

const title = "Caribe Stay — Demo de reservas para hotel boutique | Brayan Sandoval";
const description =
  "Demostración interactiva de catálogo de habitaciones y cotizador de estadías por fechas para hoteles y alojamientos (datos ficticios).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CO" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
