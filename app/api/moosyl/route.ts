import { NextRequest, NextResponse } from "next/server";

const MOOSYL_API_URL = "https://api.moosyl.com/v1";
const MOOSYL_API_KEY = process.env.MOOSYL_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const { amount, phone, service, description, planId } = await request.json();

    if (!amount || !phone) {
      return NextResponse.json({ error: "Missing amount or phone" }, { status: 400 });
    }

    if (!MOOSYL_API_KEY) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    // Generate unique transaction ID
    const transactionId = `mauribin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment request via Moosyl
    const payload = {
      amount: Math.round(amount), // Amount in MRU (smallest unit)
      transactionId,
      ...(service && { paymentMethod: service }), // bankily, sedad, masrivi
      ...(description && { description }),
      webhookUrl: `${process.env.NEXT_PUBLIC_URL || "https://mauribin.vercel.app"}/api/webhooks/moosyl`,
      returnUrl: `${process.env.NEXT_PUBLIC_URL || "https://mauribin.vercel.app"}/payment/success?tx=${transactionId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL || "https://mauribin.vercel.app"}/payment?cancelled=true`,
      customer: {
        phone: phone.startsWith("222") ? phone : `222${phone}`,
      },
      metadata: {
        source: "mauribin_web",
        plan: planId || "vip",
      },
    };

    const response = await fetch(`${MOOSYL_API_URL}/payment-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MOOSYL_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Moosyl error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      transactionId,
      // If Moosyl returns a payment URL, use it
      paymentUrl: data.paymentUrl || data.checkoutUrl || null,
      message: "Payment request created",
    });
  } catch (error) {
    console.error("Moosyl error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transaction_id");

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
    }

    if (!MOOSYL_API_KEY) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    // Check transaction status via API
    const response = await fetch(`${MOOSYL_API_URL}/payment-request/${transactionId}`, {
      headers: {
        Authorization: MOOSYL_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Moosyl status error:", error);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}