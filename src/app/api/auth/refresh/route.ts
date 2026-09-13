import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Cannot refresh without active session' },
        { status: 401 }
      );
    }

    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role
    });

    const response = NextResponse.json({
      success: true,
      token: newToken
    });

    response.cookies.set('vegimart_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Token refresh failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
