import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = body.amount;

    const order = await getRazorpay().orders.create({
      amount,
      currency: "USD",
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
