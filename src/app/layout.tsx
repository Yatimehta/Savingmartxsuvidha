import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { TopBanner } from '@/components/layout/TopBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VegiMart × Suvidha | Fresh Produce & Grocery Delivery',
  description:
    'Fresh Australian farm produce, crisp fruits, organic vegetables, and Suvidha Cafe snacks delivered in under 2 hours. Powered by dual payment gateways (Stripe & Razorpay).',
  keywords: [
    'grocery delivery',
    'fresh produce',
    'igashop',
    'suvidha cafe',
    'samosas',
    'organic vegetables',
    'australian fruits',
    'melbourne groceries'
  ],
  authors: [{ name: 'VegiMart × Suvidha' }],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#F8F9FA] text-gray-900 antialiased selection:bg-green-100 selection:text-green-900">
        <TopBanner />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
