const Footer = () => (
  <footer className="bg-secondary border-t border-border py-10">
    <div className="container text-center space-y-3">
      <p className="text-foreground/80 text-sm max-w-xl mx-auto">
        Servicio de kebab a domicilio en Moratalaz, Valdebernardo y Vicálvaro. Pedido online rápido para recoger en local o entrega en casa.
      </p>
      <p className="text-muted-foreground text-xs">
        © {new Date().getFullYear()} Almas Comilonas. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
