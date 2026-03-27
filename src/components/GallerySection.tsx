import durumImg from "@/assets/durum.jpeg";
import kebabImg from "@/assets/kebab.jpeg";
import alitasImg from "@/assets/alitas.jpeg";
import platoImg from "@/assets/plato.jpeg";
import mascotasImg from "@/assets/mascotas.jpeg";

const gallery = [
  { src: kebabImg, alt: "Kebab artesanal de Almas Comilonas" },
  { src: durumImg, alt: "Durum recién preparado" },
  { src: alitasImg, alt: "Alitas crujientes" },
  { src: platoImg, alt: "Plato kebab con patatas y ensalada" },
];

const GallerySection = () => (
  <section className="py-16 bg-secondary">
    <div className="container max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          Nuestros platos
        </h2>
        <p className="text-muted-foreground text-sm">
          Hechos al momento con ingredientes frescos
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {gallery.map((img) => (
          <div
            key={img.alt}
            className="relative aspect-[3/4] rounded-xl overflow-hidden group"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Mascotas */}
      <div className="flex justify-center">
        <img
          src={mascotasImg}
          alt="Comilín y Comilón — mascotas de Almas Comilonas"
          loading="lazy"
          className="w-48 md:w-56 rounded-2xl"
        />
      </div>
    </div>
  </section>
);

export default GallerySection;
