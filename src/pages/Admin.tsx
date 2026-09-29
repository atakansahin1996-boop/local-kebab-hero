import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Check, X, Loader2 } from "lucide-react";

type Product = {
  id: string;
  product_name: string;
  available: boolean;
};

const Admin = () => {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("product_availability")
      .select("id, product_name, available")
      .order("product_name");
    if (data) setProducts(data);
  };

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await supabase.functions.invoke("toggle-availability", {
        body: { pin, product_name: "__test__", available: true },
      });
      if (res.error || res.data?.error) {
        setError("PIN incorrecto");
      } else {
        // PIN is valid (the update won't match anything since __test__ doesn't exist)
        setAuthenticated(true);
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  const toggleAvailability = async (product: Product) => {
    setToggling(product.product_name);
    try {
      await supabase.functions.invoke("toggle-availability", {
        body: {
          pin,
          product_name: product.product_name,
          available: !product.available,
        },
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.product_name === product.product_name
            ? { ...p, available: !p.available }
            : p
        )
      );
    } catch {
      // ignore
    }
    setToggling(null);
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Lock size={24} />
            <h1 className="font-display text-xl">Panel Admin</h1>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Introduce el PIN para gestionar la disponibilidad
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="PIN"
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={loading || !pin}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-bold disabled:opacity-50 hover:brightness-110 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              "Acceder"
            )}
          </button>
        </div>
      </main>
    );
  }

  // Group products by category
  const categories = new Map<string, Product[]>();
  products.forEach((p) => {
    let cat = "Otros";
    if (p.product_name.startsWith("Kebab")) cat = "Kebab";
    else if (p.product_name.startsWith("Durum")) cat = "Durum";
    else if (p.product_name.startsWith("Plato")) cat = "Plato";
    else if (p.product_name.startsWith("Menú")) cat = "Menú";
    else if (p.product_name.includes("alitas")) cat = "Alitas";
    else if (
      ["Patatas", "Arroz", "Nuggets", "Palitos de queso", "Falafel (ración)"].includes(
        p.product_name
      )
    )
      cat = "Raciones";
    else if (["Refrescos", "Agua"].includes(p.product_name)) cat = "Bebidas";
    else if (p.product_name === "Baklava") cat = "Postres";

    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(p);
  });

  return (
    <main className="min-h-screen bg-background pt-20 pb-16">
      <div className="container max-w-2xl">
        <h1 className="font-display text-2xl text-center text-foreground mb-2">
          Gestión de Productos
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Toca un producto para activarlo/desactivarlo
        </p>

        {Array.from(categories.entries()).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h2 className="font-display text-lg text-primary mb-3">{cat}</h2>
            <div className="space-y-2">
              {items.map((product) => (
                <button
                  key={product.product_name}
                  onClick={() => toggleAvailability(product)}
                  disabled={toggling === product.product_name}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    product.available
                      ? "bg-card border-border hover:border-primary/40"
                      : "bg-destructive/10 border-destructive/30 opacity-60"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      product.available
                        ? "text-foreground"
                        : "text-muted-foreground line-through"
                    }`}
                  >
                    {product.product_name}
                  </span>
                  {toggling === product.product_name ? (
                    <Loader2 size={18} className="animate-spin text-muted-foreground" />
                  ) : product.available ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <X size={18} className="text-destructive" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Admin;
