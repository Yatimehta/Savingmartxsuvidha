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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-vegimart-green"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              {/* Official VegiMart Logo */}
              <img
                src="/images/vegimart-logo.png"
                alt="VegiMart"
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />

              {/* Co-Branding Separator & Suvidha Logo */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
                <span className="text-gray-400 font-light text-sm">×</span>
                <img
                  src="/images/suvidha-logo.png"
                  alt="Suvidha Grocery & Cafe"
                  className="h-8 w-auto rounded-md shadow-2xs"
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
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
                placeholder="Search fresh apples, broccoli, samosas, basmati..."
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-300 focus:border-vegimart-green rounded-full text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-green-700/20 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-vegimart-orange hover:bg-orange-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Popular Searches
                </div>
                <div className="divide-y divide-gray-50">
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
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50/70 hover:text-vegimart-green flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.cat.replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Delivery Location badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200/80 text-xs">
              <MapPin className="w-4 h-4 text-vegimart-orange shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none">Deliver to</p>
                <p className="font-semibold text-gray-800 leading-tight">Melbourne, 3000</p>
              </div>
            </div>

            {/* Wishlist */}
            <Link
              href="/catalog?wishlist=true"
              className="relative p-2 text-gray-600 hover:text-vegimart-green hover:bg-gray-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 bg-vegimart-green hover:bg-green-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-vegimart-orange text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">Cart</span>
            </Link>

            {/* User Auth / Account */}
            {mounted && (
              isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-vegimart-green" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 hover:border-vegimart-green text-gray-700 hover:text-vegimart-green text-xs font-semibold transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* Admin Switcher shortcut */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-vegimart-green font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-vegimart-green transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-vegimart-orange" />
              Admin
            </Link>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-2.5 border-t border-gray-100 text-sm font-medium">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <Link
              href="/catalog"
              className="text-vegimart-green hover:text-green-800 font-semibold flex items-center gap-1.5"
            >
              All Produce
            </Link>
            <Link
              href="/catalog?category=fruits"
              className="text-gray-600 hover:text-vegimart-green transition-colors"
            >
              Fresh Fruits
            </Link>
            <Link
              href="/catalog?category=vegetables"
              className="text-gray-600 hover:text-vegimart-green transition-colors"
            >
              Vegetables
            </Link>
            <Link
              href="/catalog?category=suvidha-cafe"
              className="text-gray-800 hover:text-vegimart-orange transition-colors flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-vegimart-orange" />
              Suvidha Cafe & Grocery
            </Link>
            <Link
              href="/catalog?category=dairy-bakery"
              className="text-gray-600 hover:text-vegimart-green transition-colors"
            >
              Dairy & Bakery
            </Link>
            <Link
              href="/catalog?category=pantry"
              className="text-gray-600 hover:text-vegimart-green transition-colors"
            >
              Pantry Essentials
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-400">⚡ Fast 2-Hour Delivery Available</span>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar - Visible only on mobile below header */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries & cafe..."
            className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-vegimart-green"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-vegimart-orange text-white text-xs font-semibold px-3 py-1 rounded-full"
          >
            Go
          </button>
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-lg">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 rounded-xl text-vegimart-green hover:bg-green-50"
            >
              All Produce
            </Link>
            <Link
              href="/catalog?category=fruits"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 rounded-xl hover:bg-green-50"
            >
              Fresh Fruits
            </Link>
            <Link
              href="/catalog?category=vegetables"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 rounded-xl hover:bg-green-50"
            >
              Vegetables
            </Link>
            <Link
              href="/catalog?category=suvidha-cafe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-orange-50/70 text-vegimart-orange rounded-xl font-semibold"
            >
              Suvidha Cafe & Indian
            </Link>
            <Link
              href="/catalog?category=dairy-bakery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 rounded-xl hover:bg-green-50"
            >
              Dairy & Bakery
            </Link>
            <Link
              href="/catalog?category=pantry"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 rounded-xl hover:bg-green-50"
            >
              Pantry Essentials
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm">
            <Link
              href="/admin/payments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-vegimart-green font-semibold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Admin Gateway Switcher
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
