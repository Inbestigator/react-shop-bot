import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import type { Cart } from "../types";

const queryClient = new QueryClient();

const ShopContext = createContext<{
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopContext Provider");
  }
  return context;
}

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  const [cart, setCart] = useState<Cart>([]);
  const [page, setPage] = useState(1);
  const shop = useMemo(() => ({ cart, setCart, page, setPage }), [cart, page]);
  return (
    <QueryClientProvider client={queryClient}>
      <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>
    </QueryClientProvider>
  );
}
