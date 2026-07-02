import { NextRequest, NextResponse } from "next/server";
import { removeSubscriptionById } from "@/lib/notifications-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const removed = removeSubscriptionById(id);

    return NextResponse.json({
      success: removed,
      message: removed ? "Unsubscribed" : "Subscription not found",
    });
  } catch (error) {
    console.error("[Push Unsubscribe Error]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}