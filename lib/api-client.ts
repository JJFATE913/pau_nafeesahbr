/**
 * Reads a JSON body with an expected shape. The Cloudflare Workers types declare
 * `Response.json()` as `unknown`, so call sites state what they expect.
 */
export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export type ApiError = { error?: string };
