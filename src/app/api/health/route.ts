import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const startTime = Date.now();

export async function GET() {
  try {
    const memory = process.memoryUsage();
    const productsCount = db.getProducts().length;
    const settings = db.getSettings();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    return NextResponse.json({
      status: 'healthy',
      service: 'VegiMart × Suvidha',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || 'production',
      activeGateway: settings.activeGateway,
      catalogSize: productsCount,
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024))
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message || 'Service check failed'
    }, { status: 503 });
  }
}
