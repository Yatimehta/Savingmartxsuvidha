'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingCart, User, SlidersHorizontal } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/catalog', icon: Store },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: itemCount },
    { label: 'Account', href: '/account', icon: User },
    { label: 'Admin', href: '/admin', icon: SlidersHorizontal }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 relative transition-colors ${
                isActive ? 'text-vegimart-green font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {mounted && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-vegimart-orange text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-1 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
