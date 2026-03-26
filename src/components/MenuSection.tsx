import { useState } from "react";

type Category = {
  name: string;
  items: { name: string; price: string }[];
};

const menuData: Category[] = [
  {
    name: "Kebab",
    items: [
      { name: "Normal", price: "6,00€" },
      { name: "Con queso", price: "6,70€" },
      { name: "Doble", price: "7,50€" },
      { name: "Doble con queso", price: "8,20€" },
      { name: "Falafel", price: "6,00€" },
      { name: "Vegetal", price: "5,50€" },
    ],
  },
  {
    name: "Durum",
    items: [
      { name: "Normal", price: "6,50€" },
      { name: "Con queso", price: "7,20€" },
      { name: "Doble", price: "8,00€" },
      { name: "Doble con queso", price: "8,70€" },
      { name: "Falafel", price: "6,50€" },
      { name: "Vegetal", price: "6,00€" },
    ],
  },
  {
    name: "Plato",
    items: [
      { name: "Con ensalada", price: "8,00€" },
      { name: "Con patatas o arroz", price: "9,00€" },
      { name: "Con patatas y arroz", price: "10,00€" },
      { name: "Falafel", price: "8,00€" },
      { name: "Antep", price: "10,00€" },
      { name: "Extra de carne", price: "+1,50€" },
    ],
  },
  {
    name: "Menú",
    items: [
      { name: "Menú Kebab", price: "9,50€" },
      { name: "Menú Durum", price: "10,00€" },
      { name: "Menú Plato", price: "11,00€" },
      { name: "Menú Infantil", price: "9,00€" },
      { name: "Menú Alitas", price: "9,00€" },
    ],
  },
  {
    name: "Alitas",
    items: [
      { name: "4 alitas", price: "4,50€" },
      { name: "7 alitas", price: "6,00€" },
      { name: "12 alitas", price: "10,50€" },
      { name: "5 alitas y patatas", price: "7,50€" },
      { name: "15 alitas y patatas", price: "13,00€" },
    ],
  },
  {
    name: "Raciones",
    items: [
      { name: "Patatas", price: "4,00€" },
      { name: "Arroz", price: "3,00€" },
      { name: "Nuggets", price: "5,00€" },
      { name: "Palitos de queso", price: "6,00€" },
      { name: "Falafel", price: "5,00€" },
      { name: "Box Kebab", price: "6,00€" },
    ],
  },
  {
    name: "Bebidas",
    items: [
      { name: "Refrescos", price: "2,80€" },
      { name: "Agua", price: "1,50€" },
    ],
  },
];

const MenuSection = () => {
  const [active, setActive] = useState(0);

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
          {menuData.map((cat, i) => (
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
          {menuData[active].items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between bg-card rounded-lg px-5 py-4 border border-border hover:border-primary/40 transition-colors"
            >
              <span className="text-foreground font-medium">{item.name}</span>
              <span className="text-primary font-bold text-lg">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
