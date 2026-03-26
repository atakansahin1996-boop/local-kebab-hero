import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/kebab-moratalaz", label: "Moratalaz" },
  { to: "/kebab-valdebernardo", label: "Valdebernardo" },
  { to: "/kebab-vicalvaro", label: "Vicálvaro" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl text-primary tracking-wide">
          🔥 KebabExpress
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#pedir"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-bold shadow-[var(--shadow-gold)] hover:brightness-110 transition"
          >
            PEDIR ONLINE
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-foreground/80 hover:text-primary py-2"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#pedir"
            className="block text-center rounded-lg bg-primary text-primary-foreground px-5 py-3 text-sm font-bold"
          >
            PEDIR ONLINE
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
