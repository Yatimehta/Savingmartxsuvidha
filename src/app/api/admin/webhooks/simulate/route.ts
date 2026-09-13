import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PaymentGatewayType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gateway, event }: { gateway: PaymentGatewayType; event?: string } = body;

    const targetGateway = gateway || 'stripe';
    const targetEvent = event || (targetGateway === 'stripe' ? 'payment_intent.succeeded' : 'payment.captured');

    const simulatedId = targetGateway === 'stripe' ? `pi_sim_${Date.now()}` : `pay_sim_${Date.now()}`;
    const payload = {
      id: simulatedId,
      entity: 'event',
      event: targetEvent,
      gateway: targetGateway,
      simulated: true,
      data: {
        object: {
          id: simulatedId,
          amount: 3250,
          currency: targetGateway === 'stripe' ? 'aud' : 'inr',
          status: 'succeeded'
        }
      }
    };

    const webhookLog = db.recordWebhook({
      id: `wh_${targetGateway}_sim_${Date.now()}`,
      gateway: targetGateway,
      event: targetEvent,
      payload,
      receivedAt: new Date().toISOString(),
      status: 'processed'
    });

    return NextResponse.json({
      success: true,
      message: `Simulated ${targetGateway.toUpperCase()} webhook processed successfully`,
      webhook: webhookLog
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to simulate webhook';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
