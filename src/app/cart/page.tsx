'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    promoCode,
    discount,
    deliverySlot,
    setDeliverySlot,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading basket...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoFeedback(res);
  };

  const deliverySlots = [
    { id: 'Morning (8:00 AM - 11:00 AM)', time: '8:00 AM - 11:00 AM', label: 'Morning Slot' },
    { id: 'Afternoon (1:00 PM - 4:00 PM)', time: '1:00 PM - 4:00 PM', label: 'Afternoon Slot' },
    { id: 'Evening (5:00 PM - 8:00 PM)', time: '5:00 PM - 8:00 PM', label: 'Evening Slot' }
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-vegimart-green">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Your Basket is Empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Looks like you haven&apos;t added any crisp produce or Suvidha snacks yet. Start browsing our fresh harvest!
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-vegimart-green hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
        >
          Explore Fresh Produce <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFFBF0] text-left">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#E0E0E0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B5E20] tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 font-medium">
            {items.reduce((s, i) => s + i.quantity, 0)} verified Grocerz Australia items in your order
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-gray-500 hover:text-rose-600 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Table-like Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[8px] border border-[#E0E0E0] p-4 sm:p-5 shadow-2xs">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Item Description</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price (AUD)</div>
              <div className="col-span-1 text-center"></div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.product.id} className="py-3.5 first:pt-2 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Left: Product Info (Col 6) */}
                  <div className="sm:col-span-6 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-[4px] object-contain bg-[#FFFBF0] p-1 border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#1B5E20] block">
                        {item.product.brand || 'Grocerz'} • {item.product.category}
                      </span>
                      <Link href={`/product/${item.product.id}`} className="block">
                        <h3 className="font-bold text-[#1A1A1A] text-sm hover:text-[#1B5E20] transition-colors truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 font-medium">
                        ${item.product.price.toFixed(2)} AUD / {item.product.unit}
                      </p>
                    </div>
                  </div>

                  {/* Center: Quantity (Col 3) */}
                  <div className="sm:col-span-3 flex justify-start sm:justify-center">
                    <div className="flex items-center border border-gray-300 rounded-[4px] bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-[2px]"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-[2px]"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Price (Col 2) */}
                  <div className="sm:col-span-2 text-left sm:text-right">
                    <span className="font-black text-base text-[#FF6F00]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Far Right: Remove Button (Col 1) */}
                  <div className="sm:col-span-1 text-right sm:text-center">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Slot Selector */}
          <div className="bg-white rounded-[8px] border border-[#E0E0E0] p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#FF6F00]" />
              Select Australian Delivery Window
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {deliverySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`p-2.5 rounded-[6px] border text-left transition-all ${
                    deliverySlot === slot.id
                      ? 'border-[#1B5E20] bg-[#C8E6C9]/40 font-bold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-bold text-[#1A1A1A]">{slot.label}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[8px] border border-[#E0E0E0] p-5 shadow-2xs space-y-4 text-left">
            <h2 className="text-base font-bold text-[#1B5E20] uppercase tracking-wide">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Coupon (e.g. GROCERZ10)"
                  className="flex-1 px-3 py-1.5 bg-[#FFFBF0] border border-gray-300 rounded-[4px] text-xs font-medium uppercase tracking-wider focus:outline-hidden focus:border-[#FF6F00]"
                />
                <button
                  type="submit"
                  className="bg-[#1B5E20] hover:bg-[#144618] text-white text-xs font-bold px-3.5 py-1.5 rounded-[4px] transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoFeedback && (
                <p className={`text-xs flex items-center gap-1 ${promoFeedback.success ? 'text-[#1B5E20] font-bold' : 'text-rose-600'}`}>
                  {promoFeedback.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {promoFeedback.message}
                </p>
              )}

              {promoCode && !promoFeedback && (
                <div className="flex items-center justify-between text-xs text-[#1B5E20] bg-[#C8E6C9]/50 px-2 py-1 rounded-[4px]">
                  <span className="font-bold">Applied: {promoCode}</span>
                  <button onClick={removePromoCode} className="text-rose-500 hover:underline text-xs">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Cost Breakdown with increasing font size */}
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">${subtotal.toFixed(2)} AUD</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-[#1B5E20] font-bold">
                  <span>Discount ({promoCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery (Express)</span>
                <span className="font-bold text-[#1A1A1A]">
                  {deliveryFee === 0 ? <span className="text-[#1B5E20] font-bold">FREE (Over $50)</span> : `$${deliveryFee.toFixed(2)} AUD`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>GST (10% included)</span>
                <span className="font-bold text-[#1A1A1A]">${tax.toFixed(2)} AUD</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-black text-[#1A1A1A]">Estimated Total</span>
                <span className="text-2xl font-black text-[#FF6F00]">${total.toFixed(2)} AUD</span>
              </div>
            </div>

            {/* Proceed to Checkout Button (Large Orange) */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold py-3 rounded-[6px] flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 text-sm"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#FF6F00]" />
                <span>Fast 2-hour dispatch across Melbourne VIC</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Dual payment gateway (Stripe & Razorpay supported)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
