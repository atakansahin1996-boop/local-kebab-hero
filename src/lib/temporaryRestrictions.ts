export const getMadridDateString = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);

export const isProductTemporarilyHidden = (productName: string, date = new Date()) => {
  const day = getMadridDateString(date);
  const hidden = (day >= "2026-11-10" && day < "2026-11-12") || day === "2026-11-18";
  return hidden && productName.toLowerCase().includes("alitas");
};

const EXTRA_CLOSED_DATES = new Set([
  "2026-09-23",
  "2026-10-06",
  "2026-10-17",
  "2026-10-21",
  "2026-11-10",
]);

export type TemporaryClosure = { closed: boolean; title: string; detail: string };

export const getTemporaryClosure = (date = new Date()): TemporaryClosure => {
  const day = getMadridDateString(date);
  if (day < "2026-08-25") {
    return {
      closed: true,
      title: "VOLVEMOS EL 25 DE AGOSTO",
      detail: "Estamos cerrados por vacaciones. No se pueden realizar pedidos hasta el 25 de agosto de 2026.",
    };
  }
  if (EXTRA_CLOSED_DATES.has(day)) {
    return {
      closed: true,
      title: "HOY ESTAMOS CERRADOS",
      detail: "Hoy se nos ha agotado el género. No se pueden realizar pedidos; volvemos mañana en el horario habitual.",
    };
  }
  return { closed: false, title: "", detail: "" };
};