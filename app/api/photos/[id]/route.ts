import { NextResponse } from "next/server";
import { getPhotoById, getRelatedPhotos } from "@/lib/photos";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = getPhotoById(id);
  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }
  const related = getRelatedPhotos(photo, 4);
  return NextResponse.json({ photo, related });
}
