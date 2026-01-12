import {
  Button,
  type CommandInteraction,
  Container,
  Section,
  Separator,
  Thumbnail,
} from "@dressed/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useMemo, useState, useTransition } from "react";
import { PaginationButtons } from "../pages/pagination";
import { useShop } from "../providers";
import type { Cart, Product } from "../types";

type ProductsRes = { products: Product[]; total: number; skip: number; limit: number };

export default function shopCommand(interaction: CommandInteraction) {
  return interaction.reply(<ActionWrapper />, { ephemeral: true });
}

function ActionWrapper() {
  const [showCheckOut, setShowCheckOut] = useState(false);
  return showCheckOut ? (
    <CheckOut hideCheckout={() => setShowCheckOut(false)} />
  ) : (
    <Products showCheckout={() => setShowCheckOut(true)} />
  );
}

function Products({ showCheckout }: Readonly<{ showCheckout: () => void }>) {
  const { cart, setCart, page, setPage } = useShop();

  const limit = 3;
  const skip = (page - 1) * limit;

  const { data, isFetching } = useQuery<ProductsRes>({
    queryKey: ["products", page],
    async queryFn() {
      const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      return res.json();
    },
    placeholderData: (prev) => prev,
  });

  return (
    <>
      <Container>
        {data?.products.map((product) => {
          const isInCart = cart.some((c) => c.id === product.id);
          return (
            <Fragment key={product.id}>
              <Section accessory={<Thumbnail media={product.thumbnail} />}>
                ### {product.title}
                {"\n"}
                {product.description}
              </Section>
              <Section
                key={product.id}
                accessory={
                  <Button
                    onClick={removeFromCartAction(setCart, product)}
                    label={isInCart ? "Remove from cart" : "Add to cart"}
                    style="Secondary"
                  />
                }
              >
                *${product.price}*
              </Section>
              <Separator />
            </Fragment>
          );
        }) ?? "Loading products"}
        <Section accessory={<Button onClick={showCheckout} label="Check Out" />}>
          -# {cart.length} item{cart.length !== 1 && "s"} in cart.
        </Section>
      </Container>
      <PaginationButtons
        currentPage={page}
        totalPages={data ? Math.ceil(data.total / limit) : undefined}
        disabled={isFetching}
        setPage={setPage}
      />
    </>
  );
}

function CheckOut({ hideCheckout }: Readonly<{ hideCheckout: () => void }>) {
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

function removeFromCartAction(
  setCart: React.Dispatch<React.SetStateAction<Cart>>,
  product: Product
) {
  return () => {
    setCart((p) =>
      p.some((c) => c.id === product.id) ? p.filter((c) => c.id !== product.id) : p.concat(product)
    );
  };
}
