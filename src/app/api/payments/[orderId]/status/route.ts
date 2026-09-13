import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = db.getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const transactions = db.getTransactions().filter(
      (t) => t.orderId === order.id || t.orderNumber === order.orderNumber
    );

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentGateway: order.paymentGateway,
      transactionId: order.transactionId,
      total: order.total,
      currency: order.paymentGateway === 'razorpay' ? 'INR' : 'AUD',
      createdAt: order.createdAt,
      transactions
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve order status' },
      { status: 500 }
    );
  }
}
