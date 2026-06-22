import { NextResponse } from "next/server";
import { GROUP_STANDINGS } from "@/lib/standings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ standings: GROUP_STANDINGS });
}
