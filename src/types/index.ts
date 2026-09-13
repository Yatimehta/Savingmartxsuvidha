export type ProductCategory =
  | 'all'
  | 'Fresh Fruits & Vegetables'
  | 'fresh-fruits-and-vegetables'
  | 'Indian Pantry'
  | 'indian-pantry'
  | 'Daily Essentials'
  | 'daily-essentials'
  | 'Frozen'
  | 'frozen'
  | 'Snacks & Munchies'
  | 'snacks-munchies'
  | 'Dairy Eggs & Fridge'
  | 'dairy-eggs-fridge'
  | 'Dry Fruits & Seeds'
  | 'dry-fruits-nuts-and-seeds'
  | 'Drinks'
  | 'drinks'
  | string;

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  categoryName?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  origin?: string;
  freshnessBadge?: string;
  dietary?: string[];
  description: string;
  nutrition?: {
    servingSize: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };
  image: string;
  tags?: string[];
  isFeatured?: boolean;
  isOrganic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentGatewayType = 'stripe' | 'razorpay';

export interface PaymentGatewayConfig {
  activeGateway: PaymentGatewayType;
  stripeEnabled: boolean;
  razorpayEnabled: boolean;
  isTestMode: boolean;
  stripePublishableKey: string;
  razorpayKeyId: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  state: string;
  postcode: string;
  deliveryInstructions?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentGateway: PaymentGatewayType;
  paymentStatus: 'paid' | 'pending' | 'failed';
  transactionId: string;
  deliverySlot: string;
  estimatedDeliveryDate: string;
}

export interface TransactionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  gateway: PaymentGatewayType;
  gatewayTransactionId: string;
  status: 'succeeded' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface WebhookLog {
  id: string;
  gateway: PaymentGatewayType;
  event: string;
  payload: Record<string, unknown>;
  receivedAt: string;
  status: 'processed' | 'ignored' | 'failed';
}

export interface SystemSettings {
  activeGateway: PaymentGatewayType;
  isTestMode: boolean;
  stripeConfig: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  razorpayConfig: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  deliveryFee: number;
  freeDeliveryThreshold: number;
  storeName: string;
  storeAddress: string;
  contactEmail: string;
  contactPhone: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  phone: string;
  addresses: ShippingAddress[];
  role?: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface ServerCart {
  id: string;
  userId?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }[];
  updatedAt: string;
}
