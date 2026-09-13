import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

function getCartOwnerId(req: NextRequest): string {
  const user = getUserFromRequest(req);
  if (user) return user.userId;
  const headerSession = req.headers.get('x-cart-session');
  if (headerSession) return `guest_${headerSession}`;
  const cookieSession = req.cookies.get('cart_session')?.value;
  if (cookieSession) return `guest_${cookieSession}`;
  return 'guest_default_session';
}

// PUT /api/cart/[itemId] - Update item quantity
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const ownerId = getCartOwnerId(req);
    const body = await req.json();
    const { quantity } = body;

    if (quantity === undefined || typeof quantity !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Valid quantity number is required' },
        { status: 400 }
      );
    }

    const cart = db.getCart(ownerId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    db.saveCart(cart);

    return NextResponse.json({
      success: true,
      message: quantity <= 0 ? 'Item removed from cart' : 'Cart updated',
      cart
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove specific item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const ownerId = getCartOwnerId(req);
    const cart = db.getCart(ownerId);

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== itemId);

    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.updatedAt = new Date().toISOString();
    db.saveCart(cart);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove item' },
      { status: 500 }
    );
  }
}
