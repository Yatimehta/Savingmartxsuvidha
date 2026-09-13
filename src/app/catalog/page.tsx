'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LayoutGrid,
  List,
  Filter,
  X,
  Star,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Check
} from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartStore } from '@/store/useCartStore';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'all';
  const initialSearch = searchParams.get('search') || '';
  const showOnlyWishlist = searchParams.get('wishlist') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<number>(25);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const wishlist = useCartStore((s) => s.wishlist);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Sync category & search from URL if they change
  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory;
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const categories: { id: string; label: string; slug: string }[] = [
    { id: 'all', label: 'All 51 Grocerz Items', slug: 'all' },
    { id: 'fresh-fruits-and-vegetables', label: 'Fresh Fruits & Vegetables', slug: 'fresh-fruits-and-vegetables' },
    { id: 'indian-pantry', label: 'Indian Pantry', slug: 'indian-pantry' },
    { id: 'daily-essentials', label: 'Daily Essentials', slug: 'daily-essentials' },
    { id: 'frozen', label: 'Frozen', slug: 'frozen' },
    { id: 'snacks-munchies', label: 'Snacks & Munchies', slug: 'snacks-munchies' },
    { id: 'dairy-eggs-fridge', label: 'Dairy Eggs & Fridge', slug: 'dairy-eggs-fridge' },
    { id: 'dry-fruits-nuts-and-seeds', label: 'Dry Fruits & Seeds', slug: 'dry-fruits-nuts-and-seeds' },
    { id: 'drinks', label: 'Drinks', slug: 'drinks' }
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (showOnlyWishlist && !wishlist.includes(p.id)) return false;
        if (selectedCategory !== 'all') {
          const matchSlug = p.categorySlug === selectedCategory;
          const matchCat = p.category?.toLowerCase().replace(/\s+/g, '-').includes(selectedCategory.replace(/-/g, ' '));
          if (!matchSlug && !matchCat && p.category !== selectedCategory) return false;
        }
        if (p.price > priceRange) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchBrand) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }, [products, selectedCategory, searchTerm, sortBy, priceRange, showOnlyWishlist, wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            {showOnlyWishlist ? 'Saved Wishlist' : 'Fresh Produce Catalog'}
            {selectedCategory === 'suvidha-cafe' && (
              <span className="text-xs bg-orange-100 text-vegimart-orange px-2.5 py-1 rounded-full font-bold">
                Suvidha Specials
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> fresh grocery items
          </p>
        </div>

        {/* View Switcher & Sorting */}
        <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-vegimart-green"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-vegimart-green shadow-xs' : 'text-gray-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-vegimart-green shadow-xs' : 'text-gray-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-vegimart-green" /> Filters
            </h3>
            {(selectedCategory !== 'all' || searchTerm || priceRange < 25 || organicOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setPriceRange(25);
                  setOrganicOnly(false);
                }}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Categories
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-green-50 text-vegimart-green font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-vegimart-green" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Max Price
              </label>
              <span className="text-xs font-bold text-gray-900">${priceRange.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-vegimart-green cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>$2</span>
              <span>$25+</span>
            </div>
          </div>

          {/* Freshness / Dietary */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Dietary & Freshness
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="rounded text-vegimart-green focus:ring-green-700 w-4 h-4"
              />
              <span>Certified Organic / Natural</span>
            </label>
          </div>

          {/* Suvidha Cafe Badge Info */}
          <div className="p-3 bg-orange-50/80 rounded-xl border border-orange-200/80 text-xs text-orange-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-vegimart-orange">
              <Sparkles className="w-3.5 h-3.5" /> Suvidha Cafe Tip
            </div>
            <p className="text-[11px] text-orange-800 leading-relaxed">
              Order fresh hot samosas before 11am for lunch delivery!
            </p>
          </div>
        </aside>

        {/* PRODUCT GRID / LIST */}
        <main className="col-span-1 md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🥬
              </div>
              <h3 className="text-lg font-bold text-gray-900">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn&apos;t find any grocery items matching your current filters. Try changing categories or clearing filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setPriceRange(25);
                  setOrganicOnly(false);
                }}
                className="bg-vegimart-green text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                View All Produce
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Filter Groceries</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === cat.id ? 'bg-green-50 text-vegimart-green font-bold' : 'text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Max Price: ${priceRange}
              </label>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-vegimart-green"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-vegimart-green text-white font-bold py-3 rounded-xl text-xs mt-6"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
