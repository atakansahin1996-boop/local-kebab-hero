import { Helmet } from "react-helmet-async";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "KebabExpress",
  description:
    "Kebab a domicilio en Moratalaz, Valdebernardo y Vicálvaro. Durums, platos kebab, pizzas turcas y menús completos con entrega rápida.",
  servesCuisine: ["Turca", "Kebab"],
  telephone: "+34697878655",
  url: "https://kebabexpress.es",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madrid",
    addressRegion: "Comunidad de Madrid",
    addressCountry: "ES",
  },
  areaServed: [
    { "@type": "Place", name: "Moratalaz, Madrid" },
    { "@type": "Place", name: "Valdebernardo, Madrid" },
    { "@type": "Place", name: "Vicálvaro, Madrid" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
      opens: "12:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "12:00",
      closes: "00:00",
    },
  ],
  hasMenu: {
    "@type": "Menu",
    name: "Carta KebabExpress",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Kebab",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Kebab Normal", offers: { "@type": "Offer", price: "6.00", priceCurrency: "EUR" } },
          { "@type": "MenuItem", name: "Kebab Doble", offers: { "@type": "Offer", price: "7.50", priceCurrency: "EUR" } },
        ],
      },
      {
        "@type": "MenuSection",
        name: "Durum",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Durum Normal", offers: { "@type": "Offer", price: "6.50", priceCurrency: "EUR" } },
          { "@type": "MenuItem", name: "Durum Doble", offers: { "@type": "Offer", price: "8.00", priceCurrency: "EUR" } },
        ],
      },
    ],
  },
  priceRange: "€",
  "@id": "https://kebabexpress.es/#restaurant",
};

const RestaurantJsonLd = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
  </Helmet>
);

export default RestaurantJsonLd;
