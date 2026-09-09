import { promises as fs } from "fs";
import path from "path";

/** Photo storage used only when the R2 binding is absent, i.e. local development. */
const localPhotoDir = path.join(process.cwd(), "data", "uploads", "gallery");

export async function writePhoto(filename: string, body: Uint8Array) {
  await fs.mkdir(localPhotoDir, { recursive: true });
  await fs.writeFile(path.join(localPhotoDir, filename), body);
}

export async function readPhoto(filename: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await fs.readFile(path.join(localPhotoDir, filename)));
  } catch {
    return null;
  }
}

export async function removePhoto(filename: string) {
  await fs.unlink(path.join(localPhotoDir, filename)).catch(() => undefined);
}
