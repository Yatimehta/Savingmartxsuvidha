import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/payments/payment-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, gateway, paymentId, signature, razorpayOrderId, amount } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = db.getOrderById(orderId);
    const targetGateway = gateway || (order ? order.paymentGateway : paymentService.getActiveGateway());
    const finalAmount = amount || (order ? order.total : 0);
    const finalOrderNumber = orderNumber || (order ? order.orderNumber : orderId);

    const verification = await paymentService.verifyAndFinalizePayment({
      gateway: targetGateway,
      orderId,
      orderNumber: finalOrderNumber,
      amount: finalAmount,
      paymentIntentId: targetGateway === 'stripe' ? (paymentId || `pi_mock_${Date.now()}`) : undefined,
      razorpayPaymentId: targetGateway === 'razorpay' ? (paymentId || `pay_mock_${Date.now()}`) : undefined,
      razorpaySignature: signature,
      razorpayOrderId
    });

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.message || 'Payment confirmation failed' },
        { status: 400 }
      );
    }

    const updatedOrder = db.getOrderById(orderId);

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
      transactionId: verification.transactionId,
      paymentMethod: verification.paymentMethod,
      order: updatedOrder
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}
