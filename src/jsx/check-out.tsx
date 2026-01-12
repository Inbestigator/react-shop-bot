import { Button, Section, Separator } from "@dressed/react";
import { useMemo, useTransition } from "react";
import { removeFromCartAction } from "../utils/remove-from-cart";
import { useShop } from "./providers";

export function CheckOut({ hideCheckout }: Readonly<{ hideCheckout: () => void }>) {
  const { cart, setCart } = useShop();
  const [isPending, startTransition] = useTransition();
  const subtotal = useMemo(() => cart.reduce((p, c) => c.price + p, 0), [cart]);
  return (
    <>
      {cart.map((product) => (
        <Section
          key={product.id}
          accessory={
            <Button
              onClick={removeFromCartAction(setCart, product)}
              label="Remove from cart"
              style="Secondary"
              disabled={isPending}
            />
          }
        >
          {product.title}
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
                  hideCheckout();
                })
              }
              label={isPending ? "Placing Order..." : "Place Order"}
              style="Success"
              disabled={isPending}
            />
          ) : (
            <Button onClick={hideCheckout} label="Back" />
          )
        }
      >
        -# Subtotal: ${subtotal}
        {"\n"}
        Total: **${(subtotal * 0.15).toFixed(2)}**
      </Section>
    </>
  );
}
