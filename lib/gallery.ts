import { r2 } from "@/lib/cloudflare";
import { deleteItem, putItem, queryItems } from "@/lib/db";

export type GalleryItem = {
  id: string;
  filename: string;
  caption: string;
  createdAt: string;
};

const COLLECTION = "gallery";

// Photos are served through an API route rather than from public/, because Next.js only
// serves files that existed in public/ at build time; anything uploaded later would 404.
async function localPhotos() {
  return import("@/lib/gallery-local");
}

export function publicGalleryPath(filename: string) {
  return `/api/gallery/photo/${filename}`;
}

export async function listGallery(): Promise<GalleryItem[]> {
  const items = await queryItems(COLLECTION);
  return items
    .map((item) => ({
      id: String(item.id),
      filename: String(item.filename),
      caption: String(item.caption ?? ""),
      createdAt: String(item.createdAt),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addGalleryItem(item: GalleryItem) {
  await putItem({ pk: COLLECTION, sk: item.id, ...item });
}

export async function removeGalleryItem(id: string) {
  await deleteItem(COLLECTION, id);
}

export async function putPhoto(
  filename: string,
  body: Uint8Array,
  contentType: string,
) {
  const bucket = await r2();
  if (!bucket) return (await localPhotos()).writePhoto(filename, body);

  await bucket.put(`gallery/${filename}`, body, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
}

export async function getPhoto(filename: string): Promise<Uint8Array | null> {
  const bucket = await r2();
  if (!bucket) return (await localPhotos()).readPhoto(filename);

  const object = await bucket.get(`gallery/${filename}`);
  if (!object) return null;
  return new Uint8Array(await object.arrayBuffer());
}

export async function deletePhoto(filename: string) {
  const bucket = await r2();
  if (!bucket) return (await localPhotos()).removePhoto(filename);

  await bucket.delete(`gallery/${filename}`);
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function extensionForType(type: string) {
  return ALLOWED_TYPES[type];
}

const TYPES_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function typeForFilename(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  return TYPES_BY_EXTENSION[extension];
}
