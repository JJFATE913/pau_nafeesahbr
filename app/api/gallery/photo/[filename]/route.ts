import { NextResponse } from "next/server";
import { getPhoto, typeForFilename } from "@/lib/gallery";

const SAFE_FILENAME = /^[a-zA-Z0-9-]+\.(jpg|png|webp)$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const contentType = typeForFilename(filename);
  if (!SAFE_FILENAME.test(filename) || !contentType) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const file = await getPhoto(filename);
  if (!file) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
