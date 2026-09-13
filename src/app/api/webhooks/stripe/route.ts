import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { StripeGatewayAdapter } from '@/lib/payments/stripe-adapter';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('stripe-signature') || undefined;

    const adapter = new StripeGatewayAdapter();
    const result = await adapter.handleWebhook(payload, signature);

    db.recordWebhook({
      id: `wh_stripe_${Date.now()}`,
      gateway: 'stripe',
      event: result.event,
      payload,
      receivedAt: new Date().toISOString(),
      status: result.handled ? 'processed' : 'ignored'
    });

    if (result.orderId && result.handled) {
      const order = db.getOrderById(result.orderId);
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.status = 'processing';
      }
    }

    return NextResponse.json({ received: true, event: result.event });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Stripe webhook error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
