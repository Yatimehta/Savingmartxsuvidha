'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Send,
  Lock,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Download,
  RotateCcw
} from 'lucide-react';
import { PaymentGatewayType, TransactionRecord, WebhookLog } from '@/types';

export default function AdminPaymentsPage() {
  const [activeGateway, setActiveGateway] = useState<PaymentGatewayType>('stripe');
  const [isTestMode, setIsTestMode] = useState(true);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Key configs
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');

  // Webhook Simulator State
  const [simulating, setSimulating] = useState(false);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);
  const [gatewayFilter, setGatewayFilter] = useState<'all' | 'stripe' | 'razorpay'>('all');
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const handleRefund = async (txnId: string) => {
    if (!confirm('Are you sure you want to trigger a simulated refund for this transaction?')) return;
    setRefundingId(txnId);
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txnId, reason: 'Admin panel customer refund request' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Transaction ${txnId} refunded and associated order status set to cancelled.`);
        fetchSettings();
      } else {
        alert(data.error || 'Refund failed');
      }
    } catch {
      alert('Failed to connect to refund API');
    } finally {
      setRefundingId(null);
    }
  };

  const exportTransactionsCSV = () => {
    const headers = 'Transaction ID,Order Number,Gateway,Txn Ref,Amount,Status,Date\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.orderNumber}","${t.gateway}","${t.gatewayTransactionId}","${t.amount}","${t.status}","${t.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vegimart_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/gateway');
      const data = await res.json();
      if (data.success) {
        setActiveGateway(data.activeGateway);
        setIsTestMode(data.isTestMode);
        setTransactions(data.transactions || []);
        setWebhooks(data.webhooks || []);
        if (data.settings?.stripeConfig) {
          setStripePublishableKey(data.settings.stripeConfig.publishableKey || '');
          setStripeSecretKey(data.settings.stripeConfig.secretKeyMasked || '');
        }
        if (data.settings?.razorpayConfig) {
          setRazorpayKeyId(data.settings.razorpayConfig.keyId || '');
          setRazorpayKeySecret(data.settings.razorpayConfig.keySecretMasked || '');
        }
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSwitchGateway = async (gateway: PaymentGatewayType) => {
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeGateway: gateway,
          isTestMode
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveGateway(gateway);
        setFeedback(`Active processor successfully switched to ${gateway.toUpperCase()}! Next customer checkout will use ${gateway}.`);
      }
    } catch {
      setFeedback('Error changing active gateway.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeGateway,
          isTestMode,
          stripePublishableKey,
          stripeSecretKey: stripeSecretKey.includes('...') ? undefined : stripeSecretKey,
          razorpayKeyId,
          razorpayKeySecret: razorpayKeySecret.includes('...') ? undefined : razorpayKeySecret
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Gateway configuration & credentials saved successfully!');
        fetchSettings();
      }
    } catch {
      setFeedback('Failed to update credentials.');
    } finally {
      setUpdating(false);
    }
  };

  const handleTriggerWebhookSimulator = async (gateway: PaymentGatewayType) => {
    setSimulating(true);
    setSimFeedback(null);
    try {
      const res = await fetch('/api/admin/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway })
      });
      const data = await res.json();
      if (data.success) {
        setSimFeedback(`Simulated ${gateway.toUpperCase()} webhook event dispatched and recorded!`);
        fetchSettings();
      }
    } catch {
      setSimFeedback('Webhook simulation failed.');
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-vegimart-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading payment gateway matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-8 h-8 text-vegimart-green" />
          Dual Payment Gateway Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Switch active processors, manage API credentials, inspect transaction audit logs, and monitor webhooks.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {feedback}
        </div>
      )}

      {/* CORE GATEWAY SWITCHER SELECTOR */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Active Gateway Selector</h2>
            <p className="text-xs text-gray-500">
              One-click routing: the frontend checkout flow remains uniform while transactions are routed to the selected backend.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl text-xs">
            <span className="text-gray-500 font-medium px-2">Sandbox Mode:</span>
            <button
              type="button"
              onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                isTestMode
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {isTestMode ? 'Test / Sandbox' : 'Live Mode'}
            </button>
          </div>
        </div>

        {/* Dual Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Stripe */}
          <div
            onClick={() => handleSwitchGateway('stripe')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              activeGateway === 'stripe'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-lg shadow-indigo-100 ring-2 ring-indigo-600/20'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {activeGateway === 'stripe' && (
              <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" /> Active Processor
              </span>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                S
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900">Payment Gateway A: Stripe</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Global processing for Visa, MasterCard, American Express, Apple Pay, and Google Pay.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-indigo-100">
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Target Currency:</span>
                  <strong className="text-gray-800">AUD / USD</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Webhook Route:</span>
                  <span className="font-mono text-[11px] text-indigo-700 bg-indigo-100/60 px-1.5 py-0.5 rounded">
                    /api/webhooks/stripe
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Current Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
                  </span>
                </p>
              </div>

              <button
                type="button"
                disabled={updating || activeGateway === 'stripe'}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeGateway === 'stripe'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {activeGateway === 'stripe' ? 'Currently Active' : 'Switch to Stripe'}
              </button>
            </div>
          </div>

          {/* Option B: Razorpay */}
          <div
            onClick={() => handleSwitchGateway('razorpay')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              activeGateway === 'razorpay'
                ? 'border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-100 ring-2 ring-blue-600/20'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {activeGateway === 'razorpay' && (
              <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" /> Active Processor
              </span>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                R
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900">Payment Gateway B: Razorpay</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Seamless support for Unified Payments Interface (UPI - GPay, PhonePe, Paytm), NetBanking, and Cards.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-blue-100">
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Target Currency:</span>
                  <strong className="text-gray-800">INR / International</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Webhook Route:</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                    /api/webhooks/razorpay
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Current Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
                  </span>
                </p>
              </div>

              <button
                type="button"
                disabled={updating || activeGateway === 'razorpay'}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeGateway === 'razorpay'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {activeGateway === 'razorpay' ? 'Currently Active' : 'Switch to Razorpay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API KEY CONFIGURATION MODAL / FORM */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-700" /> Gateway API Credentials
            </h2>
            <p className="text-xs text-gray-500">
              Provide live credentials or leave defaults for the interactive test simulator.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveApiKeys} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Stripe Keys */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
              <h4 className="font-bold text-sm text-indigo-950">Stripe Credentials</h4>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Stripe Publishable Key</label>
                <input
                  type="text"
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  placeholder="pk_test_..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono text-xs focus:outline-hidden focus:border-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Stripe Secret Key</label>
                <input
                  type="password"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  placeholder="sk_test_..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono text-xs focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Razorpay Keys */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
              <h4 className="font-bold text-sm text-blue-950">Razorpay Credentials</h4>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Razorpay Key ID</label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_test_..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Razorpay Key Secret</label>
                <input
                  type="password"
                  value={razorpayKeySecret}
                  onChange={(e) => setRazorpayKeySecret(e.target.value)}
                  placeholder="Secret key..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              {updating ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* WEBHOOK SIMULATOR & MONITOR */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-vegimart-orange" /> Webhook Monitor & Test Dispatcher
            </h2>
            <p className="text-xs text-gray-500">
              Verify your webhook listeners for Stripe & Razorpay events directly without waiting for external webhooks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerWebhookSimulator('stripe')}
              disabled={simulating}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Simulate Stripe Event
            </button>
            <button
              onClick={() => handleTriggerWebhookSimulator('razorpay')}
              disabled={simulating}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Simulate Razorpay Event
            </button>
          </div>
        </div>

        {simFeedback && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            {simFeedback}
          </div>
        )}

        {/* Webhook log records */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Gateway</th>
                <th className="py-2.5 px-4">Event</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-400">
                    No webhooks recorded yet. Click one of the simulate buttons above.
                  </td>
                </tr>
              ) : (
                webhooks.slice(0, 5).map((wh) => (
                  <tr key={wh.id}>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                        wh.gateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
                      }`}>
                        {wh.gateway}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono">{wh.event}</td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {new Date(wh.receivedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-emerald-600 font-bold uppercase text-[10px]">
                        ✓ {wh.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLETE TRANSACTION AUDIT LEDGER */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Transaction Audit Ledger</h2>
            <p className="text-xs text-gray-500">
              Every checkout captures which processor handled the charge and the external transaction reference.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGatewayFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  gatewayFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setGatewayFilter('stripe')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  gatewayFilter === 'stripe'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Stripe ({transactions.filter((t) => t.gateway === 'stripe').length})
              </button>
              <button
                type="button"
                onClick={() => setGatewayFilter('razorpay')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  gatewayFilter === 'razorpay'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Razorpay ({transactions.filter((t) => t.gateway === 'razorpay').length})
              </button>
            </div>

            <button
              onClick={exportTransactionsCSV}
              className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={fetchSettings}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100"
              title="Refresh logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Gateway Ref</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {transactions.filter((t) => (gatewayFilter === 'all' ? true : t.gateway === gatewayFilter)).length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-400">
                    No {gatewayFilter !== 'all' ? gatewayFilter.toUpperCase() : ''} transactions found in ledger.
                  </td>
                </tr>
              ) : (
                transactions
                  .filter((t) => (gatewayFilter === 'all' ? true : t.gateway === gatewayFilter))
                  .map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-bold text-gray-900">{txn.orderNumber}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                          txn.gateway === 'stripe' ? 'bg-indigo-600' : 'bg-blue-600'
                        }`}>
                          {txn.gateway}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                        {txn.gatewayTransactionId}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{txn.paymentMethod}</td>
                      <td className="py-3 px-4 font-black text-gray-900">
                        ${txn.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          txn.status === 'succeeded'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-rose-700 bg-rose-50'
                        }`}>
                          {txn.status === 'failed' ? 'Refunded' : txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {txn.status === 'succeeded' ? (
                          <button
                            type="button"
                            onClick={() => handleRefund(txn.id)}
                            disabled={refundingId === txn.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {refundingId === txn.id ? 'Processing...' : 'Refund'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
