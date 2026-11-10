import { useState } from "react";
import { useProductAvailability, isProductAvailable } from "@/hooks/useProductAvailability";
import { useTemporaryRestrictions } from "@/hooks/useTemporaryRestrictions";

type Category = {
  name: string;
  items: { name: string; price: string; productKey: string }[];
};

const menuData: Category[] = [
  {
    name: "Kebab",
    items: [
      { name: "Normal", price: "6,00€", productKey: "Kebab Normal" },
      { name: "Con queso", price: "6,70€", productKey: "Kebab Con queso" },
      { name: "Doble", price: "7,50€", productKey: "Kebab Doble" },
      { name: "Doble con queso", price: "8,20€", productKey: "Kebab Doble con queso" },
      { name: "Falafel", price: "6,00€", productKey: "Kebab Falafel" },
      { name: "Vegetal", price: "5,50€", productKey: "Kebab Vegetal" },
    ],
  },
  {
    name: "Durum",
    items: [
      { name: "Normal", price: "6,50€", productKey: "Durum Normal" },
      { name: "Con queso", price: "7,20€", productKey: "Durum Con queso" },
      { name: "Doble", price: "8,00€", productKey: "Durum Doble" },
      { name: "Doble con queso", price: "8,70€", productKey: "Durum Doble con queso" },
      { name: "Falafel", price: "6,50€", productKey: "Durum Falafel" },
      { name: "Vegetal", price: "6,00€", productKey: "Durum Vegetal" },
    ],
  },
  {
    name: "Plato",
    items: [
      { name: "Con ensalada", price: "8,00€", productKey: "Plato con ensalada" },
      { name: "Con patatas o arroz", price: "9,00€", productKey: "Plato con patatas o arroz" },
      { name: "Con patatas y arroz", price: "10,00€", productKey: "Plato con patatas y arroz" },
      { name: "Falafel", price: "8,00€", productKey: "Plato Falafel" },
      { name: "Antep", price: "10,00€", productKey: "Plato Antep" },
      { name: "Extra de carne", price: "+1,50€", productKey: "Plato Antep" },
    ],
  },
  {
    name: "Menú",
    items: [
      { name: "Menú Kebab", price: "9,50€", productKey: "Menú Kebab" },
      { name: "Menú Durum", price: "10,00€", productKey: "Menú Durum" },
      { name: "Menú Plato", price: "11,00€", productKey: "Menú Plato" },
      { name: "Menú Infantil", price: "9,00€", productKey: "Menú Infantil" },
      { name: "Menú Alitas", price: "9,00€", productKey: "Menú Alitas" },
    ],
  },
  {
    name: "Alitas",
    items: [
      { name: "4 alitas", price: "4,50€", productKey: "4 alitas" },
      { name: "7 alitas", price: "6,00€", productKey: "7 alitas" },
      { name: "12 alitas", price: "10,50€", productKey: "12 alitas" },
      { name: "5 alitas y patatas", price: "7,50€", productKey: "5 alitas y patatas" },
      { name: "15 alitas y patatas", price: "13,00€", productKey: "15 alitas y patatas" },
    ],
  },
  {
    name: "Raciones",
    items: [
      { name: "Patatas", price: "4,00€", productKey: "Patatas" },
      { name: "Arroz", price: "3,00€", productKey: "Arroz" },
      { name: "Nuggets", price: "5,00€", productKey: "Nuggets" },
      { name: "Palitos de queso", price: "6,00€", productKey: "Palitos de queso" },
      { name: "Falafel", price: "5,00€", productKey: "Falafel (ración)" },
    ],
  },
  {
    name: "Bebidas",
    items: [
      { name: "Refrescos", price: "2,80€", productKey: "Refrescos" },
      { name: "Agua", price: "1,50€", productKey: "Agua" },
    ],
  },
  {
    name: "Postres",
    items: [{ name: "Baklava", price: "1,50€", productKey: "Baklava" }],
  },
];

const MenuSection = () => {
  const [active, setActive] = useState(0);
  const { data: availability } = useProductAvailability();
  const { isHidden } = useTemporaryRestrictions();
  const visibleMenu = menuData.map((category) => ({
    ...category,
    items: category.items.filter((item) => !isHidden(item.productKey)),
  })).filter((category) => category.items.length > 0);
  const activeCategory = visibleMenu[active] ?? visibleMenu[0];

  return (
    <section id="carta" className="py-16 bg-background">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-2">
          Nuestra Carta
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Pedido mínimo a domicilio 15€
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {visibleMenu.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                active === i
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="space-y-3">
          {activeCategory?.items.map((item) => {
            const available = isProductAvailable(availability, item.productKey);
            return (
              <div
                key={item.name}
                className={`flex items-center justify-between bg-card rounded-lg px-5 py-4 border border-border transition-colors ${
                  available
                    ? "hover:border-primary/40"
                    : "opacity-50"
                }`}
              >
                <span className={`font-medium ${available ? "text-foreground" : "text-muted-foreground line-through"}`}>
                  {item.name}
                  {!available && (
                    <span className="ml-2 text-xs text-destructive font-normal no-underline inline-block" style={{ textDecoration: 'none' }}>
                      No disponible
                    </span>
                  )}
                </span>
                <span className={`font-bold text-lg ${available ? "text-primary" : "text-muted-foreground"}`}>
                  {item.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
