'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Check, Star, Sparkles, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center group">
        {/* Image Container */}
        <Link
          href={`/product/${product.id}`}
          className="relative w-full sm:w-44 h-40 rounded-xl overflow-hidden bg-gray-50 shrink-0 block"
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <span className="absolute top-2 left-2 bg-vegimart-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 w-full space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-vegimart-green bg-green-50 px-2 py-0.5 rounded-md">
              {product.categoryName}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              {product.origin}
            </span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-gray-900 text-base group-hover:text-vegimart-green transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 text-xs pt-1">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">({product.reviewsCount} reviews)</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-700 font-medium">{product.freshnessBadge}</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">{product.unit}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-xl border transition-colors ${
                isInWishlist
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-vegimart-green hover:bg-green-800 text-white shadow-xs hover:shadow-md'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col justify-between group relative">
      {/* Top Badges */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Discount tag */}
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-vegimart-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Save ${(product.originalPrice - product.price).toFixed(2)}
          </span>
        )}

        {/* Category / Suvidha tag */}
        {product.category === 'suvidha-cafe' && (
          <span className="absolute bottom-2 left-2 bg-orange-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" /> Suvidha Cafe
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
            isInWishlist
              ? 'bg-white text-rose-500'
              : 'bg-white/85 text-gray-400 hover:text-rose-500'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-vegimart-green uppercase tracking-wide text-[10px]">
              {product.categoryName}
            </span>
            <span className="truncate max-w-[120px] text-gray-400">{product.origin}</span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-vegimart-green transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {product.freshnessBadge}
          </p>
        </div>

        {/* Rating & Dietary tags */}
        <div className="flex items-center gap-1.5 text-xs pt-1">
          <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400 text-[11px]">({product.reviewsCount})</span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight">{product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              added
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-vegimart-green hover:bg-green-800 text-white shadow-xs hover:shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
