import heroImg from "@/assets/hero-kebab.jpg";

interface ZonePageProps {
  zone: string;
  description: string;
}

const ZonePage = ({ zone, description }: ZonePageProps) => (
  <main className="pt-16">
    {/* Hero */}
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt={`Kebab a domicilio en ${zone}`}
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero-overlay)" }}
      />
      <div className="relative z-10 text-center px-4 max-w-2xl animate-fade-in-up">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
          Kebab a domicilio en {zone}
        </h1>
        <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
          {description}
        </p>
        <a
          href="#pedir"
          id="pedir"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-4 text-lg font-bold shadow-[var(--shadow-gold)] animate-pulse-glow hover:brightness-110 transition"
        >
          PEDIR KEBAB EN {zone.toUpperCase()}
        </a>
      </div>
    </section>
  </main>
);

export default ZonePage;
