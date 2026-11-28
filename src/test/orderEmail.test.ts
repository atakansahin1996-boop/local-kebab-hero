import { afterEach, describe, expect, it, vi } from "vitest";
import { buildOrderEmailPayload, sendOrderCopy } from "@/lib/orderEmail";

const order = {
  name: "Cliente de prueba",
  phone: "600000000",
  address: "Recogida en local",
  message: "1x Menú Kebab (Mixto) + Queso x2 🥤 Agua — 10.90€\nSin: Cebolla\nTotal: 10.90€",
  total: "10.90€",
  payment: "Tarjeta en domicilio (datáfono)",
  notes: "Pedido de prueba",
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("order email copy", () => {
  it("posts all order details and the unchanged WhatsApp message to the requested relay", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: "true" })));
    vi.stubGlobal("fetch", fetchMock);
    await sendOrderCopy(order);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formsubmit.co/ajax/atakansahin1996@gmail.com",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      _subject: "NUEVO PEDIDO — Almas Comilonas", _template: "box", _captcha: "false",
      Nombre: order.name, Teléfono: order.phone, Dirección: "Recogida en local",
      Pedido: order.message, Total: "10.90€", Pago: order.payment, Notas: order.notes,
    });
  });

  it("uses Madrid time in winter and summer", () => {
    expect(buildOrderEmailPayload(order, new Date("2026-11-28T13:04:00Z")).Hora).toBe("28/11/2026, 14:04:00");
    expect(buildOrderEmailPayload(order, new Date("2026-07-28T13:04:00Z")).Hora).toBe("28/7/2026, 15:04:00");
  });

  it("waits for the copy before allowing the WhatsApp continuation", async () => {
    let resolveFetch: (response: Response) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolve) => { resolveFetch = resolve; })));
    const continueToWhatsApp = vi.fn();
    const pending = sendOrderCopy(order).then(continueToWhatsApp);
    expect(continueToWhatsApp).not.toHaveBeenCalled();
    resolveFetch(new Response(JSON.stringify({ success: true })));
    await pending;
    expect(continueToWhatsApp).toHaveBeenCalledOnce();
  });

  it.each([
    () => Promise.reject(new Error("Network unavailable")),
    () => Promise.resolve(new Response("Unavailable", { status: 500 })),
    () => Promise.resolve(new Response(JSON.stringify({ success: "false" }))),
  ])("continues when email delivery fails", async (failure) => {
    vi.stubGlobal("fetch", vi.fn(failure));
    await expect(sendOrderCopy(order)).resolves.toBeUndefined();
  });

  it("stops waiting and aborts at exactly 3000ms even if fetch never settles", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const continueToWhatsApp = vi.fn();
    const pending = sendOrderCopy(order).then(continueToWhatsApp);
    await vi.advanceTimersByTimeAsync(2999);
    expect(continueToWhatsApp).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(continueToWhatsApp).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].signal?.aborted).toBe(true);
  });
});