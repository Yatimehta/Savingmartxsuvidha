import { PaymentGatewayType, ShippingAddress } from '@/types';

export interface CreateOrderPaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number; // in dollars (e.g. 25.50)
  currency: string; // e.g. 'AUD' or 'INR'
  customer: ShippingAddress;
  itemsDescription: string;
}

export interface PaymentInitResponse {
  gateway: PaymentGatewayType;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  // Gateway-specific tokens
  gatewayOrderId?: string;
  clientSecret?: string;
  keyId?: string;
  isTestMode: boolean;
  extra?: Record<string, unknown>;
}

export interface VerifyPaymentParams {
  gateway: PaymentGatewayType;
  orderId: string;
  orderNumber: string;
  amount: number;
  // Stripe specifics
  paymentIntentId?: string;
  // Razorpay specifics
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  gateway: PaymentGatewayType;
  transactionId: string;
  message?: string;
  paymentMethod: string;
}

export interface IPaymentGatewayAdapter {
  readonly gatewayName: PaymentGatewayType;
  createPaymentOrder(params: CreateOrderPaymentParams): Promise<PaymentInitResponse>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  handleWebhook(payload: Record<string, unknown>, signature?: string): Promise<{
    handled: boolean;
    event: string;
    orderId?: string;
    transactionId?: string;
  }>;
}
