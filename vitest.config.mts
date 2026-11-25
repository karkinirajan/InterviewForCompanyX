import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["test/**/*.test.{ts,mts,mjs}"],
    environment: "node",
    coverage: { provider: "v8", include: ["src/lib/**", "scripts/serve.mjs"], reporter: ["text-summary"] },
  },
});
