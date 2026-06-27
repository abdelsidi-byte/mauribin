import { NextResponse } from "next/server";
import {
  PHOTOS, getFeaturedPhotos, getLatestPhotos,
  getPopularPhotos, getPhotosByCategory, getPhotoById, type PhotoCategory,
} from "@/lib/photos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "all";
  const category = searchParams.get("category") as PhotoCategory | null;
  const id = searchParams.get("id");
  const limit = parseInt(searchParams.get("limit") || "20");
  const lang = searchParams.get("lang") || "ar";

  // Single photo by id
  if (id) {
    const photo = getPhotoById(id);
    if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    return NextResponse.json({ photo });
  }

  let photos = PHOTOS;

  switch (action) {
    case "featured":
      photos = getFeaturedPhotos();
      break;
    case "latest":
      photos = getLatestPhotos(limit);
      break;
    case "popular":
      photos = getPopularPhotos(limit);
      break;
    case "category":
      if (category) photos = getPhotosByCategory(category);
      break;
  }

  return NextResponse.json({
    photos: photos.slice(0, limit),
    total: photos.length,
    categories: [
      "goals","celebrations","fans","players","goalkeepers",
      "coaches","stadium","training","funny","emotional",
      "trophy","awards","behind-scenes","var","best-saves",
      "historic","opening","closing",
    ],
  });
}
