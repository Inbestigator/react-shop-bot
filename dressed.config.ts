import { patchInteraction } from "@dressed/react";
import type { ServerConfig } from "dressed/server";
import Providers from "./src/providers";

export default {
  build: { extensions: ["tsx", "ts"] },
  port: 3000,
  middleware: {
    commands: (i) => [patchInteraction(i, Providers)],
    components: (i, ...p) => [patchInteraction(i, Providers), ...p],
  },
} satisfies ServerConfig;
