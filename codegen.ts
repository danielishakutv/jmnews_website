import "dotenv/config";
import { config as loadEnv } from "dotenv";
import type { CodegenConfig } from "@graphql-codegen/cli";

// Load .env.local explicitly — codegen runs outside Next, so Next's
// automatic env loading does not apply here.
loadEnv({ path: ".env.local" });

const url = process.env.WP_GRAPHQL_URL;
if (!url) {
  throw new Error(
    "WP_GRAPHQL_URL is not set. Add it to .env.local (see .env.example)."
  );
}

// Introspection on this WP instance is locked down to admin users, so we
// authenticate with a WP Application Password via HTTP Basic Auth. The
// password is only used at build/codegen time and never shipped to the client.
const user = process.env.WP_ADMIN_USER;
const pwd = process.env.WP_ADMIN_APP_PASSWORD?.replace(/\s+/g, "");
const authHeader =
  user && pwd
    ? `Basic ${Buffer.from(`${user}:${pwd}`).toString("base64")}`
    : undefined;

if (!authHeader) {
  console.warn(
    "[codegen] WP_ADMIN_USER / WP_ADMIN_APP_PASSWORD not set. Introspection " +
      "will fail unless public introspection is enabled in WPGraphQL settings."
  );
}

const config: CodegenConfig = {
  schema: [
    {
      [url]: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}", "!src/lib/cms/generated/**/*"],
  generates: {
    "./src/lib/cms/generated/": {
      preset: "client",
      config: {
        useTypeImports: true,
        // Prefix all generated WP types so they're easy to spot in the editor.
        namingConvention: { typeNames: "change-case-all#pascalCase" },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
