import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS } from '@/data/products';
import {
  Product,
  Order,
  TransactionRecord,
  WebhookLog,
  SystemSettings,
  PaymentGatewayType,
  OrderStatus,
  User,
  ServerCart
} from '@/types';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  transactions: TransactionRecord[];
  webhooks: WebhookLog[];
  settings: SystemSettings;
  users?: User[];
  carts?: ServerCart[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'store.json');

const DEFAULT_SETTINGS: SystemSettings = {
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
};

function ensureDataDirectory(): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let inMemoryCache: DatabaseSchema | null = null;
let lastFileMtime = 0;

function readDb(): DatabaseSchema {
  ensureDataDirectory();

  // If in-memory cache is fresh, serve directly from RAM for maximum throughput
  if (inMemoryCache && fs.existsSync(DB_FILE_PATH)) {
    try {
      const currentMtime = fs.statSync(DB_FILE_PATH).mtimeMs;
      if (currentMtime === lastFileMtime) {
        return inMemoryCache;
      }
    } catch {
      return inMemoryCache;
    }
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = {
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
              productId: 'grocerz-1688',
              productName: 'Fresh Coriander',
              unit: '1 Bunch',
              price: 2.49,
              quantity: 2,
              image: 'https://www.grocerz.com.au/storage/7996/Grocerz---Coriander-1-Bunch.webp'
            },
            {
              productId: 'grocerz-3882',
              productName: 'Aashirvaad Sudh Chakki Atta Flour Export Pack',
              unit: '10kg',
              price: 17.99,
              quantity: 1,
              image: 'https://www.grocerz.com.au/storage/7858/Aashirvaad---Sudh-Chakki-Atta-Flour-Export-Pack-_-10kg.webp'
            }
          ],
          subtotal: 22.97,
          deliveryFee: 4.99,
          discount: 0,
          tax: 2.30,
          total: 30.26,
          status: 'out_for_delivery',
          paymentGateway: 'stripe',
          paymentStatus: 'paid',
          transactionId: 'txn_mock_stripe_98214',
          deliverySlot: 'Morning (8:00 AM - 11:00 AM)',
          estimatedDeliveryDate: 'Today'
        }
      ],
      transactions: [
        {
          id: 'txn-1',
          orderId: 'ord-sample-1',
          orderNumber: 'VM-98214',
          amount: 30.26,
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
          payload: { id: 'pi_test_stripe_98214', amount: 3026, currency: 'aud' },
          receivedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          status: 'processed'
        }
      ],
      settings: DEFAULT_SETTINGS
    };
    writeDb(initialData);
    inMemoryCache = initialData;
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    inMemoryCache = parsed;
    lastFileMtime = fs.statSync(DB_FILE_PATH).mtimeMs;
    return parsed;
  } catch {
    const fallback: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: [],
      transactions: [],
      webhooks: [],
      settings: DEFAULT_SETTINGS
    };
    writeDb(fallback);
    inMemoryCache = fallback;
    return fallback;
  }
}

