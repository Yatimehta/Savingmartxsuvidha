import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = db.getProductById(id) || db.getProductBySlug(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Product fetch error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = db.getProductById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();
    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      inStock: (body.stockCount !== undefined ? Number(body.stockCount) : existing.stockCount) > 0
    };

    db.saveProduct(updated);
    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Product update error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Product delete error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
