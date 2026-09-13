'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  Coffee,
  CheckCircle2,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Mail,
  ArrowRight,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 md:pb-12 border-t border-gray-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-800/40 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-green-900/60 flex items-center justify-center shrink-0 text-lime-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Farm Fresh</h4>
              <p className="text-xs text-gray-400 mt-1">
                Direct from Victorian & Australian farmers within 24 hours of harvest.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-800/40 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-orange-900/60 flex items-center justify-center shrink-0 text-vegimart-orange">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Suvidha Cafe Fresh</h4>
              <p className="text-xs text-gray-400 mt-1">
                Authentic hot samosas, freshly ground chai spices & Indian groceries daily.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-800/40 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 flex items-center justify-center shrink-0 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express 2-Hr Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">
                Temperature-controlled delivery vans right to your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-800/40 border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-lime-900/60 flex items-center justify-center shrink-0 text-lime-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Dual Gateway Security</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enterprise 256-bit encryption powered by Stripe & Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/95 p-3 rounded-2xl inline-flex items-center gap-3 shadow-md">
              <img
                src="/images/vegimart-logo.png"
                alt="VegiMart"
                className="h-9 w-auto object-contain"
              />
              <span className="text-gray-400 font-light text-base">×</span>
              <img
                src="/images/suvidha-logo.png"
                alt="Suvidha Grocery & Cafe"
                className="h-8 w-auto rounded-md shadow-2xs"
              />
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              <strong className="text-gray-200">VegiMart:</strong> &ldquo;Fresh • Local Service • Quality You Can Trust&rdquo;<br />
              <strong className="text-gray-200">Suvidha Grocery & Cafe:</strong> &ldquo;Fresh, Local, Affordable!&rdquo;
            </p>

            <p className="text-xs text-gray-400 leading-relaxed">
              We partner with local Australian growers and Suvidha&apos;s culinary artisans to deliver farm-fresh crisp greens, organic fruits, fragrant spices, and freshly prepared cafe delicacies to your home.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-vegimart-orange shrink-0" />
                <span>142 Market Street, Melbourne VIC 3000</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime-400 shrink-0" />
                <span>+61 (03) 9876 5432 / orders@vegimartsuvidha.com.au</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Open Mon - Sun: 7:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Fresh Catalog
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalog?category=fruits" className="hover:text-emerald-400 transition-colors">
                  Australian Fruits
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=vegetables" className="hover:text-emerald-400 transition-colors">
                  Crisp Vegetables
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=suvidha-cafe" className="hover:text-vegimart-orange transition-colors">
                  Suvidha Cafe & Samosas
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=dairy-bakery" className="hover:text-emerald-400 transition-colors">
                  Artisan Bakery & Dairy
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=pantry" className="hover:text-emerald-400 transition-colors">
                  Pantry & Organic Honey
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Admin */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform & Admin
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                  My Shopping Basket
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-emerald-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin/payments" className="text-vegimart-orange hover:underline transition-colors font-medium">
                  Payment Gateway Switcher
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-emerald-400 transition-colors">
                  Product Inventory
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-emerald-400 transition-colors">
                  Fulfillment & Packing
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Deals */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Get $10 Off First Order
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe for weekly harvest updates, seasonal fruit arrivals, and Suvidha cafe specials.
            </p>

            {subscribed ? (
              <div className="p-3 bg-green-950 border border-green-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Use coupon <strong>FRESH10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-vegimart-green"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-vegimart-orange hover:bg-orange-600 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  Claim $10 Coupon <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Payment Methods & Bottom Legal */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VegiMart × Suvidha. All rights reserved. Registered Australian Business.</p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-[11px] text-gray-400">Accepted Gateways & Payments:</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-indigo-400 border border-gray-700">
                STRIPE
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-blue-400 border border-gray-700">
                RAZORPAY
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-gray-300 border border-gray-700">
                VISA
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-orange-400 border border-gray-700">
                MC
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-emerald-400 border border-gray-700">
                UPI
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded text-[10px] font-semibold text-gray-300 border border-gray-700">
                APPLE PAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
