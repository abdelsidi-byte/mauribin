import { NextRequest, NextResponse } from "next/server";
import { saveSubscription, type PushSubscription, type NotificationPreferences } from "@/lib/notifications-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, preferences } = body as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
      preferences?: Partial<NotificationPreferences>;
    };

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    // Generate ID from endpoint hash
    const id = Buffer.from(subscription.endpoint).toString("base64").slice(0, 32);

    // Default preferences
    const defaultPrefs: NotificationPreferences = {
      matchStarting: true,
      goalScored: true,
      redCard: true,
      matchEnded: false,
      favoriteTeams: [],
      competitions: ["FIFA World Cup 2026"],
    };

    const sub: PushSubscription = {
      id,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userAgent: req.headers.get("user-agent") || undefined,
      createdAt: new Date().toISOString(),
      preferences: { ...defaultPrefs, ...preferences },
    };

    saveSubscription(sub);

    return NextResponse.json({
      success: true,
      id,
      message: "Subscribed to notifications",
    });
  } catch (error) {
    console.error("[Push Subscribe Error]", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}