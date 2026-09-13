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
  Share2
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/products/ProductCard';

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
        <div className="w-12 h-12 border-4 border-vegimart-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
          className="inline-flex items-center gap-2 bg-vegimart-green text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-vegimart-green">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-vegimart-green">Catalog</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.category}`} className="hover:text-vegimart-green">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white border border-gray-200/80 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <span className="absolute top-4 left-4 bg-vegimart-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Special • Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isInWishlist ? 'bg-white text-rose-500' : 'bg-white/80 text-gray-600 hover:text-rose-500'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Origin</span>
              <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{product.origin}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Freshness</span>
              <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">{product.freshnessBadge}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Availability</span>
              <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
                {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-green-50 text-vegimart-green text-xs font-bold rounded-lg uppercase tracking-wider">
                {product.categoryName}
              </span>
              {product.category === 'suvidha-cafe' && (
                <span className="px-2.5 py-1 bg-orange-50 text-vegimart-orange text-xs font-bold rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Suvidha Specialty
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-amber-900">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">Based on {product.reviewsCount} verified customer ratings</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Price {product.unit} (incl. GST)</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {product.inStock ? '✓ Ready to pack' : 'Temporarily Out of Stock'}
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-2xl bg-white p-1 shadow-inner">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-vegimart-green hover:bg-green-800 text-white hover:scale-[1.01]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add {(quantity * product.price).toLocaleString('en-US', { style: 'currency', currency: 'AUD' })} to Cart
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <Truck className="w-4 h-4 text-vegimart-orange" />
              Order in the next <strong>45 mins</strong> for today&apos;s morning slot delivery.
            </p>
          </div>

          {/* Dietary Tags */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Highlights</span>
            <div className="flex flex-wrap gap-2">
              {product.dietary.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Nutrition, Reviews */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-8 border-b border-gray-200 text-sm font-bold">
          <button
            onClick={() => setSelectedTab('details')}
            className={`pb-3 transition-colors relative ${
              selectedTab === 'details'
                ? 'text-vegimart-green border-b-2 border-vegimart-green'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Produce Story & Description
          </button>
          <button
            onClick={() => setSelectedTab('nutrition')}
            className={`pb-3 transition-colors relative ${
              selectedTab === 'nutrition'
                ? 'text-vegimart-green border-b-2 border-vegimart-green'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Nutritional Information
          </button>
          <button
            onClick={() => setSelectedTab('reviews')}
            className={`pb-3 transition-colors relative ${
              selectedTab === 'reviews'
                ? 'text-vegimart-green border-b-2 border-vegimart-green'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Verified Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        {selectedTab === 'details' && (
          <div className="space-y-4 max-w-3xl text-sm text-gray-600 leading-relaxed">
            <p>{product.description}</p>
            <div className="p-4 bg-green-50/60 rounded-2xl border border-green-100 space-y-2">
              <h4 className="font-bold text-vegimart-green text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> VegiMart Quality Pledge
              </h4>
              <p className="text-xs text-emerald-950">
                If this produce doesn&apos;t meet your standard of crispness and taste, message us on WhatsApp or in your customer dashboard for an instant refund or replacement with your next order.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'nutrition' && (
          <div className="max-w-xl space-y-4">
            <p className="text-xs text-gray-500">Per Serving: <strong>{product.nutrition.servingSize}</strong></p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Energy</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{product.nutrition.calories}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Protein</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{product.nutrition.protein}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Carbs</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{product.nutrition.carbs}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Fat</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{product.nutrition.fat}</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="space-y-4 max-w-2xl">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">David M. (Verified Buyer)</span>
                <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /></div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Super fresh and tasted ten times better than the supermarket stuff. Delivery arrived right on the 9am slot.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">Pooja K. (Verified Buyer)</span>
                <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /></div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Loved ordering the fresh produce together with the Suvidha cafe snacks! Such a convenient combined store.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6">
          <h3 className="text-2xl font-black text-gray-900">Pairs Well With This Harvest</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
