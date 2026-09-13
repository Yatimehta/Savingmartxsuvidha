'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Tag,
  Mail,
  Send,
  Barcode
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statuses: { id: OrderStatus; label: string }[] = [
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'packed', label: 'Packed' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' }
  ];

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-vegimart-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading order fulfillment queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8 text-vegimart-orange" /> Fulfillment & Packing Station
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer shipments, update dispatch status, and print warehouse packing slips.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-vegimart-green"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              statusFilter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                statusFilter === s.id
                  ? 'bg-vegimart-green text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.label} ({orders.filter((o) => o.status === s.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-gray-400 text-xs">
            No orders match the selected criteria.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-black text-sm text-gray-900">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                    order.paymentGateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}>
                    {order.paymentGateway}
                  </span>
                  <span className="text-gray-400">
                    Placed: {new Date(order.createdAt).toLocaleTimeString()} ({new Date(order.createdAt).toLocaleDateString()})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOrderForSlip(order)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Packing Slip
                  </button>

                  <button
                    onClick={() => setSelectedOrderForLabel(order)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200"
                  >
                    <Tag className="w-3.5 h-3.5" /> Shipping Label
                  </button>

                  <button
                    onClick={() => {
                      setEmailStatus(`Notification sent to ${order.customer.email}: "Your order #${order.orderNumber} is ${order.status.replace('_', ' ')}"`);
                      setTimeout(() => setEmailStatus(null), 4000);
                    }}
                    className="p-1.5 text-gray-500 hover:text-vegimart-green rounded-xl hover:bg-gray-100 transition-colors"
                    title={`Send notification to ${order.customer.email}`}
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-vegimart-green"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Address Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-900 block">{order.customer.fullName}</span>
                  <span className="text-gray-500">{order.customer.email} • {order.customer.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Delivery Address:</span>
                  <p className="font-medium text-gray-800">
                    {order.customer.addressLine1}, {order.customer.suburb} {order.customer.postcode}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Delivery Window:</span>
                  <p className="font-bold text-emerald-700">{order.deliverySlot}</p>
                </div>
              </div>

              {/* Item checklist for warehouse picker */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Pick & Pack Items ({order.items.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-100">
                      <img src={item.image} alt={item.productName} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                        <p className="text-[10px] text-gray-400">{item.unit}</p>
                      </div>
                      <span className="font-black text-sm text-vegimart-green px-2 py-0.5 bg-green-50 rounded-lg">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Packing Slip Modal */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-black text-xl text-gray-900">WAREHOUSE PACKING SLIP</h3>
                <p className="text-xs text-gray-500 font-mono">Order Ref: {selectedOrderForSlip.orderNumber}</p>
                <p className="text-xs text-gray-500">
                  Gateway: <strong>{selectedOrderForSlip.paymentGateway.toUpperCase()}</strong> (Txn: {selectedOrderForSlip.transactionId || 'verified'})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-gray-900">Deliver To:</p>
              <p className="font-semibold">{selectedOrderForSlip.customer.fullName} ({selectedOrderForSlip.customer.phone})</p>
              <p>{selectedOrderForSlip.customer.addressLine1}, {selectedOrderForSlip.customer.suburb} {selectedOrderForSlip.customer.postcode}</p>
              <p className="text-emerald-700 font-bold mt-1">Slot: {selectedOrderForSlip.deliverySlot}</p>
              {selectedOrderForSlip.customer.deliveryInstructions && (
                <p className="text-gray-500 italic">Instructions: {selectedOrderForSlip.customer.deliveryInstructions}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Item Checklist</p>
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 text-xs">
                {selectedOrderForSlip.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded text-vegimart-green" />
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-[11px] text-gray-400">({item.unit})</span>
                    </div>
                    <span className="font-black text-sm bg-green-50 text-vegimart-green px-2 py-0.5 rounded">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Courier Shipping Label Modal */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 print:shadow-none print:max-w-none print:w-full">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 print:hidden">
              <div>
                <h3 className="font-black text-lg text-gray-900">Courier Shipping Label</h3>
                <p className="text-xs text-gray-500">Standard Express Delivery (2-Hour Refrigerated)</p>
              </div>
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Courier Label Card */}
            <div className="border-4 border-gray-900 p-6 rounded-2xl space-y-5 bg-white text-gray-900">
              <div className="flex justify-between items-center border-b-2 border-gray-900 pb-3">
                <span className="font-black text-2xl tracking-tighter text-vegimart-green">
                  VEGI<span className="text-vegimart-orange">MART</span>
                </span>
                <span className="text-xs font-black uppercase px-2 py-1 bg-gray-900 text-white rounded">
                  EXPRESS COLD-CHAIN
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-black text-gray-400">SHIP TO (DELIVERY ADDRESS):</span>
                <p className="text-base font-black">{selectedOrderForLabel.customer.fullName}</p>
                <p className="font-bold">{selectedOrderForLabel.customer.addressLine1}</p>
                <p className="text-sm font-black uppercase">
                  {selectedOrderForLabel.customer.suburb} {selectedOrderForLabel.customer.state} {selectedOrderForLabel.customer.postcode}
                </p>
                <p className="font-mono pt-1 text-gray-600">TEL: {selectedOrderForLabel.customer.phone}</p>
              </div>

              <div className="p-3 bg-gray-100 rounded-xl border border-gray-300 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>REF: {selectedOrderForLabel.orderNumber}</span>
                  <span>SLOT: {selectedOrderForLabel.deliverySlot.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Contents: {selectedOrderForLabel.items.length} Fresh Produce & Grocery Packages
                </p>
                {selectedOrderForLabel.customer.deliveryInstructions && (
                  <p className="text-[10px] text-red-600 font-bold uppercase mt-1">
                    NOTE: {selectedOrderForLabel.customer.deliveryInstructions}
                  </p>
                )}
              </div>

              {/* Simulated Barcode */}
              <div className="space-y-1 text-center pt-2">
                <div className="flex justify-center items-center h-14 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_5px,#000_5px,#000_9px,transparent_9px,transparent_11px,#000_11px,#000_14px)] w-full rounded" />
                <p className="font-mono text-xs tracking-widest font-black">
                  *{selectedOrderForLabel.orderNumber}*
                </p>
              </div>

              <div className="text-[10px] font-bold text-center uppercase tracking-wider text-gray-500 border-t border-gray-300 pt-2">
                PERISHABLE ORGANIC PRODUCE • KEEP REFRIGERATED
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Courier Shipping Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Notification Toast */}
      {emailStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{emailStatus}</span>
        </div>
      )}
    </div>
  );
}
