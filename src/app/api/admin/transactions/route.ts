import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/transactions - List transactions with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gateway = searchParams.get('gateway');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    let txns = db.getTransactions();

    if (gateway && gateway !== 'all') {
      txns = txns.filter((t) => t.gateway === gateway);
    }
    if (status && status !== 'all') {
      txns = txns.filter((t) => t.status === status);
    }
    if (search) {
      txns = txns.filter(
        (t) =>
          t.id.toLowerCase().includes(search) ||
          t.orderNumber.toLowerCase().includes(search) ||
          t.gatewayTransactionId.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: txns.length,
      transactions: txns
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/transactions - Trigger a simulated refund for a transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, reason } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const refunded = db.refundTransaction(transactionId, reason || 'Admin triggered refund');

    if (!refunded) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found or could not be refunded' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction refunded and order cancelled successfully',
      transaction: refunded
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to refund transaction' },
      { status: 500 }
    );
  }
}
