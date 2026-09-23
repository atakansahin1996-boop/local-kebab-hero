import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, MapPin, User, Phone, ChevronDown, ChevronUp, Save, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductAvailability, isProductAvailable } from "@/hooks/useProductAvailability";

type MenuItem = { name: string; price: number; category: string };

const MENU: MenuItem[] = [
  { name: "Kebab Normal", price: 6.0, category: "Kebab" },
  { name: "Kebab Con queso", price: 6.7, category: "Kebab" },
  { name: "Kebab Doble", price: 7.5, category: "Kebab" },
  { name: "Kebab Doble con queso", price: 8.2, category: "Kebab" },
  { name: "Kebab Falafel", price: 6.0, category: "Kebab" },
  { name: "Kebab Vegetal", price: 5.5, category: "Kebab" },
  { name: "Durum Normal", price: 6.5, category: "Durum" },
  { name: "Durum Con queso", price: 7.2, category: "Durum" },
  { name: "Durum Doble", price: 8.0, category: "Durum" },
  { name: "Durum Doble con queso", price: 8.7, category: "Durum" },
  { name: "Durum Falafel", price: 6.5, category: "Durum" },
  { name: "Durum Vegetal", price: 6.0, category: "Durum" },
  { name: "Plato con ensalada", price: 8.0, category: "Plato" },
  { name: "Plato con patatas o arroz", price: 9.0, category: "Plato" },
  { name: "Plato con patatas y arroz", price: 10.0, category: "Plato" },
  { name: "Plato Falafel", price: 8.0, category: "Plato" },
  { name: "Plato Antep", price: 10.0, category: "Plato" },
  { name: "Menú Kebab", price: 9.5, category: "Menú" },
  { name: "Menú Durum", price: 10.0, category: "Menú" },
  { name: "Menú Plato", price: 11.0, category: "Menú" },
  { name: "Menú Infantil", price: 9.0, category: "Menú" },
  { name: "Menú Alitas", price: 9.0, category: "Menú" },
  { name: "4 alitas", price: 4.5, category: "Alitas" },
  { name: "7 alitas", price: 6.0, category: "Alitas" },
  { name: "12 alitas", price: 10.5, category: "Alitas" },
  { name: "5 alitas y patatas", price: 7.5, category: "Alitas" },
  { name: "15 alitas y patatas", price: 13.0, category: "Alitas" },
  { name: "Patatas", price: 4.0, category: "Raciones" },
  { name: "Arroz", price: 3.0, category: "Raciones" },
  { name: "Nuggets", price: 5.0, category: "Raciones" },
  { name: "Palitos de queso", price: 6.0, category: "Raciones" },
  { name: "Falafel (ración)", price: 5.0, category: "Raciones" },
  { name: "Refrescos", price: 2.8, category: "Bebidas" },
  { name: "Agua", price: 1.5, category: "Bebidas" },
];

const CATEGORIES = [...new Set(MENU.map((m) => m.category))];
const WHATSAPP_NUMBER = "34697878655";

// Restaurant epicenter coordinates (Av. Doctor García Tapia 159, Madrid)
const RESTAURANT_LAT = 40.4074228;
const RESTAURANT_LNG = -3.6293111;
const MAX_DELIVERY_RADIUS_KM = 3;

/** Haversine distance in km between two lat/lng points */
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

type AddressStatus = "idle" | "checking" | "ok" | "too_far" | "not_found";

const INGREDIENTS = ["Lechuga", "Cebolla", "Tomate", "Salsa blanca", "Salsa roja"];
const CATEGORIES_WITH_INGREDIENTS = ["Kebab", "Durum", "Plato", "Menú"];
const MEAT_TYPES = ["Ternera", "Pollo", "Mixto"] as const;
type MeatType = typeof MEAT_TYPES[number];

const SIDE_TYPES = ["Patatas", "Arroz"] as const;
type SideType = typeof SIDE_TYPES[number];

const ITEMS_WITH_SIDE_CHOICE = ["Plato con patatas o arroz", "Menú Plato", "Plato Falafel", "Plato Antep"];
const hasSideChoice = (item: MenuItem) => ITEMS_WITH_SIDE_CHOICE.includes(item.name);

const EXTRAS = [
  { name: "Queso", price: 0.70 },
  { name: "Extra de carne", price: 1.50 },
] as const;

