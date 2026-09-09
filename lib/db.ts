import { d1 } from "@/lib/cloudflare";

/**
 * A tiny key/value store: every record has a partition key (the collection) and a sort key
 * (the record id). On Cloudflare this is one D1 table; without the binding it falls back to
 * JSON files on disk. Both backends refuse a duplicate key, which is what keeps two guests
 * from booking the same slot.
 */
export type Item = Record<string, unknown> & { pk: string; sk: string };

function decode(pk: string, sk: string, data: string): Item {
  return { ...(JSON.parse(data) as Record<string, unknown>), pk, sk };
}

// Loaded lazily so the filesystem code is never pulled into the Worker unless needed.
async function local() {
  return import("@/lib/db-local");
}

export async function getItem(pk: string, sk: string): Promise<Item | null> {
  const db = await d1();
  if (!db) return (await local()).getItem(pk, sk);

  const row = await db
    .prepare("SELECT data FROM records WHERE pk = ? AND sk = ?")
    .bind(pk, sk)
    .first<{ data: string }>();
  return row ? decode(pk, sk, row.data) : null;
}

/**
 * Writes a record. With `onlyIfAbsent` the write is rejected when the key already exists.
 * Returns false when the record already existed.
 */
export async function putItem(item: Item, onlyIfAbsent = false): Promise<boolean> {
  const db = await d1();
  if (!db) return (await local()).putItem(item, onlyIfAbsent);

  const { pk, sk, ...rest } = item;
  const data = JSON.stringify(rest);
  const sql = onlyIfAbsent
    ? "INSERT INTO records (pk, sk, data) VALUES (?, ?, ?) ON CONFLICT (pk, sk) DO NOTHING"
    : "INSERT INTO records (pk, sk, data) VALUES (?, ?, ?) ON CONFLICT (pk, sk) DO UPDATE SET data = excluded.data";

  const result = await db.prepare(sql).bind(pk, sk, data).run();
  return onlyIfAbsent ? (result.meta.changes ?? 0) > 0 : true;
}

export async function deleteItem(pk: string, sk: string): Promise<void> {
  const db = await d1();
  if (!db) return (await local()).deleteItem(pk, sk);

  await db.prepare("DELETE FROM records WHERE pk = ? AND sk = ?").bind(pk, sk).run();
}

/** Returns every record in a collection, optionally limited to sort keys with a prefix. */
export async function queryItems(pk: string, skPrefix?: string): Promise<Item[]> {
  const db = await d1();
  if (!db) return (await local()).queryItems(pk, skPrefix);

  const statement = skPrefix
    ? db
        .prepare("SELECT sk, data FROM records WHERE pk = ? AND sk LIKE ? ORDER BY sk")
        .bind(pk, `${skPrefix}%`)
    : db.prepare("SELECT sk, data FROM records WHERE pk = ? ORDER BY sk").bind(pk);

  const { results } = await statement.all<{ sk: string; data: string }>();
  return (results ?? []).map((row) => decode(pk, row.sk, row.data));
}

/**
 * Atomically increments a counter and returns its new value. Used for rate limiting, so the
 * count stays correct no matter which Cloudflare location handles the request.
 */
export async function incrementCounter(
  key: string,
  expiresAtSeconds: number,
): Promise<number> {
  const db = await d1();
  if (!db) return (await local()).incrementCounter(key, expiresAtSeconds);

  const row = await db
    .prepare(
      `INSERT INTO counters (key, count, expires_at) VALUES (?, 1, ?)
       ON CONFLICT (key) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(key, expiresAtSeconds)
    .first<{ count: number }>();

  if ((row?.count ?? 0) === 1) {
    await db
      .prepare("DELETE FROM counters WHERE expires_at < ?")
      .bind(Math.floor(Date.now() / 1000))
      .run();
  }
  return row?.count ?? 1;
}
