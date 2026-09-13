'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  MapPin,
  Menu,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '@/components/auth/AuthModal';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useCartStore((s) => s.wishlist.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quick suggestions for search dropdown
  const quickSuggestions = [
    { title: 'Pink Lady Apples', cat: 'fruits' },
    { title: 'Suvidha Cafe Samosas', cat: 'suvidha-cafe' },
    { title: 'Cavendish Bananas', cat: 'fruits' },
    { title: 'Hass Avocados', cat: 'fruits' },
    { title: 'Royal Basmati Rice', cat: 'suvidha-cafe' },
    { title: 'Woodfired Sourdough', cat: 'dairy-bakery' },
    { title: 'Farm Fresh Broccoli', cat: 'vegetables' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (title: string) => {
    setSearchQuery(title);
    setIsSearchOpen(false);
    router.push(`/catalog?search=${encodeURIComponent(title)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1B5E20] text-white border-b-4 border-[#FFC107] shadow-md">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-[#FFC107]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              {/* Official VegiMart Logo */}
              <div className="bg-white/95 px-2.5 py-1.5 rounded-[6px] shadow-xs border-b-2 border-[#FFC107]">
                <img
                  src="/images/vegimart-logo.png"
                  alt="VegiMart"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>

              {/* Co-Branding Separator & Suvidha Logo */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-green-700/60">
                <span className="text-[#FFC107] font-bold text-sm">×</span>
                <div className="bg-white/95 px-2 py-1 rounded-[6px] shadow-xs border-b-2 border-[#FFC107]">
                  <img
                    src="/images/suvidha-logo.png"
                    alt="Suvidha Grocery & Cafe"
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop (Off-white, 6px rounded, Yellow focus ring) */}
          <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Grocerz products: bananas, atta flour, basmati, samosa, ghee..."
                className="w-full pl-10 pr-24 py-2 bg-[#FFFBF0] text-[#1A1A1A] placeholder-gray-500 border-2 border-transparent focus:border-[#FFC107] rounded-[6px] text-sm focus:outline-hidden transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF6F00] hover:bg-[#E65100] text-white text-xs font-bold px-4 py-1.5 rounded-[4px] transition-colors shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-[#1A1A1A] rounded-[8px] shadow-xl border-2 border-[#FFC107] py-2 z-50">
                <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1B5E20] bg-[#FFF9C4]">
                  Verified Grocerz Searches
                </div>
                <div className="divide-y divide-gray-100">
                  {quickSuggestions
                    .filter((item) =>
                      searchQuery
                        ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(item.title)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF9C4] hover:text-[#1B5E20] flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-800 font-semibold capitalize bg-[#FFC107]/40 px-2 py-0.5 rounded-[4px]">
                          {item.cat.replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Delivery Location badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#144618] rounded-[6px] border border-green-800 text-xs text-emerald-100">
              <MapPin className="w-4 h-4 text-[#FFC107] shrink-0" />
              <div>
                <p className="text-[10px] text-[#FFC107] font-bold leading-none">Deliver to</p>
                <p className="font-semibold leading-tight">Melbourne VIC</p>
              </div>
            </div>

            {/* Hot Deals Yellow Pill Badge */}
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1 bg-[#FFC107] text-[#1A1A1A] font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-2xs hover:bg-yellow-300 transition-colors uppercase tracking-wider animate-pulse"
            >
              <Sparkles className="w-3 h-3 text-[#1B5E20]" />
              Hot Deals
            </Link>

            {/* Wishlist */}
            <Link
              href="/catalog?wishlist=true"
              className="relative p-2 text-emerald-100 hover:text-[#FFC107] hover:bg-green-800/60 rounded-[6px] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFC107] text-[#1A1A1A] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button with Solid Yellow Badge (#FFC107) and Dark Text */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white px-3.5 py-2 rounded-[6px] font-bold text-sm transition-all shadow-xs hover:-translate-y-0.5 border border-amber-300/30"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#FFC107] text-[#1A1A1A] text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-sm ring-1 ring-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* User Auth / Account */}
            {mounted && (
              isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-green-800/80 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#FFC107]" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1.5 text-emerald-200 hover:text-rose-300 rounded-[6px] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#FFC107] hover:bg-[#FFC107] hover:text-[#1A1A1A] text-[#FFC107] text-xs font-bold transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* Admin Switcher shortcut */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#FFC107] hover:text-white font-bold px-2.5 py-1.5 rounded-[6px] bg-green-900/60 border border-[#FFC107]/60 hover:border-[#FFC107] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFC107]" />
              Admin
            </Link>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-2 border-t border-green-800/80 text-xs font-medium tracking-wide">
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
            <Link
              href="/catalog"
              className="bg-[#FFC107] text-[#1A1A1A] font-extrabold px-2.5 py-0.5 rounded-[4px] flex items-center gap-1 shadow-2xs hover:bg-yellow-300 transition-colors"
            >
              All Grocerz Products (441)
            </Link>
            <Link
              href="/catalog?category=fresh-fruits-and-vegetables"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Fresh Produce
            </Link>
            <Link
              href="/catalog?category=indian-pantry"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Indian Pantry
            </Link>
            <Link
              href="/catalog?category=daily-essentials"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Daily Essentials
            </Link>
            <Link
              href="/catalog?category=frozen"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Frozen
            </Link>
            <Link
              href="/catalog?category=snacks-munchies"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Snacks & Munchies
            </Link>
            <Link
              href="/catalog?category=dairy-eggs-fridge"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Dairy & Fridge
            </Link>
            <Link
              href="/catalog?category=dry-fruits-nuts-and-seeds"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Dry Fruits
            </Link>
            <Link
              href="/catalog?category=drinks"
              className="text-white hover:text-[#FFC107] transition-colors"
            >
              Drinks
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#FFC107]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] animate-pulse"></span>
            <span>100% Grocerz Australia Catalog</span>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Grocerz products..."
            className="w-full pl-9 pr-16 py-1.5 bg-[#FFFBF0] text-[#1A1A1A] border border-gray-300 rounded-[6px] text-xs focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF6F00] text-white text-xs font-semibold px-3 py-1 rounded-[4px]"
          >
            Go
          </button>
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-[#1A1A1A] border-t border-gray-200 px-4 py-4 space-y-3 shadow-lg">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grocerz Categories</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-100 rounded-[6px] text-[#1B5E20] font-bold"
            >
              All Items
            </Link>
            <Link
              href="/catalog?category=fresh-fruits-and-vegetables"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Fresh Produce
            </Link>
            <Link
              href="/catalog?category=indian-pantry"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Indian Pantry
            </Link>
            <Link
              href="/catalog?category=daily-essentials"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Daily Essentials
            </Link>
            <Link
              href="/catalog?category=frozen"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Frozen
            </Link>
            <Link
              href="/catalog?category=snacks-munchies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Snacks & Munchies
            </Link>
            <Link
              href="/catalog?category=dairy-eggs-fridge"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Dairy & Fridge
            </Link>
            <Link
              href="/catalog?category=dry-fruits-nuts-and-seeds"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Dry Fruits
            </Link>
            <Link
              href="/catalog?category=drinks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-50 rounded-[6px] hover:bg-[#C8E6C9]"
            >
              Drinks
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
            <Link
              href="/admin/payments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#1B5E20] font-bold flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6F00]" />
              Gateway Switcher
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600"
            >
              My Account
            </Link>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
