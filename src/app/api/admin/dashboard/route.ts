import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/payments/payment-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'week'; // 'today' | 'week' | 'month'

    const orders = db.getOrders();
    const transactions = db.getTransactions();
    const products = db.getProducts();
    const users = db.getUsers();
    const settings = db.getSettings();

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const periodThreshold =
      period === 'today'
        ? now - oneDay
        : period === 'month'
        ? now - 30 * oneDay
        : now - 7 * oneDay;

    // Filter orders in period
    const periodOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= periodThreshold);
    const paidOrders = periodOrders.filter((o) => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    // Gateway breakdown
    const stripeTxns = transactions.filter((t) => t.gateway === 'stripe' && t.status === 'succeeded');
    const razorpayTxns = transactions.filter((t) => t.gateway === 'razorpay' && t.status === 'succeeded');

    const stripeRevenue = stripeTxns.reduce((sum, t) => sum + t.amount, 0);
    const razorpayRevenue = razorpayTxns.reduce((sum, t) => sum + t.amount, 0);

    // Low stock items
    const lowStockProducts = products.filter((p) => p.stockCount <= 20);

    return NextResponse.json({
      success: true,
      period,
      metrics: {
        totalOrders: periodOrders.length,
        paidOrdersCount: paidOrders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue:
          paidOrders.length > 0 ? Math.round((totalRevenue / paidOrders.length) * 100) / 100 : 0,
        activeUsers: Math.max(users.length, 12),
        lowStockCount: lowStockProducts.length,
        totalProducts: products.length
      },
      gatewayStatus: {
        activeGateway: settings.activeGateway,
        isTestMode: settings.isTestMode,
        stripeRevenue: Math.round(stripeRevenue * 100) / 100,
        razorpayRevenue: Math.round(razorpayRevenue * 100) / 100,
        totalTransactions: transactions.length
      },
      recentOrders: orders.slice(0, 5),
      recentTransactions: transactions.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate dashboard metrics' },
      { status: 500 }
    );
  }
}
