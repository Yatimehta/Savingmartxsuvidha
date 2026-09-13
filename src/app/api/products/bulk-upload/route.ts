import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product, ProductCategory } from '@/types';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let rawCsv = '';
    let rawProductsList: any[] = [];

    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.csvData) {
        rawCsv = body.csvData;
      } else if (Array.isArray(body.products)) {
        rawProductsList = body.products;
      } else {
        return NextResponse.json(
          { success: false, error: 'Provide either csvData string or products array' },
          { status: 400 }
        );
      }
    } else if (contentType.includes('text/csv')) {
      rawCsv = await req.text();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      if (file && typeof file === 'object' && 'text' in file) {
        rawCsv = await (file as Blob).text();
      } else {
        return NextResponse.json(
          { success: false, error: 'No CSV file found in form data' },
          { status: 400 }
        );
      }
    }

    if (rawCsv) {
      const lines = rawCsv.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        return NextResponse.json(
          { success: false, error: 'CSV file must have headers and at least one row' },
          { status: 400 }
        );
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 2) continue;

        const row: Record<string, string> = {};
        headers.forEach((h, index) => {
          row[h] = values[index] || '';
        });

        rawProductsList.push({
          name: row.name || `Product ${i}`,
          category: (row.category as ProductCategory) || 'vegetables',
          price: parseFloat(row.price) || 4.99,
          unit: row.unit || 'per kg',
          stockCount: parseInt(row.stock || row.stockcount, 10) || 30,
          origin: row.origin || 'Victoria, Australia',
          isOrganic: row.organic === 'true' || row.organic === '1' || row.isorganic === 'true',
          description: row.description || `${row.name} fresh produce.`,
          image: row.image || row.imageurl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
        });
      }
    }

    if (rawProductsList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid products could be parsed' },
        { status: 400 }
      );
    }

    const inserted: Product[] = [];
    for (const item of rawProductsList) {
      const name = item.name || 'Fresh Produce';
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const category: ProductCategory = item.category || 'vegetables';
      const categoryName =
        category === 'fruits'
          ? 'Fresh Fruits'
          : category === 'vegetables'
          ? 'Fresh Vegetables'
          : category === 'suvidha-cafe'
          ? 'Suvidha Cafe & Grocery'
          : category === 'dairy-bakery'
          ? 'Dairy & Bakery'
          : 'Pantry Essentials';

      const stockCount = item.stockCount || item.stock || 30;

      const newProduct: Product = {
        id: `prod-bulk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        category,
        categoryName,
        price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 4.99,
        unit: item.unit || 'per kg',
        rating: 4.8,
        reviewsCount: Math.floor(12 + Math.random() * 40),
        inStock: stockCount > 0,
        stockCount,
        origin: item.origin || 'Victoria, Australia',
        freshnessBadge: item.isOrganic ? 'Certified Organic' : 'Farm Direct Harvest',
        dietary: item.isOrganic ? ['Organic', 'Australian Grown'] : ['Australian Grown', 'Fresh'],
        description: item.description || `Premium quality ${name} sourced directly from local producers.`,
        nutrition: {
          servingSize: '100g',
          calories: '45 kcal',
          protein: '1.2g',
          carbs: '8.5g',
          fat: '0.2g'
        },
        image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        isOrganic: Boolean(item.isOrganic)
      };

      db.saveProduct(newProduct);
      inserted.push(newProduct);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded and added ${inserted.length} products`,
      count: inserted.length,
      products: inserted
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Bulk upload failed' },
      { status: 500 }
    );
  }
}
