import { Button, Container, Section, Separator, Thumbnail } from "@dressed/react";
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductsRes } from "../types";
import { PaginationButtons } from "./pagination";
import { useShop } from "./providers";

const LIMIT = 3;

export function Products() {
  const { cart, page, view, setView } = useShop();
  const { data, isFetching } = useQuery({
    queryKey: ["products", page],
    async queryFn() {
      const res = await fetch(`https://dummyjson.com/products?limit=${LIMIT}&skip=${(page - 1) * LIMIT}`);
      return res.json() as Promise<ProductsRes>;
    },
    placeholderData: (prev) => prev,
  });

  if (view !== "products") return null;

  return (
    <>
      <Container>
        {data?.products.map((product) => (
          <>
            <Section accessory={<Thumbnail media={product.thumbnail} />}>
              ### {product.title}
              {"\n"}
              {product.description}
            </Section>
            <Section key={product.id} accessory={<ProductCartButton product={product} />}>
              *${product.price}*
            </Section>
            <Separator />
          </>
        )) ?? "Loading products"}
        <Section accessory={<Button onClick={() => setView("checkout")} label="Check Out" />}>
          -# {cart.length} item{cart.length !== 1 && "s"} in cart.
        </Section>
      </Container>
      <PaginationButtons totalPages={data ? Math.ceil(data.total / LIMIT) : undefined} disabled={isFetching} />
    </>
  );
}

export function ProductCartButton({ product }: Readonly<Partial<Parameters<typeof Button>[0]> & { product: Product }>) {
  const { cart, setCart } = useShop();
  const isInCart = cart.some((c) => c.id === product.id);
  return (
    <Button
      onClick={() =>
        setCart((p) => (p.some((c) => c.id === product.id) ? p.filter((c) => c.id !== product.id) : p.concat(product)))
      }
      label={isInCart ? "Remove from cart" : "Add to cart"}
      style="Secondary"
    />
  );
}
