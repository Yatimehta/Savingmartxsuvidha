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
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function HomePage() {
  const allProducts = db.getProducts();
  const freshProduce = allProducts.filter((p) => p.category === 'Fresh Fruits & Vegetables').slice(0, 8);
  const indianPantry = allProducts.filter((p) => p.category === 'Indian Pantry').slice(0, 8);
  const weeklyDeals = allProducts.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 8);
  const settings = db.getSettings();

  const heroAtta = allProducts.find((p) => p.name.toLowerCase().includes('aashirvaad') && p.name.toLowerCase().includes('atta')) || allProducts[0];
  const heroBanana = allProducts.find((p) => p.name.toLowerCase().includes('banana')) || allProducts[1];

  const categories = [
    {
      name: 'Fresh Fruits & Vegetables',
      slug: 'fresh-fruits-and-vegetables',
      tagline: 'Farm bananas, apples & spinach',
      badge: 'Daily Harvest',
      icon: '🍌',
      count: allProducts.filter((p) => p.category === 'Fresh Fruits & Vegetables').length,
      image: allProducts.find((p) => p.category === 'Fresh Fruits & Vegetables' && p.image)?.image || 'https://www.grocerz.com.au/storage/278/Grocerz---Bananas-_-1kg.webp'
    },
    {
      name: 'Indian Pantry',
      slug: 'indian-pantry',
      tagline: 'Aashirvaad atta, basmati & spices',
      badge: '100% Authentic',
      icon: '🌾',
      count: allProducts.filter((p) => p.category === 'Indian Pantry').length,
      image: allProducts.find((p) => p.category === 'Indian Pantry' && p.image)?.image || 'https://www.grocerz.com.au/storage/6518/Aashirvaad---Sudh-Chakki-Atta-Flour-10kg.webp'
    },
    {
      name: 'Daily Essentials',
      slug: 'daily-essentials',
      tagline: 'Sugar, Taj tea & breakfast',
      badge: 'Pantry Staples',
      icon: '☕',
      count: allProducts.filter((p) => p.category === 'Daily Essentials').length,
      image: allProducts.find((p) => p.category === 'Daily Essentials' && p.image)?.image || 'https://www.grocerz.com.au/storage/6518/Aashirvaad---Sudh-Chakki-Atta-Flour-10kg.webp'
    },
    {
      name: 'Frozen',
      slug: 'frozen',
      tagline: 'Samosas, green peas & rotis',
      badge: 'Ready to Cook',
      icon: '🥟',
      count: allProducts.filter((p) => p.category === 'Frozen').length,
      image: allProducts.find((p) => p.category === 'Frozen' && p.image)?.image || 'https://www.grocerz.com.au/storage/8630/Deep---Kawan-Paratha-Flaky-Roti-Family-Pack-_-1.35kg.webp'
    },
    {
      name: 'Snacks & Munchies',
      slug: 'snacks-munchies',
      tagline: 'Haldiram bhujia & Parle-G',
      badge: 'Tea-time Treats',
      icon: '🍪',
      count: allProducts.filter((p) => p.category === 'Snacks & Munchies').length,
      image: allProducts.find((p) => p.category === 'Snacks & Munchies' && p.image)?.image || 'https://www.grocerz.com.au/storage/3200/Haldiram_s---Patisa-_-500g.webp'
    },
    {
      name: 'Dairy Eggs & Fridge',
      slug: 'dairy-eggs-fridge',
      tagline: 'Paneer, yogurt, milk & butter',
      badge: 'Chilled Daily',
      icon: '🥛',
      count: allProducts.filter((p) => p.category === 'Dairy Eggs & Fridge').length,
      image: allProducts.find((p) => p.category === 'Dairy Eggs & Fridge' && p.image)?.image || 'https://www.grocerz.com.au/storage/3318/Ghee.png'
    },
    {
      name: 'Dry Fruits & Seeds',
      slug: 'dry-fruits-nuts-and-seeds',
      tagline: 'Almonds, cashews & raisins',
      badge: 'Premium Dry Fruits',
      icon: '🥜',
      count: allProducts.filter((p) => p.category === 'Dry Fruits & Seeds').length,
      image: allProducts.find((p) => p.category === 'Dry Fruits & Seeds' && p.image)?.image || 'https://www.grocerz.com.au/storage/1384/Royal---Cashew-Nuts-Whole-_-500g.webp'
    },
    {
      name: 'Drinks',
      slug: 'drinks',
      tagline: 'Mango juices & sodas',
      badge: 'Cold Drinks',
      icon: '🧃',
      count: allProducts.filter((p) => p.category === 'Drinks').length,
      image: allProducts.find((p) => p.category === 'Drinks' && p.image)?.image || 'https://www.grocerz.com.au/storage/1359/Frooti---Mango-Drink-_-1.2L.webp'
    }
  ];

  return (
    <div className="space-y-12 pb-16 bg-[#FFFBF0]">
      {/* AUTHENTIC ASYMMETRICAL HERO SECTION WITH PROMINENT YELLOW ACCENTS */}
      <section className="relative overflow-hidden bg-[#FFFBF0] border-b-2 border-[#FFC107] pt-8 pb-12 md:pt-12 md:pb-16">
        {/* Prominent Diagonal Yellow Accent Stripe (60px wide) */}
        <div className="absolute -top-10 left-1/4 w-16 h-[500px] bg-[#FFC107]/25 rotate-12 -z-0 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF9C4]/60 rounded-bl-[100px] -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-32 bg-[#C8E6C9]/30 rounded-tr-[50px] -z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            {/* Hero Left Content (70% asymmetric emphasis) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Yellow Pill Badge Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC107] text-[#1A1A1A] text-xs font-black shadow-2xs border border-amber-300">
                <Sparkles className="w-4 h-4 text-[#1B5E20]" />
                <span>EXCLUSIVE GROCERZ.COM.AU PRODUCTS & LIVE PRICES</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#FF6F00] flex items-center gap-2">
                  <span className="w-8 h-1 bg-[#FFC107] rounded-full inline-block"></span>
                  Fresh from Grocerz Australia
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-[#1B5E20] leading-[1.15]">
                  Crisp Farm Produce & <br />
                  <span className="text-[#FF6F00] relative inline-block">
                    Authentic Indian Staples
                    <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#FFC107]/40 -z-10 rounded"></span>
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#1A1A1A] max-w-2xl font-normal leading-relaxed">
                Source 100% genuine Australian farm produce, Aashirvaad chakki atta, Fortune basmati rice, Haldiram savouries, and chilled dairy with transparent AUD prices and seamless Stripe + Razorpay checkout.
              </p>

              {/* 3 Prominent Multi-Color Benefit Badges (Yellow Most Prominent) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* 1. Green Badge */}
                <div className="p-3 bg-emerald-50 rounded-[6px] border border-emerald-300 text-left flex items-center gap-2.5">
                  <Leaf className="w-5 h-5 text-[#1B5E20] shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-[#1B5E20] uppercase block">Fresh Produce</span>
                    <p className="text-xs font-bold text-gray-800">100% Farm Sourced</p>
                  </div>
                </div>

                {/* 2. Orange Badge */}
                <div className="p-3 bg-orange-50 rounded-[6px] border border-orange-300 text-left flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#FF6F00] shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-[#FF6F00] uppercase block">Express Delivery</span>
                    <p className="text-xs font-bold text-gray-800">Fast 2-Hour Slots</p>
                  </div>
                </div>

                {/* 3. Bright Yellow Badge (Largest & Most Prominent) */}
                <div className="p-3 bg-[#FFC107] rounded-[6px] border-2 border-amber-400 text-left flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#1B5E20] shrink-0" />
                  <div>
                    <span className="text-[10px] font-black text-[#1B5E20] uppercase block">Guaranteed Value</span>
                    <p className="text-xs font-black text-[#1A1A1A]">Official Grocerz Pricing</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/catalog"
                  className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-7 py-3 rounded-[8px] flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 text-sm sm:text-base border-2 border-transparent hover:border-[#FFC107]"
                >
                  Shop All {allProducts.length} Products <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                </Link>

                <Link
                  href="/catalog?category=indian-pantry"
                  className="bg-[#FFF9C4] hover:bg-[#FFC107] text-[#1B5E20] font-black px-6 py-3 rounded-[8px] flex items-center justify-center gap-2 border-2 border-[#FFC107] transition-colors text-sm sm:text-base"
                >
                  <Coffee className="w-4 h-4 text-[#FF6F00]" />
                  Explore Indian Pantry
                </Link>
              </div>
            </div>

            {/* Hero Right Visual Card (30% asymmetric accent) */}
            <div className="lg:col-span-4 relative">
              <div className="bg-white p-5 rounded-[8px] border-2 border-[#FFC107] shadow-md space-y-3.5 text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-black text-[#1B5E20] uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107]"></span>
                    Grocerz Best Sellers
                  </span>
                  <span className="text-[10px] text-[#1A1A1A] bg-[#FFC107] font-black px-2 py-0.5 rounded-[4px]">
                    IN STOCK
                  </span>
                </div>

                {/* Hero Item 1: Aashirvaad Atta */}
                {heroAtta && (
                  <Link
                    href={`/product/${heroAtta.id}`}
                    className="p-2.5 bg-[#FFF9C4]/50 rounded-[6px] border border-[#FFC107]/40 flex items-center gap-3 hover:bg-[#FFF9C4] transition-colors group block"
                  >
                    <div className="w-14 h-14 rounded-[4px] bg-white p-1 border border-gray-200 shrink-0 relative overflow-hidden">
                      <OptimizedImage
                        src={heroAtta.image}
                        alt={heroAtta.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-[#1B5E20] truncate">{heroAtta.brand}</p>
                      <p className="text-[#1A1A1A] font-bold text-xs truncate group-hover:text-[#1B5E20] transition-colors">{heroAtta.name}</p>
                      <p className="text-xs text-[#FF6F00] font-black mt-0.5">${heroAtta.price.toFixed(2)} AUD</p>
                    </div>
                  </Link>
                )}

                {/* Hero Item 2: Fresh Bananas */}
                {heroBanana && (
                  <Link
                    href={`/product/${heroBanana.id}`}
                    className="p-2.5 bg-[#FFF9C4]/50 rounded-[6px] border border-[#FFC107]/40 flex items-center gap-3 hover:bg-[#FFF9C4] transition-colors group block"
                  >
                    <div className="w-14 h-14 rounded-[4px] bg-white p-1 border border-gray-200 shrink-0 relative overflow-hidden">
                      <OptimizedImage
                        src={heroBanana.image}
                        alt={heroBanana.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-[#1B5E20] truncate">{heroBanana.brand}</p>
                      <p className="text-[#1A1A1A] font-bold text-xs truncate group-hover:text-[#1B5E20] transition-colors">{heroBanana.name}</p>
                      <p className="text-xs text-[#FF6F00] font-black mt-0.5">${heroBanana.price.toFixed(2)} AUD</p>
                    </div>
                  </Link>
                )}

                <div className="p-3 bg-[#FFC107] rounded-[6px] border border-amber-400 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <span className="font-black text-[#1A1A1A] block">Code: GROCERZ10 ($10 OFF)</span>
                    <span className="text-[11px] text-gray-800 font-medium">Free express delivery on $50+</span>
                  </div>
                  <Link
                    href="/catalog"
                    className="bg-[#1B5E20] hover:bg-[#144618] text-white font-extrabold px-3 py-1.5 rounded-[4px] text-xs shadow-2xs"
                  >
                    Claim
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER - ALL 8 GROCERZ CATEGORIES WITH REAL PRODUCT IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
              Shop 8 Grocerz Categories
            </h2>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              Verified Australian inventory sourced directly from Grocerz.com.au
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#FF6F00] hover:underline flex items-center gap-1"
          >
            All Products ({allProducts.length}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="p-3.5 bg-white rounded-[8px] border border-[#E0E0E0] hover:border-[#FFC107] hover:bg-[#FFF9C4]/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left group shadow-2xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-[#FFFBF0] p-1 border border-gray-200 shrink-0 relative">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-extrabold bg-[#FFF9C4] text-[#1A1A1A] px-2 py-0.5 rounded-[4px] border border-[#FFC107]/50 shadow-2xs">
                  {cat.count} items
                </span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#1B5E20] transition-colors leading-tight flex items-center gap-1">
                  <span>{cat.icon}</span> {cat.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORY 1: FRESH PRODUCE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-left">
            <span className="p-1.5 bg-[#C8E6C9] rounded-[4px] text-[#1B5E20]">
              <Leaf className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1B5E20]">
                Fresh Fruits & Vegetables
              </h2>
              <p className="text-xs text-gray-500">
                Direct Grocerz farm stock with Australian quality
              </p>
            </div>
          </div>

          <Link
            href="/catalog?category=fresh-fruits-and-vegetables"
            className="text-xs font-bold text-[#FF6F00] hover:text-[#E65100] flex items-center gap-1"
          >
            View all produce <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freshProduce.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CATEGORY 2: INDIAN PANTRY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[8px] bg-[#FFF9C4]/60 border border-[#FFC107] p-6 sm:p-8 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFC107]/40 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1B5E20] text-white text-[11px] font-bold rounded-[4px]">
                <Sparkles className="w-3 h-3 text-[#FFC107]" />
                Authentic Indian Pantry
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
                Atta, Basmati Rice, Ghee & Spices
              </h2>
              <p className="text-xs text-gray-700">
                Top brands: Aashirvaad, Fortune, Haldiram, Shan, and pure desi ghee
              </p>
            </div>

            <Link
              href="/catalog?category=indian-pantry"
              className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-5 py-2.5 rounded-[6px] text-xs transition-colors self-start sm:self-auto shadow-2xs flex items-center gap-1.5"
            >
              Shop Indian Pantry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {indianPantry.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL DEALS */}
      {weeklyDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 text-left">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FFCC99] rounded-[4px] text-[#FF6F00]">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1B5E20]">
                  Weekly Saver Deals
                </h2>
                <p className="text-xs text-gray-500">
                  Real discounts on verified Grocerz essentials
                </p>
              </div>
            </div>

            <Link
              href="/catalog"
              className="text-xs font-bold text-[#FF6F00] hover:underline"
            >
              See all deals
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* DUAL PAYMENT GATEWAY AUDIT & SWITCHER CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-[8px] bg-white border border-[#E0E0E0] shadow-xs text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C8E6C9] text-[#1B5E20] rounded-[4px] text-xs font-bold border border-emerald-300">
                <CreditCard className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Enterprise Dual Gateway Switcher</span>
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A]">
                Dual Payment Gateway Backend (Stripe & Razorpay)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Admins can switch active payment processors in real time. Transactions, webhooks, and order statuses are tracked with zero downtime.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-1 text-[#1B5E20]">
                  <CheckCircle className="w-3.5 h-3.5" /> Instant Gateway Toggle
                </span>
                <span className="flex items-center gap-1 text-[#1B5E20]">
                  <CheckCircle className="w-3.5 h-3.5" /> Full Audit Transaction Logs
                </span>
                <span className="flex items-center gap-1 text-[#1B5E20]">
                  <CheckCircle className="w-3.5 h-3.5" /> Stripe & Razorpay Test Simulators
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-2.5">
              <div className="p-3 bg-[#FFFBF0] rounded-[6px] border border-[#E0E0E0] text-center w-full">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Active Gateway</p>
                <p className="text-lg font-black text-[#FF6F00] uppercase mt-0.5">
                  {settings.activeGateway} Gateway
                </p>
              </div>

              <Link
                href="/admin/payments"
                className="w-full bg-[#1B5E20] hover:bg-[#144618] text-white font-bold text-xs py-2.5 rounded-[6px] text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                Open Admin Gateway Switcher <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
