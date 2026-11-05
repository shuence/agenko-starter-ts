import { createGateway } from "ai";

/**
 * Models are addressed by AI Gateway slug, e.g. `nvidia/nemotron-3.5-lightning-free`.
 * Swap providers without touching the app code.
 */
export const DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-free";

export function getModelId(): string {
  return process.env.AI_GATEWAY_MODEL ?? DEFAULT_MODEL;
}

/**
 * The gateway accepts either an API key or, on Vercel (and via
 * `vercel env pull` locally), an OIDC token. OIDC is the default in
 * production so the app never needs a long-lived key.
 */
export function hasGatewayAuth(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export function getGateway() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  return createGateway(apiKey ? { apiKey } : {});
}
