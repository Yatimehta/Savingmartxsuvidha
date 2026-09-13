'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { ShippingAddress, PaymentGatewayConfig } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { items, promoCode, deliverySlot, getSubtotal, getDeliveryFee, getTax, getTotal, clearCart } =
    useCartStore();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '0412 345 678',
    addressLine1: '48 Collins Street, Apt 12B',
    addressLine2: '',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    deliveryInstructions: 'Leave with front reception if not answering intercom'
  });

  // Payment Form Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  useEffect(() => {
    setMounted(true);
    // Fetch active payment gateway configuration from server
    fetch('/api/payment/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setGatewayConfig(data.config);
        }
        setLoadingConfig(false);
      })
      .catch((err) => {
        console.error('Config fetch error:', err);
        setLoadingConfig(false);
      });
  }, []);

  if (!mounted || loadingConfig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-vegimart-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Preparing secure checkout gateway...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Your basket is empty</h2>
        <p className="text-xs text-gray-500">Add some fresh produce before checking out.</p>
        <Link
          href="/catalog"
          className="inline-block bg-vegimart-green text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const autofillDemoAddress = () => {
    setFormData({
      fullName: 'Dr. Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '0488 123 456',
      addressLine1: '75 Swanston Street, Suite 402',
      addressLine2: 'Suvidha Towers',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      deliveryInstructions: 'Ring doorbell twice, leave at doorstep'
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Send order details to server to create order and initiate gateway session
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            unit: i.product.unit,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image
          })),
          deliverySlot,
          promoCode: promoCode || undefined
        })
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || 'Failed to initialize order');
      }

      const { order, payment } = createData;

      // 2. Perform verification with the active gateway
      const activeGateway = payment.gateway;

      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: activeGateway,
          orderId: order.id,
          orderNumber: order.orderNumber,
          amount: order.total,
          paymentIntentId: payment.gatewayOrderId,
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpayOrderId: payment.gatewayOrderId,
          razorpaySignature: 'simulated_valid_signature',
          paymentMethod:
            activeGateway === 'razorpay'
              ? 'Razorpay UPI (success@razorpay)'
              : 'Stripe Card (Visa •••• 4242)'
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // 3. Clear cart and redirect to Order Confirmation
      clearCart();
      router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during checkout';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const activeGateway = gatewayConfig?.activeGateway || 'stripe';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFFBF0] text-left">
      <div className="flex items-center justify-between border-b border-[#E0E0E0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/cart" className="text-xs text-gray-500 hover:text-[#1B5E20] flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B5E20] tracking-tight mt-1">
            Express Checkout
          </h1>
        </div>

        {/* Active Gateway Badge */}
        <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-[6px] border border-[#E0E0E0] shadow-2xs">
          <div className={`w-2.5 h-2.5 rounded-full ${activeGateway === 'stripe' ? 'bg-[#FF6F00]' : 'bg-emerald-600'} animate-pulse`} />
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Active Gateway</p>
            <p className="text-xs font-black uppercase text-[#1B5E20] leading-tight">
              {activeGateway === 'stripe' ? 'Stripe (Cards)' : 'Razorpay (India/UPI)'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-vegimart-green" /> 1. Delivery Address
              </h2>
              <button
                type="button"
                onClick={autofillDemoAddress}
                className="text-xs text-vegimart-orange hover:underline font-semibold"
              >
                Autofill Test Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Email Address (for order receipts) *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Street Address *</label>
                <input
                  type="text"
                  required
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="e.g. 48 Collins Street, Apt 12B"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Suburb *</label>
                <input
                  type="text"
                  required
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Postcode *</label>
                  <input
                    type="text"
                    required
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">Delivery Instructions (Optional)</label>
                <textarea
                  rows={2}
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g., Gate code, leave by front porch"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green text-xs"
                />
              </div>
            </div>
          </div>

          {/* Unified Payment Processor Section */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-vegimart-orange" /> 2. Payment Method
              </h2>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted
              </span>
            </div>

            {/* Processor Dynamic Alert */}
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                activeGateway === 'stripe'
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                  : 'bg-blue-50/70 border-blue-200 text-blue-950'
              }`}
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
              <div className="space-y-1">
                <p className="font-bold">
                  Active Gateway: {activeGateway === 'stripe' ? 'Stripe Checkout Engine' : 'Razorpay Gateway (India/UPI)'}
                </p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {activeGateway === 'stripe'
                    ? 'Processing credit/debit cards seamlessly via Stripe. Test sandbox card autofilled.'
                    : 'Processing via Razorpay with UPI, Cards, and Netbanking support. Interactive test simulator active.'}
                </p>
              </div>
            </div>

            {/* Payment Fields according to active gateway */}
            {activeGateway === 'stripe' ? (
              <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Card Details (Stripe Element)</span>
                  <span className="text-[10px] text-gray-400">Visa / Mastercard / Amex</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-vegimart-green shadow-xs"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-vegimart-green shadow-xs"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-vegimart-green shadow-xs"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 flex items-center justify-between pt-1">
                  <span>Simulated test mode enabled</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCardNumber('4242 4242 4242 4242');
                      setCardExpiry('12/28');
                      setCardCvc('888');
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Insert Stripe Test Card
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" /> Razorpay UPI / Card Checkout
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Instant UPI
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-gray-600 block">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank or phone@paytm"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-vegimart-green shadow-xs"
                  />
                </div>

                <div className="text-[10px] text-gray-500 flex items-center justify-between pt-1">
                  <span>Supports GPay, PhonePe, Paytm & NetBanking</span>
                  <button
                    type="button"
                    onClick={() => setUpiId('success@razorpay')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Use Razorpay Success VPA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Pay CTA */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Review Items ({items.length})</h2>

            {/* Quick item thumbnails */}
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center gap-3 pt-2 first:pt-0">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{i.product.name}</p>
                    <p className="text-[10px] text-gray-500">Qty: {i.quantity} × ${i.product.price.toFixed(2)}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    ${(i.product.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Slot Selected */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Delivery Slot</span>
              <p className="font-bold text-gray-800">{deliverySlot}</p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (10%)</span>
                <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-vegimart-green">${total.toFixed(2)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-vegimart-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Routing via {activeGateway.toUpperCase()}...
                </>
              ) : (
                <>
                  Pay ${total.toFixed(2)} Securely <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Transactions securely logged in VegiMart dual-gateway audit.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
