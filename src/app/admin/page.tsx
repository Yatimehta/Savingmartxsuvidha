'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Order, Product, PaymentGatewayType } from '@/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeGateway, setActiveGateway] = useState<PaymentGatewayType>('stripe');
  const [isTestMode, setIsTestMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const fetchData = async () => {
    try {
      const [ordersRes, prodsRes, gatewayRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/admin/gateway').then((r) => r.json())
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (prodsRes.products) setProducts(prodsRes.products);
      if (gatewayRes.activeGateway) {
        setActiveGateway(gatewayRes.activeGateway);
        setIsTestMode(gatewayRes.isTestMode);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickGatewaySwitch = async (newGateway: PaymentGatewayType) => {
    if (newGateway === activeGateway || switching) return;
    setSwitching(true);
    try {
      const res = await fetch('/api/admin/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeGateway: newGateway })
      });
      const data = await res.json();
      if (data.success) {
        setActiveGateway(newGateway);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  const filteredOrdersByPeriod = orders.filter((o) => {
    if (period === 'all') return true;
    const orderDate = new Date(o.createdAt).getTime();
    const now = Date.now();
    if (period === 'today') return now - orderDate <= 24 * 3600 * 1000;
    if (period === 'week') return now - orderDate <= 7 * 24 * 3600 * 1000;
    if (period === 'month') return now - orderDate <= 30 * 24 * 3600 * 1000;
    return true;
  });

  const totalRevenue = filteredOrdersByPeriod.reduce(
    (sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0),
    0
  );
  const pendingOrders = filteredOrdersByPeriod.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;
  const lowStockProducts = products.filter((p) => p.stockCount < 30);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-vegimart-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading admin overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Alert for Gateway status */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Active Payment Gateway
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase text-white ${
              activeGateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
            }`}>
              {activeGateway}
            </span>
            {isTestMode && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Interactive Sandbox Mode
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Customers checking out are currently being routed through the{' '}
            <strong className="text-gray-900 capitalize">{activeGateway}</strong> adapter.
          </p>
        </div>

        {/* Instant Gateway Toggle Buttons */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => handleQuickGatewaySwitch('stripe')}
            disabled={switching}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateway === 'stripe'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Stripe (Cards/Apple Pay)
          </button>
          <button
            onClick={() => handleQuickGatewaySwitch('razorpay')}
            disabled={switching}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateway === 'razorpay'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Razorpay (UPI/India)
          </button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Performance Metrics</h2>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === p.id
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-gray-900">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-600 font-semibold">100% Verified Transactions</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <Package className="w-4 h-4 text-vegimart-orange" />
          </div>
          <div className="text-3xl font-black text-gray-900">{orders.length}</div>
          <p className="text-xs text-gray-500 font-medium">
            <strong className="text-vegimart-orange">{pendingOrders}</strong> pending packing
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Items</span>
            <ShoppingBag className="w-4 h-4 text-vegimart-green" />
          </div>
          <div className="text-3xl font-black text-gray-900">{products.length}</div>
          <p className="text-xs text-gray-500 font-medium">IGA Produce & Suvidha Cafe</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Gateway</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 uppercase">{activeGateway}</div>
          <Link
            href="/admin/payments"
            className="text-xs text-vegimart-orange hover:underline font-bold inline-flex items-center gap-1"
          >
            Configure Gateway & Logs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Recent Customer Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs text-vegimart-green font-bold hover:underline"
            >
              View All ({orders.length})
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded text-white ${
                      order.paymentGateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
                    }`}>
                      {order.paymentGateway}
                    </span>
                  </div>
                  <p className="text-gray-500 truncate max-w-xs">{order.customer.fullName} • {order.items.length} items</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Stock Watchlist
            </h3>
            <Link
              href="/admin/products"
              className="text-xs text-vegimart-green font-bold hover:underline"
            >
              Manage Catalog
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover bg-gray-200" />
                  <div>
                    <p className="font-bold text-gray-900 truncate max-w-[140px]">{p.name}</p>
                    <p className="text-[10px] text-gray-400">${p.price.toFixed(2)} {p.unit}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-amber-600 text-sm">{p.stockCount}</span>
                  <span className="text-[10px] text-gray-400 block leading-none">units left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
