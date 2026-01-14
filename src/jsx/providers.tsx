import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Product } from "../types";

type State<T, V extends string> = { [K in V]: T } & { [K in `set${Capitalize<V>}`]: Dispatch<SetStateAction<T>> };
type Shop = State<Product[], "cart"> & State<number, "page"> & State<"products" | "checkout", "view">;

const queryClient = new QueryClient();
const ShopContext = createContext<Shop | null>(null);

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopContext Provider");
  }
  return context;
}

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  const [cart, setCart] = useState<Shop["cart"]>([]);
  const [page, setPage] = useState<Shop["page"]>(1);
  const [view, setView] = useState<Shop["view"]>("products");
  const shop = useMemo(() => ({ cart, setCart, page, setPage, view, setView }), [cart, page, view]);
  return (
    <QueryClientProvider client={queryClient}>
      <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>
    </QueryClientProvider>
  );
}
