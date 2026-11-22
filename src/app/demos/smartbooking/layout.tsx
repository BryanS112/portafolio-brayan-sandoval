import type { Metadata } from "next";

const title = "SmartBooking — Demo de agendamiento de citas | Brayan Sandoval";
const description =
  "Demostración interactiva de reserva de citas paso a paso y panel administrativo para clínicas y servicios (datos ficticios).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CO" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
