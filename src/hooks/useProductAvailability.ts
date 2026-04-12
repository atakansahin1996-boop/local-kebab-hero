import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProductAvailability = {
  product_name: string;
  available: boolean;
};

export const useProductAvailability = () => {
  return useQuery({
    queryKey: ["product-availability"],
    queryFn: async (): Promise<ProductAvailability[]> => {
      const { data, error } = await supabase
        .from("product_availability")
        .select("product_name, available");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000, // refresh every 30s
  });
};

export const isProductAvailable = (
  availability: ProductAvailability[] | undefined,
  productName: string
): boolean => {
  if (!availability) return true; // default to available if not loaded
  const product = availability.find((p) => p.product_name === productName);
  return product?.available ?? true;
};
