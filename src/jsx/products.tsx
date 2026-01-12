import { Button, Container, Section, Separator, Thumbnail } from "@dressed/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import type { Product } from "../types";
import { removeFromCartAction } from "../utils/remove-from-cart";
import { PaginationButtons } from "./pagination";
import { useShop } from "./providers";

type ProductsRes = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export function Products({ showCheckout }: Readonly<{ showCheckout: () => void }>) {
  const { cart, setCart, page, setPage } = useShop();

  const limit = 3;
  const skip = (page - 1) * limit;

  const { data, isFetching } = useQuery({
    queryKey: ["products", page],
    async queryFn() {
      const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      return res.json() as Promise<ProductsRes>;
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
