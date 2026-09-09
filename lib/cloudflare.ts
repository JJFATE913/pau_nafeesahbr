import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare exposes D1 and R2 as request bindings, not as environment variables.
 *
 * Sync lookup on purpose: the async form of `getCloudflareContext` starts Wrangler even
 * under `npm start`, which would silently switch the studio machine onto an empty local
 * D1. If the Worker has not attached a context, we return nothing and the site uses files.
 */
function bindings(): Partial<CloudflareEnv> {
  try {
    return getCloudflareContext({ async: false }).env ?? {};
  } catch {
    return {};
  }
}

export async function d1() {
  return bindings().DB;
}

export async function r2() {
  return bindings().PHOTOS;
}