const DRINKS = [
  "Coca Cola", "Coca Cola Zero", "Coca Cola Zero Zero",
  "Fanta Naranja", "Fanta Limón",
  "Aquarius Naranja", "Aquarius Limón",
  "Trina Naranja", "Trina Limón",
  "Sprite", "Nestea Limón", "Nestea Maracuyá", "Nestea Frutos Rojos",
  "Cerveza", "Agua", "Tónica",
] as const;

const BILL_OPTIONS = [5, 10, 20, 50, 100];
const CART_STORAGE_KEY = "almas-comilonas-cart";

type CartItem = {
  id: string;
  item: MenuItem;
  removedIngredients: string[];
  meatType: MeatType;
  sideType?: SideType;
  extras: string[];
  drink: string;
};

const ORDER_SECTION_ID = "pedido-online";

// Order schedule (Madrid timezone). Closed on Mondays.
// Open: Tuesday-Sunday, 13:00-16:00 and 19:30-23:00
const SCHEDULE_TEXT = "Mar–Dom · 13:00–16:00 y 19:30–23:00";

type OrderScheduleStatus = {
  open: boolean;
  reason: "open" | "monday" | "before_lunch" | "between" | "after_dinner";
  nextOpenLabel?: string;
};

const getMadridParts = (date = new Date()) => {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = weekdayMap[get("weekday")] ?? 0;
  const hour = parseInt(get("hour"), 10);
  const minute = parseInt(get("minute"), 10);
  return { weekday, minutes: hour * 60 + minute };
};

const LUNCH_START = 13 * 60;
const LUNCH_END = 16 * 60;
const DINNER_START = 19 * 60 + 30;
const DINNER_END = 23 * 60;

const getMadridDateString = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);

// Specific closed days (e.g. ran out of stock). Add dates as "YYYY-MM-DD" (Madrid).
const EXTRA_CLOSED_DATES = new Set(["2026-09-23"]);

type TemporaryClosure = { closed: boolean; title: string; detail: string };

const getTemporaryClosure = (date = new Date()): TemporaryClosure => {
  const d = getMadridDateString(date);
  if (d < "2026-08-25") {
    return {
      closed: true,
      title: "VOLVEMOS EL 25 DE AGOSTO",
      detail:
        "Estamos cerrados por vacaciones. No se pueden realizar pedidos hasta el 25 de agosto de 2026.",
    };
  }
  if (EXTRA_CLOSED_DATES.has(d)) {
    return {
      closed: true,
      title: "HOY ESTAMOS CERRADOS",
      detail:
        "Hoy se nos ha agotado el género. No se pueden realizar pedidos; volvemos mañana en el horario habitual.",
    };
  }
  return { closed: false, title: "", detail: "" };
};

const getOrderScheduleStatus = (): OrderScheduleStatus => {
  const { weekday, minutes } = getMadridParts();
  if (weekday === 1) {
    return { open: false, reason: "monday", nextOpenLabel: "mañana martes a las 13:00" };
  }
  if (minutes < LUNCH_START) {
    return { open: false, reason: "before_lunch", nextOpenLabel: "hoy a las 13:00" };
  }
  if (minutes >= LUNCH_START && minutes < LUNCH_END) {
    return { open: true, reason: "open" };
  }
  if (minutes >= LUNCH_END && minutes < DINNER_START) {
    return { open: false, reason: "between", nextOpenLabel: "hoy a las 19:30" };
  }
  if (minutes >= DINNER_START && minutes < DINNER_END) {
    return { open: true, reason: "open" };
  }
  // After dinner
  const nextLabel = weekday === 0 ? "el martes a las 13:00" : "mañana a las 13:00";
  return { open: false, reason: "after_dinner", nextOpenLabel: nextLabel };
};

