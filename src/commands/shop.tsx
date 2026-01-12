import type { CommandInteraction } from "@dressed/react";
import { useState } from "react";
import { CheckOut } from "../jsx/check-out";
import { Products } from "../jsx/products";

export default function shopCommand(interaction: CommandInteraction) {
  return interaction.reply(<Shop />, { ephemeral: true });
}

function Shop() {
  const [showCheckOut, setShowCheckOut] = useState(false);
  return showCheckOut ? (
    <CheckOut hideCheckout={() => setShowCheckOut(false)} />
  ) : (
    <Products showCheckout={() => setShowCheckOut(true)} />
  );
}
