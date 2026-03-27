import kebabImg from "@/assets/kebab.jpeg";
import TrustBlock from "@/components/TrustBlock";
import MenuSection from "@/components/MenuSection";
import OrderForm from "@/components/OrderForm";
import GallerySection from "@/components/GallerySection";
import RestaurantJsonLd from "@/components/RestaurantJsonLd";

const Index = () => (
  <main className="pt-16">
    <RestaurantJsonLd />
    {/* Hero */}
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src={kebabImg}
        alt="Kebab a domicilio en Moratalaz, Valdebernardo y Vicálvaro"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero-overlay)" }}
      />
      <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in-up">
        <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 leading-tight">
          Kebab a domicilio en Moratalaz, Valdebernardo y Vicálvaro
        </h1>
        <p className="text-foreground/80 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
          Disfruta de nuestros durums, platos kebab, pizzas turcas y menús completos con reparto
          rápido. Preparamos cada pedido al momento con ingredientes frescos y la mejor carne kebab.
        </p>
        <a
          href="#pedir"
          id="pedir"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-10 py-4 text-lg font-bold shadow-[var(--shadow-gold)] animate-pulse-glow hover:brightness-110 transition"
        >
          PEDIR ONLINE AHORA
        </a>
      </div>
    </section>

    {/* Trust Block */}
    <TrustBlock />

    {/* Galería */}
    <GallerySection />

    {/* Carta */}
    <MenuSection />

    {/* Formulario de pedido */}
    <OrderForm />

    {/* SEO Extra Block */}
    <section className="py-16 bg-background">
      <div className="container max-w-2xl text-center">
        <p className="text-foreground/70 text-base leading-relaxed">
          Nuestros clientes en Moratalaz, Valdebernardo y Vicálvaro pueden hacer su pedido online
          fácilmente desde el móvil con entrega rápida y servicio directo desde nuestro local.
        </p>
      </div>
    </section>
  </main>
);

export default Index;
