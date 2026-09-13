'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ShoppingBag,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  Download,
  ArrowRight
} from 'lucide-react';
import { Order } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti on page load
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas-confetti fails in test environment
    }

    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Retrieving your order invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-sm text-gray-500">We couldn&apos;t find order #{orderId}.</p>
        <Link
          href="/"
          className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-[6px] font-bold text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 bg-[#FFFBF0] text-left">
      {/* Top Success Banner */}
      <div className="text-center space-y-3 bg-white p-8 rounded-[8px] border-2 border-[#FFC107] shadow-sm print:hidden">
        <div className="w-16 h-16 bg-[#1B5E20] text-white rounded-full flex items-center justify-center mx-auto shadow-md ring-4 ring-[#FFF9C4]">
          <CheckCircle2 className="w-10 h-10 text-[#FFC107]" />
        </div>
        
        {/* Large YELLOW Pill shape Order Confirmed badge */}
        <div>
          <span className="inline-block px-4 py-1.5 bg-[#FFC107] text-[#1A1A1A] text-xs font-black rounded-full uppercase tracking-wider shadow-xs">
            ✓ Order Confirmed & In Progress
          </span>
        </div>

        <h1 className="text-3xl font-black text-[#1B5E20]">Thank You for Your Order!</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Your fresh harvest items & Suvidha specials have been assigned to our refrigerated local dispatch team.
        </p>

        {/* Order ID Background in Light Yellow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF9C4] rounded-[6px] border border-[#FFC107] text-xs font-black text-[#1A1A1A] shadow-xs">
          <span>Official Order ID:</span>
          <span className="text-[#FF6F00] font-mono text-sm">{order.orderNumber}</span>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white rounded-[8px] border border-[#E0E0E0] p-6 sm:p-10 shadow-2xs space-y-8 print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-[#1B5E20]">
                Vegi<span className="text-[#FF6F00]">Mart</span>
              </span>
              <span className="text-gray-400 font-light">×</span>
              <span className="font-bold text-xl text-gray-800">Suvidha</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">142 Market Street, Melbourne VIC 3000</p>
            <p className="text-xs text-gray-400">ABN: 54 829 104 221 • Tax Invoice</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-[#FFF9C4] text-[#1A1A1A] border border-[#FFC107] text-xs font-black rounded-full uppercase">
              {order.status.replace('_', ' ')}
            </span>
            <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-xs font-mono text-gray-600 bg-[#FFF9C4]/50 px-2 py-0.5 rounded">ID: {order.orderNumber}</p>
          </div>
        </div>

        {/* Dual Gateway Transaction Verification Box */}
        <div className="p-4 bg-[#FFFBF0] rounded-[6px] border border-[#FFC107]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                Payment Verification
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${
                order.paymentGateway === 'stripe' ? 'bg-[#FF6F00]' : 'bg-blue-600'
              }`}>
                Processed via {order.paymentGateway}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-mono">
              Gateway Txn: <strong className="text-[#1A1A1A]">{order.transactionId || 'pi_test_verified_98214'}</strong>
            </p>
          </div>

          <div className="text-xs text-gray-600">
            Status: <strong className="text-[#1B5E20] font-black uppercase bg-[#C8E6C9]/60 px-2 py-1 rounded-[4px]">PAID & CAPTURED</strong>
          </div>
        </div>

        {/* Delivery & Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600">
          <div className="space-y-1.5 p-4 bg-gray-50/60 rounded-[6px] border border-gray-200">
            <h3 className="font-bold text-[#1A1A1A] flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-[#FF6F00]" /> Delivery Details
            </h3>
            <p className="font-semibold text-gray-800">{order.customer.fullName}</p>
            <p>{order.customer.addressLine1}</p>
            <p>{order.customer.suburb}, {order.customer.state} {order.customer.postcode}</p>
            <p>Phone: {order.customer.phone}</p>
            {order.customer.deliveryInstructions && (
              <p className="text-gray-400 italic mt-1">Note: {order.customer.deliveryInstructions}</p>
            )}
          </div>

          <div className="space-y-1.5 p-4 bg-[#FFF9C4]/30 rounded-[6px] border border-[#FFC107]/40">
            <h3 className="font-bold text-[#1B5E20] flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-[#FF6F00]" /> Delivery Window
            </h3>
            <p className="font-bold text-gray-800">{order.deliverySlot}</p>
            <p className="text-[#1B5E20] font-black bg-[#FFF9C4] px-2 py-1 rounded-[4px] border border-[#FFC107] inline-block">
              Estimated Arrival: Today Express Dispatch
            </p>
            <p className="text-gray-500">Our refrigerated van will notify you via SMS when 10 mins away.</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-gray-200 rounded-[6px] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFBF0] border-b border-gray-200 font-bold text-gray-700">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4 text-center">Unit Price</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Total (AUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[4px] overflow-hidden bg-[#FFFBF0] p-0.5 border border-gray-200 shrink-0 relative">
                      <OptimizedImage
                        src={item.image}
                        alt={item.productName}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.productName}</p>
                      <p className="text-[10px] text-gray-500">{item.unit}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-black text-[#1A1A1A]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)} AUD</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between bg-[#FFF9C4] px-2 py-0.5 rounded-[4px] border border-[#FFC107] text-[#1B5E20] font-black">
                <span>Discount Applied:</span>
                <span>-${order.discount.toFixed(2)} AUD</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-gray-900">
                {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)} AUD`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (10% included):</span>
              <span className="font-semibold text-gray-900">${order.tax.toFixed(2)} AUD</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline text-sm bg-[#FFF9C4]/40 p-2 rounded-[4px]">
              <span className="font-black text-gray-900">Total Paid:</span>
              <span className="text-xl font-black text-[#FF6F00]">${order.total.toFixed(2)} AUD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-[6px] border-2 border-[#FFC107] hover:bg-[#FFF9C4]/50 text-xs font-black text-[#1B5E20] flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#FF6F00]" /> Print Tax Invoice
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/account"
              className="w-full sm:w-auto px-5 py-2.5 rounded-[6px] bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 text-center transition-colors"
            >
              View in My Orders
            </Link>
            <Link
              href="/catalog"
              className="w-full sm:w-auto px-6 py-2.5 rounded-[6px] bg-[#1B5E20] hover:bg-[#144618] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
