'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password, phone };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user, data.token);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('sarah.j@example.com');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="font-black text-2xl text-vegimart-green">
              Vegi<span className="text-vegimart-orange">Mart</span>
            </span>
            <span className="text-gray-400 font-light">×</span>
            <span className="font-bold text-xl text-gray-800">Suvidha</span>
          </div>
          <p className="text-xs text-gray-500">
            {mode === 'login' ? 'Welcome back! Sign in to your account.' : 'Create an account for faster express grocery delivery.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            New Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Mobile Phone (for delivery SMS)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0412 345 678"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-vegimart-green"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-vegimart-green hover:bg-green-800 text-white font-bold text-xs transition-colors shadow-xs mt-2"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to VegiMart' : 'Create Customer Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="text-center pt-1 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] text-vegimart-orange hover:underline font-semibold"
            >
              Fill Demo Credentials (Sarah Jenkins)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
