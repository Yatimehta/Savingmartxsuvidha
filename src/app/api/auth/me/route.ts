import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, signToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = db.getUserById(payload.userId) || db.getUserByEmail(payload.email);
    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses
        }
      });
    }

    // Fallback payload
    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
