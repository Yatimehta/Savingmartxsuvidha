'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  ShoppingBag,
  Package,
  LayoutDashboard,
  Store,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Payment Gateway Switcher', href: '/admin/payments', icon: CreditCard, highlight: true },
    { label: 'Product Inventory', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders & Packing', href: '/admin/orders', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Admin Top Navigation Bar */}
      <div className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-vegimart-orange animate-ping" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">VegiMart × Suvidha</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-800 text-emerald-400 px-2 py-0.5 rounded border border-gray-700">
                  Admin Control Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-gray-300 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
              >
                <Store className="w-3.5 h-3.5" /> Back to Store
              </Link>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-gray-800/80 text-xs font-semibold no-scrollbar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-vegimart-green text-white font-bold shadow-xs'
                      : link.highlight
                      ? 'text-orange-400 hover:bg-gray-800/60 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">{children}</div>
    </div>
  );
}
