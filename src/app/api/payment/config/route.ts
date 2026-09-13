import { NextResponse } from 'next/server';
import { paymentService } from '@/lib/payments/payment-service';

export async function GET() {
  try {
    const config = paymentService.getPublicConfig();
    return NextResponse.json({ success: true, config });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gateway configuration';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
