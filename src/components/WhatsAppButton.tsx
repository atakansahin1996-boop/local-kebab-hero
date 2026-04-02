import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/34697878655?text=Hola%2C%20quiero%20hacer%20un%20pedido"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Pedir por WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-bold shadow-lg hover:scale-105 hover:brightness-110 transition-transform animate-pulse-glow"
  >
    <MessageCircle size={22} fill="white" strokeWidth={0} />
    <span className="hidden sm:inline">Pedir por WhatsApp</span>
  </a>
);

export default WhatsAppButton;
