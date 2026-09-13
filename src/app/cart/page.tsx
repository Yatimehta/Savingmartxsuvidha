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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Basket</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {items.reduce((s, i) => s + i.quantity, 0)} fresh items in your basket
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-rose-600 transition-colors"
        >
          Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 shadow-xs divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-center">
                {/* Item Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-vegimart-green uppercase">
                      {item.product.categoryName}
                    </span>
                    <span className="text-xs font-bold text-gray-400 sm:hidden">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <Link href={`/product/${item.product.id}`} className="block">
                    <h3 className="font-bold text-gray-900 text-sm hover:text-vegimart-green transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-500">
                    ${item.product.price.toFixed(2)} {item.product.unit}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-lg transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-lg transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="hidden sm:block text-right w-20">
                    <span className="font-bold text-sm text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Slot Selector */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Clock className="w-4 h-4 text-vegimart-green" />
              Choose Delivery Slot
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {deliverySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    deliverySlot === slot.id
                      ? 'border-vegimart-green bg-green-50/70 ring-1 ring-vegimart-green'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{slot.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Order Breakdown</h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Promo code (e.g. FRESH10)"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium uppercase tracking-wider focus:outline-hidden focus:border-vegimart-green"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoFeedback && (
                <p className={`text-xs flex items-center gap-1 ${promoFeedback.success ? 'text-emerald-600 font-medium' : 'text-rose-500'}`}>
                  {promoFeedback.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {promoFeedback.message}
                </p>
              )}

              {promoCode && !promoFeedback && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                  <span className="font-semibold">Applied: {promoCode}</span>
                  <button onClick={removePromoCode} className="text-rose-500 hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({promoCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery Fee
                  {subtotal >= 50 && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Free over $50
                    </span>
                  )}
                </span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST (10% included)</span>
                <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-vegimart-green">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-vegimart-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Delivery Guarantees */}
            <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-vegimart-green" />
                <span>Estimated arrival: Today in your selected slot</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-vegimart-green" />
                <span>Dual payment gateway checkout with instant refund protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
