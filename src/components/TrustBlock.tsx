import { Truck, Clock, MapPin } from "lucide-react";

const zones = ["Moratalaz", "Valdebernardo", "Vicálvaro"];

const TrustBlock = () => (
  <section className="bg-secondary py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center gap-3 p-6">
          <MapPin className="text-primary" size={32} />
          <h3 className="font-display text-lg text-foreground">Reparto propio en:</h3>
          <div className="space-y-1">
            {zones.map((z) => (
              <p key={z} className="text-foreground/80 text-sm">✔ {z}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          <Truck className="text-primary" size={32} />
          <h3 className="font-display text-lg text-foreground">Pedido directo</h3>
          <p className="text-foreground/70 text-sm">Desde nuestra web sin intermediarios.</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          <Clock className="text-primary" size={32} />
          <h3 className="font-display text-lg text-foreground">Entrega rápida</h3>
          <p className="text-foreground/70 text-sm">Aproximada: 20–25 minutos.</p>
        </div>
      </div>
    </div>
  </section>
);

export default TrustBlock;
