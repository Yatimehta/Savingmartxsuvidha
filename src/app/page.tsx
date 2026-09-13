import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Clock,
  Coffee,
  CheckCircle,
  CreditCard,
  Flame,
  Star,
  ChevronRight
} from 'lucide-react';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';

export default function HomePage() {
  const allProducts = db.getProducts();
  const featuredProduce = allProducts.filter((p) => p.isFeatured && p.category !== 'suvidha-cafe').slice(0, 4);
  const suvidhaSpecials = allProducts.filter((p) => p.category === 'suvidha-cafe').slice(0, 4);
  const weeklyDeals = allProducts.filter((p) => p.originalPrice !== undefined).slice(0, 4);
  const settings = db.getSettings();

  const categories = [
    {
      id: 'fruits',
      name: 'Fresh Fruits',
      tagline: 'Hand-picked daily',
      color: 'from-amber-500/10 to-orange-500/20 border-orange-200 text-orange-800',
      icon: '🍎',
      count: allProducts.filter((p) => p.category === 'fruits').length
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      tagline: 'Crisp & farm-fresh',
      color: 'from-green-500/10 to-emerald-500/20 border-green-200 text-green-800',
      icon: '🥦',
      count: allProducts.filter((p) => p.category === 'vegetables').length
    },
    {
      id: 'suvidha-cafe',
      name: 'Suvidha Cafe & Grocery',
      tagline: 'Hot samosas & spices',
      color: 'from-orange-500/10 to-red-500/20 border-orange-300 text-orange-900',
      icon: '☕',
      count: allProducts.filter((p) => p.category === 'suvidha-cafe').length
    },
    {
      id: 'dairy-bakery',
      name: 'Dairy & Bakery',
      tagline: 'Sourdough & milk',
      color: 'from-yellow-500/10 to-amber-500/20 border-yellow-200 text-yellow-900',
      icon: '🥖',
      count: allProducts.filter((p) => p.category === 'dairy-bakery').length
    },
    {
      id: 'pantry',
      name: 'Pantry Essentials',
      tagline: 'Raw honey & oils',
      color: 'from-lime-500/10 to-emerald-500/20 border-lime-200 text-lime-900',
      icon: '🍯',
      count: allProducts.filter((p) => p.category === 'pantry').length
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 text-white pt-10 pb-16 md:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Decorative soft glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-vegimart-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
                <Leaf className="w-4 h-4 text-lime-400" />
                <span>VegiMart × Suvidha Co-Branded Grocery</span>
                <span className="w-1.5 h-1.5 rounded-full bg-vegimart-orange" />
                <span className="text-orange-300">2-Hour Express</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Crisp Farm Produce meets{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-lime-300">
                  Suvidha Cafe Delights.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                Experience the freshest Australian fruits, garden-picked vegetables, and authentic Suvidha hot samosas & specialty Indian groceries — all delivered with dual payment gateway checkout flexibility.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/catalog"
                  className="bg-vegimart-orange hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] text-sm sm:text-base"
                >
                  Shop Fresh Produce <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/catalog?category=suvidha-cafe"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-white/20 transition-all text-sm sm:text-base"
                >
                  <Coffee className="w-5 h-5 text-orange-400" />
                  Explore Suvidha Cafe
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs text-emerald-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>2-Hr Delivery Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>100% Farm Direct</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Stripe & Razorpay</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Feature Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Live Delivery Hub
                    </span>
                  </div>
                  <span className="text-xs text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
                    Active Gateway: <strong className="text-vegimart-orange uppercase">{settings.activeGateway}</strong>
                  </span>
                </div>

                {/* Produce Spotlight Preview */}
                <div className="space-y-3">
                  <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-3.5 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=200&q=80"
                      alt="Suvidha Samosa"
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-orange-300">Suvidha Cafe Hot Samosas</p>
                      <p className="text-white font-bold text-sm truncate">Handmade Crispy 4 Pcs Platter</p>
                      <p className="text-xs text-emerald-200 font-bold mt-0.5">$8.50 with Mint Chutney</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-3.5 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80"
                      alt="Pink Lady Apples"
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-300">Victorian Farm Harvest</p>
                      <p className="text-white font-bold text-sm truncate">Pink Lady Crisp Apples</p>
                      <p className="text-xs text-emerald-200 font-bold mt-0.5">$4.80 / kg (Special)</p>
                    </div>
                  </div>
                </div>

                {/* Special Promo code teaser */}
                <div className="p-3.5 bg-gradient-to-r from-orange-500/30 to-amber-500/20 rounded-2xl border border-orange-400/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-200 tracking-wider">
                      Welcome Deal
                    </span>
                    <p className="text-sm font-black text-white">Use code FRESH10 for $10 OFF</p>
                  </div>
                  <Link
                    href="/catalog"
                    className="bg-vegimart-orange text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fresh Australian produce & Suvidha ethnic cafe delights
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-vegimart-green hover:underline flex items-center gap-1"
          >
            View All ({allProducts.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className={`p-4 rounded-2xl border bg-gradient-to-b ${cat.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div>
                <h3 className="font-bold text-base group-hover:text-vegimart-orange transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">{cat.tagline}</p>
                <span className="inline-block mt-3 text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded-full">
                  {cat.count} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TODAY'S FARM HARVEST (FEATURED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl text-vegimart-green">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Today&apos;s Farm Harvest
              </h2>
              <p className="text-sm text-gray-500">
                100% Australian grown, hand-selected at peak freshness
              </p>
            </div>
          </div>

          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-vegimart-green hover:text-green-800"
          >
            See all produce <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProduce.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SUVIDHA GROCERY & CAFE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/60 rounded-full text-xs font-bold uppercase tracking-wider text-orange-100 border border-orange-400/40">
              <Coffee className="w-3.5 h-3.5" />
              Suvidha Cafe & Indian Grocery
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Craving Fresh Cafe Samosas & Fragrant Spices?
            </h2>

            <p className="text-orange-100/90 text-sm sm:text-base leading-relaxed">
              Order Suvidha&apos;s beloved housemade samosas, aged Himalayan basmati, stone-ground flours, and fresh paneer right alongside your daily fruit & vegetable haul.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/catalog?category=suvidha-cafe"
                className="bg-vegimart-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                Shop Suvidha Specials <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-orange-200">
                ✓ Samosas baked & fried fresh every morning
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {suvidhaSpecials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WEEKLY SPECIAL DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-xl text-vegimart-orange">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Weekly Saver Specials
              </h2>
              <p className="text-sm text-gray-500">
                Discounted prices on top-quality pantry and produce
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* DUAL PAYMENT GATEWAY EXPLAINER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-vegimart-green rounded-full text-xs font-semibold border border-green-200">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Enterprise Dual Gateway Backend</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                Seamless Checkout Powered by Stripe or Razorpay
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our backend features an intelligent payment adapter routing transactions seamlessly. Admins can switch between Stripe (Cards/Apple Pay) and Razorpay (UPI/Cards/Netbanking) in real time without altering the customer checkout flow.
              </p>
              <div className="flex items-center gap-6 pt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Instant Gateway Switching
                </span>
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Full Audit Transaction Logs
                </span>
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Webhook Event Sync
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-3">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center w-full">
                <p className="text-xs text-gray-500 font-medium">Currently Active Processor</p>
                <p className="text-xl font-black text-vegimart-green uppercase mt-1">
                  {settings.activeGateway} Gateway
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Mode: Sandbox Simulator Ready</p>
              </div>

              <Link
                href="/admin/payments"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                Open Admin Gateway Switcher <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
