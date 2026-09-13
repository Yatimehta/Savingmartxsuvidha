import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      // Demo fallback: Allow pre-configured test logins effortlessly
      if (email === 'sarah.j@example.com' && password === 'password123') {
        const token = signToken({
          userId: 'usr_sarah',
          email: 'sarah.j@example.com',
          name: 'Sarah Jenkins',
          role: 'customer'
        });
        const res = NextResponse.json({
          success: true,
          message: 'Logged in successfully',
          user: { id: 'usr_sarah', email: 'sarah.j@example.com', name: 'Sarah Jenkins', role: 'customer' },
          token
        });
        res.cookies.set('vegimart_token', token, { httpOnly: true, maxAge: 3600 });
        return res;
      }

      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'customer'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token
    });

    response.cookies.set('vegimart_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
