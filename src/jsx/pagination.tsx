import { ActionRow, Button } from "@dressed/react";
import { useShop } from "./providers";

export function PaginationButtons({ totalPages, disabled }: Readonly<{ totalPages?: number; disabled?: boolean }>) {
  const { page, setPage } = useShop();
  return (
    <ActionRow>
      <Button onClick={() => setPage((p) => p - 1)} label="◀" disabled={page === 1 || disabled} />
      <Button custom_id="active" label={`${page} / ${totalPages ?? "?"}`} style="Secondary" disabled />
      <Button onClick={() => setPage((p) => p + 1)} label="▶" disabled={page === totalPages || disabled} />
    </ActionRow>
  );
}
