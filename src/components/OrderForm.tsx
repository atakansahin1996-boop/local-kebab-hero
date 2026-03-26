import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, MapPin, User, Phone } from "lucide-react";

type MenuItem = { name: string; price: number; category: string };

const MENU: MenuItem[] = [
  // Kebab
  { name: "Kebab Normal", price: 6.0, category: "Kebab" },
  { name: "Kebab Con queso", price: 6.7, category: "Kebab" },
  { name: "Kebab Doble", price: 7.5, category: "Kebab" },
  { name: "Kebab Doble con queso", price: 8.2, category: "Kebab" },
  { name: "Kebab Falafel", price: 6.0, category: "Kebab" },
  { name: "Kebab Vegetal", price: 5.5, category: "Kebab" },
  // Durum
  { name: "Durum Normal", price: 6.5, category: "Durum" },
  { name: "Durum Con queso", price: 7.2, category: "Durum" },
  { name: "Durum Doble", price: 8.0, category: "Durum" },
  { name: "Durum Doble con queso", price: 8.7, category: "Durum" },
  { name: "Durum Falafel", price: 6.5, category: "Durum" },
  { name: "Durum Vegetal", price: 6.0, category: "Durum" },
  // Plato
  { name: "Plato con ensalada", price: 8.0, category: "Plato" },
  { name: "Plato con patatas o arroz", price: 9.0, category: "Plato" },
  { name: "Plato con patatas y arroz", price: 10.0, category: "Plato" },
  { name: "Plato Falafel", price: 8.0, category: "Plato" },
  { name: "Plato Antep", price: 10.0, category: "Plato" },
  // Menú
  { name: "Menú Kebab", price: 9.5, category: "Menú" },
  { name: "Menú Durum", price: 10.0, category: "Menú" },
  { name: "Menú Plato", price: 11.0, category: "Menú" },
  { name: "Menú Infantil", price: 9.0, category: "Menú" },
  { name: "Menú Alitas", price: 9.0, category: "Menú" },
  // Alitas
  { name: "4 alitas", price: 4.5, category: "Alitas" },
  { name: "7 alitas", price: 6.0, category: "Alitas" },
  { name: "12 alitas", price: 10.5, category: "Alitas" },
  { name: "5 alitas y patatas", price: 7.5, category: "Alitas" },
  { name: "15 alitas y patatas", price: 13.0, category: "Alitas" },
  // Raciones
  { name: "Patatas", price: 4.0, category: "Raciones" },
  { name: "Arroz", price: 3.0, category: "Raciones" },
  { name: "Nuggets", price: 5.0, category: "Raciones" },
  { name: "Palitos de queso", price: 6.0, category: "Raciones" },
  { name: "Falafel (ración)", price: 5.0, category: "Raciones" },
  { name: "Box Kebab", price: 6.0, category: "Raciones" },
  // Bebidas
  { name: "Refrescos", price: 2.8, category: "Bebidas" },
  { name: "Agua", price: 1.5, category: "Bebidas" },
];

const CATEGORIES = [...new Set(MENU.map((m) => m.category))];

// ⚠️ CAMBIAR ESTE NÚMERO POR EL REAL
const WHATSAPP_NUMBER = "34697878655";

type CartItem = { item: MenuItem; qty: number };

const OrderForm = () => {
  const [activeCat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"menu" | "datos">("menu");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"domicilio" | "recoger">("domicilio");

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.name === item.name);
      if (existing) return prev.map((c) => (c.item.name === item.name ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (itemName: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item.name === itemName ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const buildWhatsAppMessage = () => {
    const items = cart.map((c) => `• ${c.qty}x ${c.item.name} — ${(c.item.price * c.qty).toFixed(2)}€`).join("\n");
    const lines = [
      "🔥 *NUEVO PEDIDO — KebabExpress*",
      "",
      `👤 *Nombre:* ${name}`,
      `📞 *Teléfono:* ${phone}`,
      method === "domicilio" ? `📍 *Dirección:* ${address}` : "🏪 *Recogida en local*",
      "",
      "🧾 *Pedido:*",
      items,
      "",
      `💰 *Total: ${total.toFixed(2)}€*`,
      notes ? `\n📝 *Notas:* ${notes}` : "",
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleSend = () => {
    if (!name.trim() || !phone.trim()) return;
    if (method === "domicilio" && !address.trim()) return;
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const isFormValid = name.trim() && phone.trim() && (method === "recoger" || address.trim());

  return (
    <section id="pedir" className="py-16 bg-secondary">
      <div className="container max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-8">
          Haz tu pedido
        </h2>

        {step === "menu" ? (
          <>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCat === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product list */}
            <div className="space-y-2 mb-6">
              {MENU.filter((m) => m.category === CATEGORIES[activeCat]).map((item) => {
                const inCart = cart.find((c) => c.item.name === item.name);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between bg-card rounded-lg px-4 py-3 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">{item.name}</p>
                      <p className="text-primary font-bold text-sm">{item.price.toFixed(2)}€</p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.name, -1)}
                          className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-destructive hover:text-accent-foreground transition"
                        >
                          {inCart.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                        </button>
                        <span className="text-foreground text-sm font-bold w-5 text-center">{inCart.qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground transition hover:brightness-110"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition"
                      >
                        Añadir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cart summary bar */}
            {cart.length > 0 && (
              <button
                onClick={() => setStep("datos")}
                className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-lg px-5 py-4 font-bold text-base shadow-[var(--shadow-gold)] hover:brightness-110 transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  {cartCount} producto{cartCount > 1 ? "s" : ""}
                </span>
                <span>{total.toFixed(2)}€ — Continuar</span>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Cart review */}
            <div className="space-y-2 mb-6">
              {cart.map((c) => (
                <div
                  key={c.item.name}
                  className="flex items-center justify-between bg-card rounded-lg px-4 py-3 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium">{c.qty}x {c.item.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold text-sm">{(c.item.price * c.qty).toFixed(2)}€</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(c.item.name, -1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground">
                        {c.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                      </button>
                      <button onClick={() => addToCart(c.item)} className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary text-lg">{total.toFixed(2)}€</span>
              </div>
              {total < 15 && method === "domicilio" && (
                <p className="text-accent text-xs text-center font-medium">
                  ⚠️ Pedido mínimo a domicilio: 15€ (faltan {(15 - total).toFixed(2)}€)
                </p>
              )}
            </div>

            {/* Delivery method */}
            <div className="flex gap-2 mb-4">
              {(["domicilio", "recoger"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    method === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m === "domicilio" ? "🏠 A domicilio" : "🏪 Recoger en local"}
                </button>
              ))}
            </div>

            {/* Customer details */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Teléfono de contacto"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
              {method === "domicilio" && (
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Dirección de entrega"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    maxLength={200}
                    className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              )}
              <textarea
                placeholder="Notas (opcional): sin cebolla, extra picante..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={2}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("menu")}
                className="px-5 py-3 rounded-lg bg-muted text-muted-foreground font-semibold text-sm hover:bg-border transition"
              >
                ← Volver
              </button>
              <button
                onClick={handleSend}
                disabled={!isFormValid || (method === "domicilio" && total < 15)}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-[var(--shadow-gold)] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar pedido por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderForm;
