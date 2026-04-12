import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import KebabMoratalaz from "./pages/KebabMoratalaz";
import KebabValdebernardo from "./pages/KebabValdebernardo";
import KebabVicalvaro from "./pages/KebabVicalvaro";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kebab-moratalaz" element={<KebabMoratalaz />} />
          <Route path="/kebab-valdebernardo" element={<KebabValdebernardo />} />
          <Route path="/kebab-vicalvaro" element={<KebabVicalvaro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
