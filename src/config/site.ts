/**
 * Configuración central del sitio.
 * Edita aquí el número de WhatsApp, correo y ubicación: toda la app los lee de este archivo.
 */
export const siteConfig = {
  brandName: "Brayan Sandoval",
  whatsappDemoNumber: "573000000000", // Formato internacional sin "+" ni espacios
  contactEmail: "contacto@ejemplo.com",
  location: "Atlántico, Colombia",
} as const;

export const DEMO_BADGE = "Proyecto demostrativo — Datos y negocio ficticios";

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappDemoNumber}?text=${encodeURIComponent(message)}`;
}

export const cop = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
