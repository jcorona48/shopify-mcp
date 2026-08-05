import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { dependencies?: Record<string, string> };

/** Runtime deps stay in node_modules; only app code is bundled. */
const external = Object.keys(pkg.dependencies ?? {});

export default defineConfig({
  entry: ["src/index.ts", "src/api.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  external,
  sourcemap: true,
  clean: true,
});
