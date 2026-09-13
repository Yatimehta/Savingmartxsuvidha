import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/payments/payment-service';
import { Order, OrderItem, ShippingAddress } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      deliverySlot,
      promoCode
    }: {
      customer: ShippingAddress;
      items: OrderItem[];
      deliverySlot: string;
      promoCode?: string;
    } = body;

    if (!customer || !customer.fullName || !customer.email || !customer.addressLine1) {
      return NextResponse.json(
        { success: false, error: 'Customer shipping details are required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart cannot be empty' },
        { status: 400 }
      );
    }

    const settings = db.getSettings();

    // Calculate totals server-side
    let subtotal = 0;
    for (const item of items) {
      const dbProd = db.getProductById(item.productId);
      const price = dbProd ? dbProd.price : item.price;
      subtotal += price * item.quantity;
    }

    let discount = 0;
    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === 'FRESH10') {
        discount = 10.0;
      } else if (code === 'SUVIDHA') {
        discount = settings.deliveryFee;
      } else if (code === 'WELCOME') {
        discount = subtotal * 0.15; // 15% off
      }
    }

    const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
    const tax = Math.round((subtotal - discount) * 0.1 * 100) / 100; // 10% GST
    const total = Math.max(0, Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `VM-${Math.floor(10000 + Math.random() * 90000)}`;

    const activeGateway = paymentService.getActiveGateway();

    // Create pending order record in DB
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      discount: Math.round(discount * 100) / 100,
      tax,
      total,
      status: 'pending',
      paymentGateway: activeGateway,
      paymentStatus: 'pending',
      transactionId: '',
      deliverySlot: deliverySlot || 'Standard Delivery (2-4 hours)',
      estimatedDeliveryDate: 'Today'
    };

    db.createOrder(newOrder);

    // Initialize payment with active gateway
    const paymentInit = await paymentService.initializeOrderPayment({
      orderId,
      orderNumber,
      amount: total,
      currency: activeGateway === 'razorpay' ? 'INR' : 'AUD',
      customer,
      itemsDescription: `${items.length} grocery items from VegiMart × Suvidha`
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      payment: paymentInit
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Order payment initialization failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