function writeDb(data: DatabaseSchema): void {
  ensureDataDirectory();
  inMemoryCache = data;
  const tmpPath = `${DB_FILE_PATH}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, DB_FILE_PATH);
    lastFileMtime = fs.statSync(DB_FILE_PATH).mtimeMs;
  } catch {
    // Fallback direct write
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Database API helper object
export const db = {
  // Products
  getProducts(): Product[] {
    return readDb().products;
  },
  getProductById(id: string): Product | undefined {
    return readDb().products.find((p) => p.id === id);
  },
  getProductBySlug(slug: string): Product | undefined {
    return readDb().products.find((p) => p.slug === slug);
  },
  saveProduct(product: Product): Product {
    const data = readDb();
    const index = data.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      data.products[index] = product;
    } else {
      data.products.unshift(product);
    }
    writeDb(data);
    return product;
  },
  deleteProduct(id: string): boolean {
    const data = readDb();
    const lenBefore = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    writeDb(data);
    return data.products.length < lenBefore;
  },
  decrementStock(productId: string, qty: number): void {
    const data = readDb();
    const product = data.products.find((p) => p.id === productId);
    if (product) {
      product.stockCount = Math.max(0, product.stockCount - qty);
      if (product.stockCount === 0) {
        product.inStock = false;
      }
      writeDb(data);
    }
  },

  // Orders
  getOrders(): Order[] {
    return readDb().orders;
  },
  getOrderById(id: string): Order | undefined {
    return readDb().orders.find((o) => o.id === id || o.orderNumber === id);
  },
  createOrder(order: Order): Order {
    const data = readDb();
    data.orders.unshift(order);
    writeDb(data);
    return order;
  },
  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const data = readDb();
    const order = data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = status;
      writeDb(data);
      return order;
    }
    return null;
  },
  updateOrder(updatedOrder: Order): Order | null {
    const data = readDb();
    const index = data.orders.findIndex(
      (o) => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber
    );
    if (index >= 0) {
      data.orders[index] = updatedOrder;
      writeDb(data);
      return updatedOrder;
    }
    return null;
  },

  // Transactions
  getTransactions(): TransactionRecord[] {
    return readDb().transactions;
  },
  recordTransaction(txn: TransactionRecord): TransactionRecord {
    const data = readDb();
    data.transactions.unshift(txn);
    writeDb(data);
    return txn;
  },

  // Webhooks
  getWebhooks(): WebhookLog[] {
    return readDb().webhooks;
  },
  recordWebhook(log: WebhookLog): WebhookLog {
    const data = readDb();
    data.webhooks.unshift(log);
    // Keep last 100 webhooks
    if (data.webhooks.length > 100) {
      data.webhooks = data.webhooks.slice(0, 100);
    }
    writeDb(data);
    return log;
  },

  // Settings
  getSettings(): SystemSettings {
    const data = readDb();
    return { ...DEFAULT_SETTINGS, ...data.settings };
  },
  updateSettings(settingsUpdate: Partial<SystemSettings>): SystemSettings {
    const data = readDb();
    data.settings = { ...data.settings, ...settingsUpdate };
    writeDb(data);
    return data.settings;
  },
  setActiveGateway(gateway: PaymentGatewayType): SystemSettings {
    const data = readDb();
    data.settings.activeGateway = gateway;
    writeDb(data);
    return data.settings;
  },

  // Users & Auth
  getUsers(): User[] {
    const data = readDb();
    return data.users || [];
  },
  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  },
  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(user: User): User {
    const data = readDb();
    if (!data.users) data.users = [];
    data.users.unshift(user);
    writeDb(data);
    return user;
  },

  // Server-Side Cart
  getCart(userId: string): ServerCart {
    const data = readDb();
    if (!data.carts) data.carts = [];
    let cart = data.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart_${Date.now()}`,
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
      data.carts.push(cart);
      writeDb(data);
    }
    return cart;
  },
  saveCart(cart: ServerCart): ServerCart {
    const data = readDb();
    if (!data.carts) data.carts = [];
    const index = data.carts.findIndex((c) => c.id === cart.id || (cart.userId && c.userId === cart.userId));
    if (index >= 0) {
      data.carts[index] = cart;
    } else {
      data.carts.push(cart);
    }
    writeDb(data);
    return cart;
  },
  clearCart(userId: string): void {
    const data = readDb();
    if (data.carts) {
      const cart = data.carts.find((c) => c.userId === userId);
      if (cart) {
        cart.items = [];
        cart.updatedAt = new Date().toISOString();
        writeDb(data);
      }
    }
  },

  // Refunds
  refundTransaction(transactionId: string, reason = 'Customer requested refund'): TransactionRecord | null {
    const data = readDb();
    const txn = data.transactions.find((t) => t.id === transactionId || t.gatewayTransactionId === transactionId);
    if (txn) {
      txn.status = 'failed'; // marked refunded/reversed
      txn.metadata = { ...txn.metadata, refundReason: reason, refundedAt: new Date().toISOString() };
      
      const order = data.orders.find((o) => o.id === txn.orderId || o.orderNumber === txn.orderNumber);
      if (order) {
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
      }
      writeDb(data);
      return txn;
    }
    return null;
  }
};
