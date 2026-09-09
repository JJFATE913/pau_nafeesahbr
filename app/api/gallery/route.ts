import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import {
  addGalleryItem,
  deletePhoto,
  extensionForType,
  listGallery,
  publicGalleryPath,
  putPhoto,
  removeGalleryItem,
  type GalleryItem,
} from "@/lib/gallery";

export async function GET() {
  const items = await listGallery();
  return NextResponse.json({
    items: items.map((item) => ({
      ...item,
      url: publicGalleryPath(item.filename),
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Please sign in to update the gallery." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  const captionValue = formData.get("caption");
  const caption = typeof captionValue === "string" ? captionValue.trim().slice(0, 120) : "";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a photo." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Photos must be 8 MB or smaller." }, { status: 400 });
  }
  const extension = extensionForType(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Use a JPG, PNG, or WEBP photo." }, { status: 400 });
  }

  const filename = `${randomUUID()}.${extension}`;
  await putPhoto(filename, new Uint8Array(await file.arrayBuffer()), file.type);

  const item: GalleryItem = {
    id: randomUUID(),
    filename,
    caption,
    createdAt: new Date().toISOString(),
  };
  await addGalleryItem(item);
  return NextResponse.json({ ok: true, item: { ...item, url: publicGalleryPath(filename) } });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Please sign in to update the gallery." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing photo." }, { status: 400 });
  }

  const items = await listGallery();
  const target = items.find((item) => item.id === id);
  if (!target) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  await removeGalleryItem(id);
  await deletePhoto(target.filename);
  return NextResponse.json({ ok: true });
}
