import type { Metadata } from "next";

const title = "IronClub Gym — Demo de gestión de gimnasio y acceso | Brayan Sandoval";
const description =
  "Demostración interactiva para gimnasios: planes, calculadora IMC, pases diarios, simulador biométrico y control de mensualidades (datos ficticios).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CO" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
