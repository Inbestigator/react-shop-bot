import { Button, Section, Separator } from "@dressed/react";
import { useMemo, useTransition } from "react";
import { ProductCartButton } from "./products";
import { useShop } from "./providers";

export function CheckOut() {
  const { cart, setCart, setPage, view, setView } = useShop();
  const [isPending, startTransition] = useTransition();
  const subtotal = useMemo(() => cart.reduce((p, c) => c.price + p, 0), [cart]);

  if (view !== "checkout") return null;

  return (
    <>
      {cart.map((product) => (
        <Section key={product.id} accessory={<ProductCartButton product={product} disabled={isPending} />}>
          {product.title}
          {"\n"}
          -# *${product.price}*
        </Section>
      ))}
      {!cart.length && "You don't have anything in your cart!"}
      <Separator />
      <Section
        accessory={
          cart.length ? (
            <Button
              onClick={() =>
                startTransition(async () => {
                  await new Promise((r) => setTimeout(r, 1000));
                  setCart([]);
                  setPage(1);
                  setView("products");
                })
              }
              label={isPending ? "Placing Order..." : "Place Order"}
              style="Success"
              disabled={isPending}
            />
          ) : (
            <Button onClick={() => setView("products")} label="Back" />
          )
        }
      >
        -# Subtotal: ${subtotal}
        {"\n"}
        Total: **${(subtotal * 1.15).toFixed(2)}**
      </Section>
    </>
  );
}
