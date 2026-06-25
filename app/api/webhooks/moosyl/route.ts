import { NextRequest, NextResponse } from "next/server";

// Moosyl webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-signature");

    // Verify HMAC signature (when secret key is configured)
    const secretKey = process.env.MOOSYL_WEBHOOK_SECRET;
    if (secretKey && signature) {
      const crypto = await import("crypto");
      const expectedSig = crypto.createHmac("sha256", secretKey).update(JSON.stringify(body)).digest("hex");
      if (signature !== expectedSig) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const { event, data } = body;

    switch (event) {
      case "payment-created":
      case "payment-request-created":
        console.log(`[Moosyl] Payment initiated: ${data?.transaction_id}`);
        break;

      case "payment-updated":
      case "payment-request-updated":
        if (data?.status === "completed" || data?.status === "paid") {
          console.log(`[Moosyl] ✅ Payment completed: ${data.transaction_id}`);
          // TODO: Activate VIP subscription in database
          // await activateVIPSubscription(data.customer_id, data.plan);
        }
        break;

      default:
        console.log(`[Moosyl] Unknown event: ${event}`, data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Moosyl] Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
