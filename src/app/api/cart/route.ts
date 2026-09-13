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

// GET /api/cart - Return user or guest cart
export async function GET(req: NextRequest) {
  try {
    const ownerId = getCartOwnerId(req);
    const cart = db.getCart(ownerId);

    // Calculate subtotal and populate product details
    const populatedItems = cart.items.map((item) => {
      const product = db.getProductById(item.productId);
      return {
        ...item,
        product: product || null
      };
    });

    const subtotal = populatedItems.reduce(
      (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
      0
    );

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        items: populatedItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const ownerId = getCartOwnerId(req);
    const body = await req.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = db.getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const cart = db.getCart(ownerId);
    const existingIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        unit: product.unit,
        quantity: Math.max(1, quantity),
        image: product.image
      });
    }

    cart.updatedAt = new Date().toISOString();
    db.saveCart(cart);

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    const ownerId = getCartOwnerId(req);
    db.clearCart(ownerId);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
