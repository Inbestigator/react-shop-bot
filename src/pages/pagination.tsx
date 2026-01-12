import { ActionRow, Button } from "@dressed/react";

export function PaginationButtons({
  currentPage,
  totalPages,
  ...fns
}: Readonly<
  { currentPage: number; totalPages?: number } & (
    | { disabled: boolean }
    | { setPage: React.Dispatch<React.SetStateAction<number>> }
  )
>) {
  const disabled = "disabled" in fns && fns.disabled;
  const onNext = "setPage" in fns ? () => fns.setPage((p) => p + 1) : undefined;
  const onPrev = "setPage" in fns ? () => fns.setPage((p) => p - 1) : undefined;

  return (
    <ActionRow>
      <Button onClick={() => onPrev?.()} label="◀" disabled={currentPage === 1 || disabled} />
      <Button
        custom_id="activepage"
        label={`${currentPage} / ${totalPages ?? "?"}`}
        style="Secondary"
        disabled
      />
      <Button
        onClick={() => onNext?.()}
        label="▶"
        disabled={currentPage === totalPages || disabled}
      />
    </ActionRow>
  );
}
