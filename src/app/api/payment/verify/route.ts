import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payments/payment-service';
import { db } from '@/lib/db';
import { PaymentGatewayType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gateway,
      orderId,
      orderNumber,
      amount,
      paymentIntentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentMethod
    }: {
      gateway: PaymentGatewayType;
      orderId: string;
      orderNumber: string;
      amount: number;
      paymentIntentId?: string;
      razorpayPaymentId?: string;
      razorpayOrderId?: string;
      razorpaySignature?: string;
      paymentMethod?: string;
    } = body;

    if (!orderId || !gateway) {
      return NextResponse.json(
        { success: false, error: 'orderId and gateway are required' },
        { status: 400 }
      );
    }

    const verification = await paymentService.verifyAndFinalizePayment({
      gateway,
      orderId,
      orderNumber,
      amount,
      paymentIntentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentMethod
    });

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.message || 'Payment verification failed' },
        { status: 400 }
      );
    }

    const updatedOrder = db.getOrderById(orderId);

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      verification,
      order: updatedOrder
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Verification process error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
