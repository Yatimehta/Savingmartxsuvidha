'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/products/ProductCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'nutrition' | 'reviews'>('details');

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => (product ? s.isInWishlist(product.id) : false));

  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          // Fetch related items
          fetch(`/api/products?category=${data.product.category}`)
            .then((r) => r.json())
            .then((relData) => {
              if (relData.products) {
                setRelated(relData.products.filter((p: Product) => p.id !== data.product.id).slice(0, 4));
              }
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading harvest produce details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-sm text-gray-500">The grocery item you are looking for may be sold out or unavailable.</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountAmount = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice - product.price 
    : 0;
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 bg-[#FFFBF0] text-left">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#1B5E20]">Grocerz Catalog</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.categorySlug || 'all'}`} className="hover:text-[#1B5E20]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout (60% Left Gallery / 40% Right Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery (60% width) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 rounded-[8px] overflow-hidden bg-white border border-[#E0E0E0] p-4 flex items-center justify-center">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={600}
              height={450}
              priority={true}
              className="max-h-full max-w-full object-contain"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#FFC107] text-[#1A1A1A] text-xs font-black px-2.5 py-1 rounded-[4px] shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                SAVE {discountPercent}% (${discountAmount.toFixed(2)} AUD)
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 p-2 rounded-[6px] bg-white/90 backdrop-blur-xs border border-gray-200 transition-all ${
                isInWishlist ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 bg-white rounded-[6px] border border-[#E0E0E0] text-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Source</span>
              <p className="text-xs font-bold text-[#1B5E20] truncate mt-0.5">Grocerz.com.au</p>
            </div>
            <div className="p-2.5 bg-white rounded-[6px] border border-[#E0E0E0] text-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Brand</span>
              <p className="text-xs font-bold text-[#1A1A1A] truncate mt-0.5">{product.brand || 'Grocerz'}</p>
            </div>
            <div className="p-2.5 bg-white rounded-[6px] border border-[#E0E0E0] text-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Availability</span>
              <div className="flex items-center justify-center gap-1 text-xs font-black text-[#1A1A1A] truncate mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] inline-block shrink-0" />
                {product.inStock ? `${product.stockCount || 25} in stock` : 'Out of Stock'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Details (40% width) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#C8E6C9] text-[#1B5E20] text-[11px] font-bold rounded-[4px]">
                {product.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">Verified Grocerz Australia Listing</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1B5E20] leading-snug">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1 bg-[#FFF9C4] px-2.5 py-0.5 rounded-[4px] border border-[#FFC107] font-extrabold text-[#1A1A1A]">
                <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviewsCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 rounded-[6px] bg-white border border-[#E0E0E0] flex items-baseline justify-between shadow-2xs">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FF6F00]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm bg-[#FFF9C4] px-1.5 py-0.5 rounded text-gray-700 font-semibold line-through border border-[#FFC107]/40">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-extrabold bg-[#FFC107] text-[#1A1A1A] px-2 py-0.5 rounded-full shadow-2xs">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">Unit: {product.unit} (AUD)</p>
            </div>

            <span className="px-2 py-1 rounded-[4px] text-xs font-extrabold bg-[#FFF9C4] text-[#1A1A1A] border border-[#FFC107] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
              In Stock & Ready
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-200 focus-within:border-[#FFC107] focus-within:ring-2 focus-within:ring-[#FFC107]/40 rounded-[6px] bg-white p-1 transition-all">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-[4px]"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-black text-sm text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-[4px]"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-[45px] px-5 rounded-[6px] font-extrabold text-sm flex items-center justify-center gap-2 transition-all text-white border-2 border-[#FFC107] shadow-[0_0_12px_rgba(255,193,7,0.3)] ${
                  added
                    ? 'bg-[#1B5E20] border-[#1B5E20]'
                    : 'bg-[#FF6F00] hover:bg-[#E65100] hover:shadow-[0_0_18px_rgba(255,193,7,0.45)] hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add ${(quantity * product.price).toFixed(2)} AUD to Cart
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-600 flex items-center gap-1.5 pt-1">
              <Truck className="w-3.5 h-3.5 text-[#FF6F00]" />
              Order in the next <strong>45 mins</strong> for today&apos;s express slot.
            </p>
          </div>

          {/* Authentic Description & Details */}
          <div className="space-y-3 pt-3 border-t border-[#E0E0E0]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products - Organic Horizontal Scroll */}
      {related.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#E0E0E0]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1B5E20]">Related Grocerz Products</h3>
            <Link href={`/catalog?category=${product.categorySlug || 'all'}`} className="text-xs font-bold text-[#FF6F00] hover:underline">
              Explore More
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
            {related.map((rel) => (
              <div key={rel.id} className="min-w-[240px] max-w-[240px] shrink-0">
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
