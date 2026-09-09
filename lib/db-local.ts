import { promises as fs } from "fs";
import path from "path";
import type { Item } from "@/lib/db";

/**
 * File-backed store used only when the Cloudflare bindings are absent. It mirrors the D1
 * behaviour, including rejecting a duplicate key, so local testing matches production.
 */
const localDir = path.join(process.cwd(), "data", "collections");

// Serializes read-modify-write cycles per collection so concurrent local requests cannot
// clobber each other.
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(pk: string, work: () => Promise<T>): Promise<T> {
  const previous = locks.get(pk) ?? Promise.resolve();
  const next = previous.then(work, work);
  locks.set(
    pk,
    next.catch(() => undefined),
  );
  return next;
}

async function readCollection(pk: string): Promise<Record<string, Item>> {
  try {
    const raw = await fs.readFile(path.join(localDir, `${pk}.json`), "utf8");
    return JSON.parse(raw) as Record<string, Item>;
  } catch {
    return {};
  }
}

async function writeCollection(pk: string, value: Record<string, Item>) {
  await fs.mkdir(localDir, { recursive: true });
  const target = path.join(localDir, `${pk}.json`);
  // Write to a temp file first so a crash mid-write cannot truncate existing records.
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2));
  await fs.rename(temp, target);
}

export async function getItem(pk: string, sk: string): Promise<Item | null> {
  const collection = await readCollection(pk);
  return collection[sk] ?? null;
}

export async function putItem(item: Item, onlyIfAbsent: boolean): Promise<boolean> {
  return withLock(item.pk, async () => {
    const collection = await readCollection(item.pk);
    if (onlyIfAbsent && collection[item.sk]) return false;
    collection[item.sk] = item;
    await writeCollection(item.pk, collection);
    return true;
  });
}

export async function deleteItem(pk: string, sk: string): Promise<void> {
  await withLock(pk, async () => {
    const collection = await readCollection(pk);
    delete collection[sk];
    await writeCollection(pk, collection);
  });
}

export async function queryItems(pk: string, skPrefix?: string): Promise<Item[]> {
  const collection = await readCollection(pk);
  return Object.values(collection).filter(
    (item) => !skPrefix || item.sk.startsWith(skPrefix),
  );
}

export async function incrementCounter(
  key: string,
  expiresAtSeconds: number,
): Promise<number> {
  return withLock("counters", async () => {
    const collection = await readCollection("counters");
    const nowSeconds = Math.floor(Date.now() / 1000);
    for (const [existing, item] of Object.entries(collection)) {
      if (typeof item.expiresAt === "number" && item.expiresAt < nowSeconds) {
        delete collection[existing];
      }
    }
    const current = Number(collection[key]?.count ?? 0) + 1;
    collection[key] = {
      pk: "counters",
      sk: key,
      count: current,
      expiresAt: expiresAtSeconds,
    };
    await writeCollection("counters", collection);
    return current;
  });
}
