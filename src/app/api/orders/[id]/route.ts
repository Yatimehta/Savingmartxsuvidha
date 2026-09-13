import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Order fetch error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status }: { status: OrderStatus } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updated = db.updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Order status update error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
