import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const email = searchParams.get('email');

    let orders = db.getOrders();

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    if (email) {
      orders = orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Orders fetch error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
