import type { Cart, Product } from "../types";

export function removeFromCartAction(setCart: React.Dispatch<React.SetStateAction<Cart>>, product: Product) {
  return () => {
    setCart((p) => (p.some((c) => c.id === product.id) ? p.filter((c) => c.id !== product.id) : p.concat(product)));
  };
}
