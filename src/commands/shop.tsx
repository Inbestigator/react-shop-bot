import type { CommandInteraction } from "@dressed/react";
import { CheckOut } from "../jsx/check-out";
import { Products } from "../jsx/products";

export default function shopCommand(interaction: CommandInteraction) {
  return interaction.reply(
    <>
      <Products />
      <CheckOut />
    </>,
    { ephemeral: true },
  );
}
