import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS } from '../src/data/products';

async function seed() {
  console.log('🌱 Starting VegiMart × Suvidha database seeding...');

  const dataDir = path.join(process.cwd(), 'data');
  const storePath = path.join(dataDir, 'store.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const initialPayload = {
    products: INITIAL_PRODUCTS,
    orders: [
      {
        id: 'ord-sample-1',
        orderNumber: 'VM-98214',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        customer: {
          fullName: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          phone: '0412 345 678',
          addressLine1: '48 Collins Street, Apt 12B',
          suburb: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          deliveryInstructions: 'Leave in front lobby with concierge'
        },
        items: [
          {
            productId: 'prod-fruit-1',
            productName: 'Australian Pink Lady Apples',
            unit: 'per kg',
            price: 4.80,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'prod-suvidha-1',
            productName: 'Suvidha Cafe Hot Samosa Platter (4 pcs)',
            unit: 'pack of 4 with chutney',
            price: 8.50,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 18.10,
        deliveryFee: 4.99,
        discount: 0,
        tax: 1.81,
        total: 24.90,
        status: 'out_for_delivery',
        paymentGateway: 'stripe',
        paymentStatus: 'paid',
        transactionId: 'pi_test_stripe_98214',
        deliverySlot: 'Morning (8:00 AM - 11:00 AM)',
        estimatedDeliveryDate: 'Today'
      }
    ],
    transactions: [
      {
        id: 'txn-1',
        orderId: 'ord-sample-1',
        orderNumber: 'VM-98214',
        amount: 24.90,
        currency: 'AUD',
        gateway: 'stripe',
        gatewayTransactionId: 'pi_test_stripe_98214',
        status: 'succeeded',
        paymentMethod: 'Credit Card (Visa ****4242)',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ],
    webhooks: [
      {
        id: 'wh-1',
        gateway: 'stripe',
        event: 'payment_intent.succeeded',
        payload: { id: 'pi_test_stripe_98214', amount: 2490, currency: 'aud' },
        receivedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        status: 'processed'
      }
    ],
    settings: {
      activeGateway: 'stripe',
      isTestMode: true,
      stripeConfig: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MockStripeVegiMartKey001',
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_vegimart_secret',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_stripe_webhook_secret'
      },
      razorpayConfig: {
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_VegiMart99',
        keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mock_VegiMartSuvidha',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_whsec_mock_secret'
      },
      deliveryFee: 4.99,
      freeDeliveryThreshold: 50.0,
      storeName: 'VegiMart × Suvidha',
      storeAddress: '142 Market Street, Melbourne VIC 3000',
      contactEmail: 'orders@vegimartsuvidha.com.au',
      contactPhone: '+61 3 9876 5432'
    }
  };

  fs.writeFileSync(storePath, JSON.stringify(initialPayload, null, 2), 'utf-8');
  console.log(`✅ Seeded ${INITIAL_PRODUCTS.length} products successfully into ${storePath}`);

  // If DATABASE_URL is configured, also log PostgreSQL compatibility
  if (process.env.DATABASE_URL) {
    console.log('🔗 PostgreSQL DATABASE_URL detected. Prisma client can run `npx prisma db push`.');
  }
}

seed()
  .then(() => {
    console.log('🚀 Database seeding completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });
