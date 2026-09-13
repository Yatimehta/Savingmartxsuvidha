'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'payments'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const wishlist = useCartStore((s) => s.wishlist);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    // Fetch orders & wishlist items
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json())
    ])
      .then(([ordersData, prodsData]) => {
        if (ordersData.orders) {
          setOrders(ordersData.orders);
        }
        if (prodsData.products) {
          setWishlistProducts(prodsData.products.filter((p: Product) => wishlist.includes(p.id)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  const savedAddresses = [
    {
      id: 'addr-1',
      title: 'Home (Default)',
      name: 'Sarah Jenkins',
      street: '48 Collins Street, Apt 12B',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Office',
      name: 'Sarah Jenkins',
      street: '120 Spencer Street, Level 4',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      isDefault: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
            SJ
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black text-gray-900">Sarah Jenkins</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Loyal Customer
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">sarah.j@example.com • +61 0412 345 678</p>
            <p className="text-[11px] text-vegimart-green font-semibold mt-1">
              🌱 VegiMart Club Member • Free Express Deliveries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 transition-colors"
          >
            Admin Panel
          </Link>
          <Link
            href="/catalog"
            className="px-4 py-2 rounded-xl bg-vegimart-green hover:bg-green-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Shop Today&apos;s Harvest
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2 text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-vegimart-green text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'wishlist'
              ? 'bg-vegimart-green text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Saved Produce ({wishlistProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'bg-vegimart-green text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> Saved Addresses
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-vegimart-green text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Gateways & Payment
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800">No Orders Yet</h3>
              <p className="text-xs text-gray-500 mt-1">Start shopping fresh produce & cafe treats.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs hover:border-green-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 text-xs">
                  <div>
                    <span className="font-black text-sm text-gray-900">{order.orderNumber}</span>
                    <span className="text-gray-400 ml-2">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase text-white ${
                      order.paymentGateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
                    }`}>
                      {order.paymentGateway}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items preview in order */}
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-xl shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
                        {item.productName}
                      </span>
                      <span className="text-[10px] text-gray-400">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div>
                    <span className="text-gray-500">Slot: </span>
                    <strong className="text-gray-800">{order.deliverySlot}</strong>
                    <span className="text-gray-300 mx-2">•</span>
                    <span className="text-gray-500">Total: </span>
                    <strong className="text-vegimart-green text-sm">${order.total.toFixed(2)}</strong>
                  </div>

                  <Link
                    href={`/order-confirmation/${order.orderNumber}`}
                    className="text-vegimart-green hover:underline font-bold flex items-center gap-1"
                  >
                    View Invoice <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500 mt-1">
                Tap the heart icon on any product to save it for quick repeat shopping.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-3 space-y-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <h4 className="font-bold text-xs text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs font-black text-vegimart-green">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="w-full py-1.5 bg-vegimart-green text-white text-xs font-bold rounded-xl"
                  >
                    Add to Basket
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">{addr.title}</span>
                {addr.isDefault && (
                  <span className="text-[10px] bg-green-50 text-vegimart-green font-bold px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="font-semibold text-gray-800">{addr.name}</p>
              <p className="text-gray-600">{addr.street}</p>
              <p className="text-gray-600">{addr.suburb}, {addr.state} {addr.postcode}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gray-900">Supported Gateways & Saved Methods</h3>
          <p className="text-gray-500">
            Checkout seamlessly via either Stripe or Razorpay based on the platform configuration. All transactions are PCI-DSS compliant.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
              <p className="font-bold text-indigo-950">Stripe Gateway Adapter</p>
              <p className="text-indigo-800 text-[11px]">Credit cards, Apple Pay, and debit cards.</p>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
              <p className="font-bold text-blue-950">Razorpay Gateway Adapter</p>
              <p className="text-blue-800 text-[11px]">UPI apps (GPay, PhonePe), Cards & NetBanking.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
