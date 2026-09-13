import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/payments/payment-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, currency, customer, itemsDescription } = body;

    let targetOrder = orderId ? db.getOrderById(orderId) : null;
    const finalAmount = targetOrder ? targetOrder.total : (amount || 10.0);
    const finalOrderId = targetOrder ? targetOrder.id : (orderId || `ord-${Date.now()}`);
    const finalOrderNumber = targetOrder ? targetOrder.orderNumber : `VM-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalCustomer = targetOrder ? targetOrder.customer : (customer || {
      fullName: 'Customer',
      email: 'customer@vegimartsuvidha.com.au',
      phone: '0400000000',
      addressLine1: 'Market Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000'
    });

    const activeGateway = paymentService.getActiveGateway();
    const targetCurrency = currency || (activeGateway === 'razorpay' ? 'INR' : 'AUD');

    const paymentInit = await paymentService.initializeOrderPayment({
      orderId: finalOrderId,
      orderNumber: finalOrderNumber,
      amount: finalAmount,
      currency: targetCurrency,
      customer: finalCustomer,
      itemsDescription: itemsDescription || `Order ${finalOrderNumber} VegiMart × Suvidha`
    });

    return NextResponse.json({
      success: true,
      activeGateway,
      clientSecret: paymentInit.clientSecret,
      gatewayOrderId: paymentInit.gatewayOrderId,
      amount: paymentInit.amount,
      currency: paymentInit.currency,
      keyId: paymentInit.keyId,
      isTestMode: paymentInit.isTestMode
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
