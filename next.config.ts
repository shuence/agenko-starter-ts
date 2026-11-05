import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack does not walk up to a parent lockfile.
  turbopack: { root },

  // The Agenko SDK is a Node package (node:crypto + OpenTelemetry).
  // Keep it outside the bundler so it loads natively in route handlers.
  serverExternalPackages: ["@agenko/sdk"],
};

export default nextConfig;
