export interface OrderEmailDetails {
  name: string;
  phone: string;
  address: string;
  message: string;
  total: string;
  payment: string;
  notes: string;
}

export const buildOrderEmailPayload = (order: OrderEmailDetails, now = new Date()) => ({
  _subject: "NUEVO PEDIDO — Almas Comilonas",
  _template: "box",
  _captcha: "false",
  Nombre: order.name,
  Teléfono: order.phone,
  Dirección: order.address,
  Pedido: order.message,
  Total: order.total,
  Pago: order.payment,
  Notas: order.notes,
  Hora: now.toLocaleString("es-ES", { timeZone: "Europe/Madrid", hour12: false }),
});

/** Best-effort relay: never hold up WhatsApp longer than three seconds. */
export async function sendOrderCopy(order: OrderEmailDetails): Promise<void> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      fetch("https://formsubmit.co/ajax/atakansahin1996@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildOrderEmailPayload(order)),
        signal: controller.signal,
      }).then(async (response) => {
        if (!response.ok) throw new Error("Order email relay failed");
        const result = await response.json();
        if (result.success !== true && result.success !== "true") {
          throw new Error("Order email relay did not accept the request");
        }
      }),
      new Promise<void>((resolve) => {
        timeout = setTimeout(() => {
          controller.abort();
          resolve();
        }, 3000);
      }),
    ]);
  } catch {
    // Email failures must not prevent the customer's WhatsApp order.
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}