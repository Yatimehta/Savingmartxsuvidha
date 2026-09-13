'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function TopBanner() {
  const [activeGateway, setActiveGateway] = useState<string>('stripe');

  useEffect(() => {
    fetch('/api/payment/config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.config?.activeGateway) {
          setActiveGateway(data.config.activeGateway);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-vegimart-green-dark text-white text-xs py-2 px-4 border-b border-green-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center">
          <span className="flex items-center gap-1.5 font-medium text-emerald-200">
            <Truck className="w-3.5 h-3.5 text-vegimart-orange" />
            Free Express Delivery on orders over $50
          </span>
          <span className="hidden lg:inline text-green-600">•</span>
          <span className="hidden lg:flex items-center gap-1.5 text-gray-200">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Suvidha Cafe Samosas & Fresh Chai Available Daily
          </span>
          <span className="hidden xl:inline text-green-600">•</span>
          <span className="hidden xl:flex items-center gap-1.5 text-gray-200">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
            100% Quality & Freshness Guarantee
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-green-900/60 px-2.5 py-0.5 rounded-full border border-green-700/50">
            <CreditCard className="w-3 h-3 text-vegimart-orange" />
            <span className="text-gray-300">Gateway:</span>
            <span className="font-semibold uppercase tracking-wider text-vegimart-orange">
              {activeGateway}
            </span>
          </div>

          <Link
            href="/admin/payments"
            className="hover:text-emerald-300 transition-colors underline text-gray-300"
          >
            Admin Switcher
          </Link>
        </div>
      </div>
    </div>
  );
}
