'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Check, Star, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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

  // List view
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-[8px] border border-[#E0E0E0] p-4 hover:bg-[#FFF9C4]/40 hover:border-b-4 hover:border-b-[#FFC107] hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center group">
        {/* Image Container */}
        <Link
          href={`/product/${product.id}`}
          className="relative w-full sm:w-44 h-36 rounded-[6px] overflow-hidden bg-[#FFFBF0] shrink-0 block border border-gray-100"
        >
          <OptimizedImage
            src={product.image}
            alt={product.name}
            className="w-full h-full p-2 group-hover:scale-105 transition-transform duration-200"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-2 left-2 bg-[#FFC107] text-[#1A1A1A] text-[10px] font-extrabold px-2 py-0.5 rounded-[4px] shadow-2xs border border-amber-300">
              SAVE ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 w-full space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#1B5E20] bg-[#C8E6C9] px-2 py-0.5 rounded-[4px]">
              {product.category || 'Grocerz'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FF6F00]" />
              Grocerz Australia
            </span>
            <span className="text-[10px] font-extrabold bg-[#FFC107] text-[#1A1A1A] px-1.5 py-0.2 rounded-[4px]">
              ✓ In Stock
            </span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-[#1A1A1A] text-base group-hover:text-[#1B5E20] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 text-xs pt-1">
            <div className="flex items-center gap-1 text-[#FF6F00] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
              <span className="text-gray-800 font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">({product.reviewsCount} verified reviews)</span>
          </div>
        </div>

        {/* Pricing and Action with Yellow highlight */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
          <div className="text-left sm:text-right bg-[#FFF9C4]/70 px-3 py-1.5 rounded-[6px] border border-[#FFC107]/40">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-2xl font-black text-[#FF6F00]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 font-bold">{product.unit}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-[6px] border transition-colors ${
                isInWishlist
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-gray-300 text-gray-400 hover:text-rose-500'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-[6px] font-bold text-xs flex items-center gap-1.5 transition-all text-white ${
                added
                  ? 'bg-[#1B5E20]'
                  : 'bg-[#FF6F00] hover:bg-[#E65100] hover:-translate-y-0.5 shadow-xs'
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
    <div className="bg-white rounded-[8px] border border-[#E0E0E0] px-4 py-3.5 hover:bg-[#FFF9C4]/30 hover:border-b-4 hover:border-b-[#FFC107] hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group relative text-left">
      {/* Top Badges & Image */}
      <div className="relative w-full aspect-4/3 rounded-[6px] overflow-hidden bg-[#FFFBF0] mb-2.5 border border-gray-100/80">
        <Link href={`/product/${product.id}`} className="block w-full h-full p-2">
          <OptimizedImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Yellow Stock indicator badge top-right */}
        <span className="absolute top-2 right-2 bg-[#FFC107] text-[#1A1A1A] border border-amber-400 text-[10px] font-black px-2 py-0.5 rounded-[4px] shadow-2xs">
          IN STOCK
        </span>

        {/* Yellow Discount tag top-left */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 bg-[#FFC107] text-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-[4px] shadow-2xs border border-amber-300">
            SAVE ${(product.originalPrice - product.price).toFixed(2)}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-2 right-2 p-1.5 rounded-[6px] bg-white/90 border border-gray-200 shadow-2xs transition-transform active:scale-95 ${
            isInWishlist
              ? 'text-rose-500'
              : 'text-gray-400 hover:text-rose-500'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content - Left Aligned */}
      <div className="space-y-1 flex-1 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-0.5">
            <span className="font-extrabold text-[#1B5E20] text-[11px] tracking-tight">
              {product.brand || 'Grocerz'}
            </span>
            <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-1.5 py-0.2 rounded">{product.category}</span>
          </div>

          <Link href={`/product/${product.id}`} className="block text-left">
            <h3 className="font-bold text-[#1A1A1A] text-sm line-clamp-2 group-hover:text-[#1B5E20] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs pt-0.5">
          <div className="flex items-center gap-0.5 text-amber-500 font-black text-[11px]">
            <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
            <span className="text-gray-900">{product.rating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 text-[11px]">({product.reviewsCount})</span>
        </div>

        {/* Price Tag with Light Yellow Backdrop & Add to Cart button */}
        <div className="pt-2 mt-1.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="text-left bg-[#FFF9C4]/80 px-2 py-1 rounded-[4px] border border-[#FFC107]/30">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#FF6F00]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-600 block leading-tight font-bold">{product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-bold flex items-center gap-1 transition-all text-white ${
              added
                ? 'bg-[#1B5E20] scale-95'
                : 'bg-[#FF6F00] hover:bg-[#E65100] hover:-translate-y-0.5 shadow-2xs'
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