const createCartItemId = () =>
  `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const hasMeatOption = (item: MenuItem) =>
  CATEGORIES_WITH_INGREDIENTS.includes(item.category) &&
  !item.name.toLowerCase().includes("falafel") &&
  !item.name.toLowerCase().includes("vegetal");

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
};

const OrderForm = () => {
  const { data: availability } = useProductAvailability();
  const [activeCat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);
  const [step, setStep] = useState<"menu" | "datos" | "carrito">("menu");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"domicilio" | "recoger">("domicilio");
  const [payment, setPayment] = useState<"efectivo" | "tarjeta">("efectivo");
  const [billAmount, setBillAmount] = useState<number | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [addressStatus, setAddressStatus] = useState<AddressStatus>("idle");
  const [addressDistance, setAddressDistance] = useState<number | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState<OrderScheduleStatus>(() => getOrderScheduleStatus());
  const [closure, setClosure] = useState<TemporaryClosure>(() => getTemporaryClosure());
  const isClosed = closure.closed;

  // Refresh schedule status every 30 seconds
  useEffect(() => {
    const tick = () => {
      setScheduleStatus(getOrderScheduleStatus());
      setIsClosed(isTemporaryClosure());
    };
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Debounced address geocoding & distance check
  useEffect(() => {
    if (method !== "domicilio" || !address.trim() || address.trim().length < 5) {
      setAddressStatus("idle");
      setAddressDistance(null);
      return;
    }

    setAddressStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${address.trim()}, Madrid, Spain`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=es`
        );
        const data = await res.json();
        if (!data || data.length === 0) {
          setAddressStatus("not_found");
          setAddressDistance(null);
          return;
        }
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const dist = haversineDistance(RESTAURANT_LAT, RESTAURANT_LNG, lat, lon);
        setAddressDistance(Math.round(dist * 10) / 10);
        setAddressStatus(dist <= MAX_DELIVERY_RADIUS_KM ? "ok" : "too_far");
      } catch {
        setAddressStatus("not_found");
        setAddressDistance(null);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [address, method]);

  // Auto-save cart to localStorage on change
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const hasIngredients = (item: MenuItem) =>
    CATEGORIES_WITH_INGREDIENTS.includes(item.category);

  const getItemTotal = (c: CartItem) => {
    const extrasTotal = c.extras.reduce((sum, extraName) => {
      const extra = EXTRAS.find((e) => e.name === extraName);
      return sum + (extra?.price ?? 0);
    }, 0);
    return c.item.price + extrasTotal;
  };

  const isMenu = (item: MenuItem) => item.category === "Menú";

  const addToCart = (item: MenuItem, goToCart = false) => {
    const newCartItem: CartItem = {
      id: createCartItemId(),
      item,
      removedIngredients: [],
      meatType: "Ternera",
      sideType: hasSideChoice(item) ? "Patatas" : undefined,
      extras: [],
      drink: isMenu(item) ? "Coca Cola" : "",
    };

    setCart((prev) => [...prev, newCartItem]);

    if (goToCart) {
      setStep("carrito");
      setExpandedItemId(newCartItem.id);
    }
  };

  const removeOneByName = (itemName: string) => {
    setCart((prev) => {
      let indexToRemove = -1;
      for (let i = prev.length - 1; i >= 0; i -= 1) {
        if (prev[i].item.name === itemName) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove === -1) return prev;
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const removeById = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
    setExpandedItemId((prev) => (prev === itemId ? null : prev));
  };

  const toggleIngredient = (itemId: string, ingredient: string) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.id !== itemId) return c;
        const removed = c.removedIngredients.includes(ingredient)
          ? c.removedIngredients.filter((i) => i !== ingredient)
          : [...c.removedIngredients, ingredient];
        return { ...c, removedIngredients: removed };
      })
    );
  };

  const setMeatType = (itemId: string, meatType: MeatType) => {
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, meatType } : c))
    );
  };

  const setSideType = (itemId: string, sideType: SideType) => {
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, sideType } : c))
    );
  };

  const toggleExtra = (itemId: string, extraName: string) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.id !== itemId) return c;
        const extras = c.extras.includes(extraName)
          ? c.extras.filter((e) => e !== extraName)
          : [...c.extras, extraName];
        return { ...c, extras };
      })
    );
  };

  const countByProductName = (itemName: string) =>
    cart.filter((c) => c.item.name === itemName).length;

  const total = cart.reduce((sum, c) => sum + getItemTotal(c), 0);
  const cartCount = cart.length;

  const handleSaveCart = () => {
    saveCartToStorage(cart);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const groupedForMessage = useMemo(() => {
    const grouped = new Map<
      string,
      { qty: number; item: MenuItem; removedIngredients: string[]; meatType: MeatType; sideType?: SideType; extras: string[]; drink: string; unitPrice: number }
    >();

    cart.forEach((cartItem) => {
      const ingredientsKey = [...cartItem.removedIngredients].sort().join("|");
      const extrasKey = [...cartItem.extras].sort().join("|");
      const key = `${cartItem.item.name}|${cartItem.meatType}|${cartItem.sideType ?? ""}|${ingredientsKey}|${extrasKey}|${cartItem.drink}`;
      const existing = grouped.get(key);

      if (existing) {
        grouped.set(key, { ...existing, qty: existing.qty + 1 });
      } else {
        grouped.set(key, {
          qty: 1,
          item: cartItem.item,
          removedIngredients: cartItem.removedIngredients,
          meatType: cartItem.meatType,
          sideType: cartItem.sideType,
          extras: cartItem.extras,
          drink: cartItem.drink,
          unitPrice: getItemTotal(cartItem),
        });
      }
    });

    return Array.from(grouped.values());
  }, [cart]);

  const buildWhatsAppMessage = () => {
    const items = groupedForMessage
      .map((c) => {
        let line = `• ${c.qty}x ${c.item.name}`;
        if (hasMeatOption(c.item)) line += ` (${c.meatType})`;
        if (hasSideChoice(c.item) && c.sideType) line += ` 🍟 ${c.sideType}`;
        if (c.extras.length > 0) line += ` + ${c.extras.join(", ")}`;
        if (c.drink) line += ` 🥤 ${c.drink}`;
        line += ` — ${(c.unitPrice * c.qty).toFixed(2)}€`;
        if (c.removedIngredients.length > 0) {
          line += `\n   ❌ Sin: ${c.removedIngredients.join(", ")}`;
        }
        return line;
      })
      .join("\n");

    const paymentLine =
      payment === "tarjeta"
        ? `💳 *Pago:* Tarjeta en domicilio (datáfono)`
        : `💵 *Pago:* Efectivo${billAmount ? ` (billete de ${billAmount}€)` : ""}`;

    const lines = [
      "🔥 *NUEVO PEDIDO — Almas Comilonas*",
      "",
      `👤 *Nombre:* ${name}`,
      `📞 *Teléfono:* ${phone}`,
      method === "domicilio"
        ? `📍 *Dirección:* ${address}`
        : "🏪 *Recogida en local*",
      "",
      "🧾 *Pedido:*",
      items,
      "",
      `💰 *Total: ${total.toFixed(2)}€*`,
      paymentLine,
      notes ? `\n📝 *Notas:* ${notes}` : "",
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleSend = () => {
    if (isClosed || !scheduleStatus.open) return;
    if (cart.length === 0 || !name.trim() || !phone.trim()) return;
    if (method === "domicilio" && !address.trim()) return;
    if (payment === "efectivo" && (!billAmount || (billAmount > 0 && billAmount < total))) return;
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    // Clear cart after sending
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const isFormValid =
    !isClosed &&
    cart.length > 0 &&
    name.trim() &&
    phone.trim() &&
    scheduleStatus.open &&
    (method === "recoger" || (address.trim() && addressStatus === "ok")) &&
    (payment === "tarjeta" || (billAmount && (billAmount === -1 || billAmount >= total)));

  const ProductCard = ({ item }: { item: MenuItem }) => {
    const count = countByProductName(item.name);
    const available = isProductAvailable(availability, item.name);

    if (!available) {
      return (
        <div className="bg-card rounded-lg border border-border overflow-hidden opacity-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-sm font-medium truncate line-through">
                {item.name}
              </p>
              <p className="text-muted-foreground text-sm">
                No disponible
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">
              {item.name}
            </p>
            <p className="text-primary font-bold text-sm">
              {item.price.toFixed(2)}€
            </p>
          </div>
          {count > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeOneByName(item.name)}
                className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-destructive hover:text-accent-foreground transition"
              >
                {count === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
              </button>
              <span className="text-foreground text-sm font-bold w-5 text-center">
                {count}
              </span>
              <button
                onClick={() => addToCart(item, true)}
                className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground transition hover:brightness-110"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, true)}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition"
            >
              Añadir
            </button>
          )}
        </div>
      </div>
    );
  };

  const CartItemCard = ({ c, index }: { c: CartItem; index: number }) => {
    const duplicateIndex = cart
      .slice(0, index + 1)
      .filter((unit) => unit.item.name === c.item.name).length;
    const hasDuplicates = countByProductName(c.item.name) > 1;
    const isExpanded = expandedItemId === c.id;
    const canCustomize = hasIngredients(c.item);
    const canSelectMeat = hasMeatOption(c.item);
    const canSelectSide = hasSideChoice(c.item);
    const itemTotal = getItemTotal(c);

    return (
      <div className="bg-card rounded-lg px-4 py-3 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium">
              {c.item.name}{hasDuplicates ? ` #${duplicateIndex}` : ""}
            </p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {canSelectMeat && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">🥩 {c.meatType}</span>
              )}
              {canSelectSide && c.sideType && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">🍟 {c.sideType}</span>
              )}
              {c.extras.map((extra) => (
                <span key={extra} className="text-xs bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded">+{extra}</span>
              ))}
              {c.drink && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">🥤 {c.drink}</span>
              )}
            </div>
            {c.removedIngredients.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">❌ Sin: {c.removedIngredients.join(", ")}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold text-sm">{itemTotal.toFixed(2)}€</span>
            <div className="flex items-center gap-1">
              <button onClick={() => removeById(c.id)} className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground hover:bg-destructive hover:text-accent-foreground transition">
                <Trash2 size={12} />
              </button>
              <button onClick={() => addToCart(c.item)} className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable customization */}
        {(canCustomize || canSelectMeat || canSelectSide || isMenu(c.item)) && (
          <>
            <button
              onClick={() => setExpandedItemId(isExpanded ? null : c.id)}
              className="w-full flex items-center justify-center gap-1 py-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground border-t border-border transition"
            >
              Personalizar
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {isExpanded && (
              <div className="pt-2 border-t border-border bg-muted/30 rounded-md px-3 py-2 mt-1 space-y-3">
                {/* Meat type selector */}
                {canSelectMeat && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">🥩 Tipo de carne:</p>
                    <div className="flex gap-2">
                      {MEAT_TYPES.map((meat) => (
                        <button
                          key={meat}
                          onClick={() => setMeatType(c.id, meat)}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            c.meatType === meat
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/20"
                          }`}
                        >
                          {meat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side selector (patatas / arroz) */}
                {canSelectSide && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">🍟 Acompañamiento:</p>
                    <div className="flex gap-2">
                      {SIDE_TYPES.map((side) => (
                        <button
                          key={side}
                          onClick={() => setSideType(c.id, side)}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            c.sideType === side
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/20"
                          }`}
                        >
                          {side}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras (cross-sell) */}
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">➕ Extras:</p>
                  <div className="space-y-1.5">
                    {EXTRAS.map((extra) => (
                      <label key={`${c.id}-extra-${extra.name}`} className="flex items-center justify-between gap-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={c.extras.includes(extra.name)}
                            onCheckedChange={() => toggleExtra(c.id, extra.name)}
                          />
                          <span className="text-sm text-foreground">{extra.name}</span>
                        </div>
                        <span className="text-xs text-primary font-semibold">+{extra.price.toFixed(2)}€</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Remove ingredients */}
                {canCustomize && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Quitar ingredientes:</p>
                    {INGREDIENTS.map((ing) => (
                      <label key={`${c.id}-${ing}`} className="flex items-center gap-2 cursor-pointer mb-1.5">
                        <Checkbox
                          checked={c.removedIngredients.includes(ing)}
                          onCheckedChange={() => toggleIngredient(c.id, ing)}
                        />
                        <span className="text-sm text-foreground">{ing}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Drink selector for Menú */}
                {isMenu(c.item) && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">🥤 Bebida del menú:</p>
                    <select
                      value={c.drink}
                      onChange={(e) => setCart((prev) => prev.map((ci) => ci.id === c.id ? { ...ci, drink: e.target.value } : ci))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition"
                    >
                      {DRINKS.map((drink) => (
                        <option key={drink} value={drink}>{drink}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <section id={ORDER_SECTION_ID} className="py-16 bg-secondary scroll-mt-24">
      <div className="container max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">
          Haz tu pedido
        </h2>

        {/* Temporary closure banner */}
        {isClosed && (
          <div
            className="mb-6 rounded-lg border border-destructive/60 bg-destructive/15 px-4 py-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-display text-xl md:text-2xl text-destructive tracking-wide uppercase font-bold">
              VOLVEMOS EL 25 DE AGOSTO
            </p>
            <p className="text-foreground text-sm mt-1">
              Estamos cerrados por vacaciones. No se pueden realizar pedidos hasta el 25 de agosto de 2026.
            </p>
          </div>
        )}

        {/* Schedule banner */}
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-center text-sm ${
            scheduleStatus.open && !isClosed
              ? "border-green-500/40 bg-green-500/10 text-foreground"
              : "border-destructive/40 bg-destructive/10 text-foreground"
          }`}
          role="status"
          aria-live="polite"
        >
          {scheduleStatus.open && !isClosed ? (
            <p>
              <span className="font-bold">🟢 Estamos abiertos.</span>{" "}
              <span className="text-muted-foreground">Horario: {SCHEDULE_TEXT}</span>
            </p>
          ) : (
            <p>
              <span className="font-bold">🔴 Pedidos cerrados.</span>{" "}
              {isClosed
                ? "Volvemos el 25 de agosto de 2026."
                : scheduleStatus.reason === "monday"
                ? "Los lunes descansamos."
                : "Estamos fuera del horario de pedidos."}{" "}
              {!isClosed && scheduleStatus.nextOpenLabel && (
                <>Volvemos a abrir <span className="font-semibold">{scheduleStatus.nextOpenLabel}</span>. </>
              )}
              <span className="block text-muted-foreground mt-1">Horario: {SCHEDULE_TEXT}</span>
            </p>
          )}
        </div>

        {/* Tabs: Carta / Carrito */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "menu" as const, label: "🍽️ Carta" },
            { key: "carrito" as const, label: `🛒 Carrito${cartCount > 0 ? ` (${cartCount})` : ""}` },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStep(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                step === tab.key || (step === "datos" && tab.key === "carrito")
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
              {MENU.filter((m) => m.category === CATEGORIES[activeCat]).map(
                (item) => (
                  <ProductCard key={item.name} item={item} />
                )
              )}
            </div>

            {/* Cart summary bar */}
            {cart.length > 0 && (
              <button
                onClick={() => setStep("carrito")}
                className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-lg px-5 py-4 font-bold text-base shadow-[var(--shadow-gold)] hover:brightness-110 transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  {cartCount} producto{cartCount > 1 ? "s" : ""}
                </span>
                <span>{total.toFixed(2)}€ — Ver carrito</span>
              </button>
            )}
          </>
        ) : step === "carrito" ? (
          <>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm">Tu carrito está vacío</p>
                <button
                  onClick={() => setStep("menu")}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition"
                >
                  Ver carta
                </button>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="space-y-2 mb-4">
                  {cart.map((c, index) => (
                    <CartItemCard key={c.id} c={c} index={index} />
                  ))}
                  <div className="flex justify-between px-4 py-3 font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary text-lg">{total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Save cart button */}
                <button
                  onClick={handleSaveCart}
                  className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 rounded-lg bg-muted text-muted-foreground text-sm font-semibold hover:bg-border transition"
                >
                  <Save size={16} />
                  {savedNotice ? "✅ Carrito guardado" : "Guardar carrito para después"}
                </button>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setStep("menu")} className={`px-5 py-3 rounded-lg font-semibold text-sm transition ${
                    method === "domicilio" && total < 15
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] hover:brightness-110 animate-pulse-glow"
                      : "bg-muted text-muted-foreground hover:bg-border"
                  }`}>
                    ← Añadir más
                  </button>
                  <button
                    onClick={() => setStep("datos")}
                    disabled={method === "domicilio" && total < 15}
                    className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-[var(--shadow-gold)] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar con el pedido
                  </button>
                </div>
                {total < 15 && method === "domicilio" && (
                  <p className="text-accent text-xs text-center font-medium mt-2">⚠️ Pedido mínimo a domicilio: 15€ (faltan {(15 - total).toFixed(2)}€)</p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* Cart review */}
            <div className="space-y-2 mb-6">
              {groupedForMessage.map((c, index) => (
                <div
                  key={`${c.item.name}-${index}-${c.meatType}-${c.removedIngredients.join("-")}-${c.extras.join("-")}`}
                  className="bg-card rounded-lg px-4 py-3 border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium">
                        {c.qty}x {c.item.name}
                        {hasMeatOption(c.item) && ` (${c.meatType})`}
                        {hasSideChoice(c.item) && c.sideType && ` · 🍟 ${c.sideType}`}
                      </p>
                      {c.extras.length > 0 && (
                        <p className="text-xs text-accent-foreground mt-0.5">
                          + {c.extras.join(", ")}
                        </p>
                      )}
                      {c.drink && (
                        <p className="text-xs text-primary mt-0.5">
                          🥤 {c.drink}
                        </p>
                      )}
                      {c.removedIngredients.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ❌ Sin: {c.removedIngredients.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-sm">
                        {(c.unitPrice * c.qty).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary text-lg">
                  {total.toFixed(2)}€
                </span>
              </div>
              {total < 15 && method === "domicilio" && (
                <p className="text-accent text-xs text-center font-medium">
                  ⚠️ Pedido mínimo a domicilio: 15€ (faltan{" "}
                  {(15 - total).toFixed(2)}€)
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

            {/* Payment method */}
            <div className="mb-4">
              <p className="text-foreground text-sm font-semibold mb-2">
                Método de pago
              </p>
              <div className="flex gap-2 mb-3">
                {(["efectivo", "tarjeta"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPayment(p);
                      if (p === "tarjeta") setBillAmount(null);
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      payment === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p === "efectivo" ? "💵 Efectivo" : "💳 Tarjeta en domicilio"}
                  </button>
                ))}
              </div>

              {payment === "efectivo" && (
                <div>
                  <p className="text-muted-foreground text-xs mb-2">
                    ¿Con qué billete pagas? (para preparar el cambio)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BILL_OPTIONS.map((bill) => (
                      <button
                        key={bill}
                        onClick={() => setBillAmount(bill)}
                        disabled={bill < total}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          billAmount === bill
                            ? "bg-primary text-primary-foreground"
                            : bill < total
                            ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                            : "bg-muted text-muted-foreground hover:bg-primary/20"
                        }`}
                      >
                        {bill}€
                      </button>
                    ))}
                    <button
                      onClick={() => setBillAmount(-1)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        billAmount === -1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                      }`}
                    >
                      Exacto
                    </button>
                  </div>
                </div>
              )}

              {payment === "tarjeta" && (
                <div className="bg-card border border-primary/30 rounded-lg px-4 py-3 text-center">
                  <p className="text-foreground text-sm font-semibold">
                    💳 Pago con tarjeta en tu domicilio
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Llevamos el datáfono y cobramos al entregar el pedido.
                  </p>
                  <p className="text-primary font-bold text-base mt-2">
                    Importe: {total.toFixed(2)}€
                  </p>
                </div>
              )}
            </div>

            {/* Customer details */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
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
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
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
                <div>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Dirección de entrega (calle y número)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      maxLength={200}
                      className={`w-full bg-card border rounded-lg pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
                        addressStatus === "ok"
                          ? "border-green-500 focus:border-green-500"
                          : addressStatus === "too_far" || addressStatus === "not_found"
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {addressStatus === "checking" && (
                      <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
                    )}
                    {addressStatus === "ok" && (
                      <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {(addressStatus === "too_far" || addressStatus === "not_found") && (
                      <AlertTriangle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive" />
                    )}
                  </div>
                  {addressStatus === "ok" && addressDistance !== null && (
                    <p className="text-green-500 text-xs mt-1 ml-1">
                      ✅ Llegamos hasta tu casa
                    </p>
                  )}
                  {addressStatus === "too_far" && (
                    <p className="text-destructive text-xs mt-1 ml-1">
                      ❌ De momento no llegamos hasta tu casa, esperamos poder hacerlo pronto..
                    </p>
                  )}
                  {addressStatus === "not_found" && (
                    <p className="text-destructive text-xs mt-1 ml-1">
                      ⚠️ No se ha encontrado la dirección. Incluye calle y número.
                    </p>
                  )}
                </div>
              )}
              <textarea
                placeholder="Notas (opcional): extra picante..."
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
                onClick={() => setStep("carrito")}
                className="px-5 py-3 rounded-lg bg-muted text-muted-foreground font-semibold text-sm hover:bg-border transition"
              >
                ← Volver al carrito
              </button>
              <button
                onClick={handleSend}
                disabled={
                  !isFormValid || (method === "domicilio" && total < 15)
                }
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-[var(--shadow-gold)] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isClosed
                  ? "VOLVEMOS EL 25 DE AGOSTO"
                  : scheduleStatus.open
                  ? "Enviar pedido por WhatsApp"
                  : `Cerrado · ${scheduleStatus.nextOpenLabel ? `abrimos ${scheduleStatus.nextOpenLabel}` : "fuera de horario"}`}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderForm;
