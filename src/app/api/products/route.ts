import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let products = db.getProducts();

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.dietary.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      categoryName,
      price,
      originalPrice,
      unit,
      stockCount,
      origin,
      freshnessBadge,
      dietary,
      description,
      image,
      isFeatured,
      isOrganic
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      slug,
      category,
      categoryName: categoryName || 'Fresh Produce',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      unit: unit || 'each',
      rating: 5.0,
      reviewsCount: 1,
      inStock: Number(stockCount) > 0,
      stockCount: Number(stockCount) || 10,
      origin: origin || 'Victoria, Australia',
      freshnessBadge: freshnessBadge || 'Fresh Farm Pick',
      dietary: Array.isArray(dietary) ? dietary : ['Fresh'],
      description: description || 'Fresh high-quality produce from VegiMart × Suvidha.',
      nutrition: {
        servingSize: '100g',
        calories: '45 kcal',
        protein: '1.2g',
        carbs: '8g',
        fat: '0.2g'
      },
      image: image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      isFeatured: Boolean(isFeatured),
      isOrganic: Boolean(isOrganic)
    };

    db.saveProduct(newProduct);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
