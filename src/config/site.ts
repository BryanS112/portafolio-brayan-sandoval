/**
 * Configuración central del sitio y datos oficiales de contacto.
 * Toda la aplicación (landing y demos) lee el número de WhatsApp y correo desde aquí.
 */
export const siteConfig = {
  brandName: "Brayan Sandoval",
  whatsappNumber: "573008796422",
  whatsappDisplay: "+57 300 879 6422",
  contactEmail: "brayansandovalquiroz69@gmail.com",
  location: "Atlántico, Colombia",
} as const;

export const DEMO_BADGE = "Proyecto demostrativo — Datos y negocio ficticios";

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function demoQuoteMessage(solutionName: string): string {
  return `Hola Brayan, acabo de revisar la demostración de ${solutionName} y quiero solicitar información para implementar una solución similar en mi negocio.`;
}

export function demoQuoteLink(solutionName: string): string {
  return whatsappLink(demoQuoteMessage(solutionName));
}

export const cop = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
