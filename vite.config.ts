import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { metaSummary } from "./src/data";

// Inject the crawlable <head> counts from the SAME catalog + signal rules the app
// renders (src/data.ts -> metaSummary). Keeps the client-only shell's meta tags
// reconciled with the page so answer-engines never index a stale repo/platform/
// signal count. Fails the build loudly if a token is left unreplaced.
function injectMeta() {
  const tokens: Record<string, string> = {
    "%KG_TOTAL_REPOS%": String(metaSummary.totalRepos),
    "%KG_LANGUAGES%": String(metaSummary.languageCount),
    "%KG_VERTICALS%": String(metaSummary.verticalCount),
    "%KG_PLATFORMS%": String(metaSummary.platformCount),
    "%KG_SIGNALS%": String(metaSummary.signalCount)
  };

  return {
    name: "inject-portfolio-meta",
    transformIndexHtml(html: string) {
      let out = html;
      for (const [token, value] of Object.entries(tokens)) {
        out = out.split(token).join(value);
      }
      const leftover = out.match(/%KG_[A-Z_]+%/g);
      if (leftover) {
        throw new Error(`inject-portfolio-meta: unresolved token(s): ${[...new Set(leftover)].join(", ")}`);
      }
      return out;
    }
  };
}

export default defineConfig({
  plugins: [react(), injectMeta()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    testTimeout: 20000
  }
});
