import { useEffect, useState } from "react";
import { getTemporaryClosure, isProductTemporarilyHidden } from "@/lib/temporaryRestrictions";

export const useTemporaryRestrictions = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);
  return {
    closure: getTemporaryClosure(now),
    isHidden: (productName: string) => isProductTemporarilyHidden(productName, now),
  };
};