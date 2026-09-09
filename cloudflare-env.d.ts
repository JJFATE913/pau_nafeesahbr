// Bindings the Worker receives from wrangler.jsonc. Full Workers runtime types are not
// needed to type-check the site, so this file stays small on purpose.

interface CloudflareEnv {
  DB?: D1Database;
  PHOTOS?: R2Bucket;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ meta: { changes?: number } }>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
}

interface R2Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null,
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
    },
  ): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
}
