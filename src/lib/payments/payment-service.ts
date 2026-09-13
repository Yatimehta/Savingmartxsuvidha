import { db } from '@/lib/db';
import { StripeGatewayAdapter } from './stripe-adapter';
import { RazorpayGatewayAdapter } from './razorpay-adapter';
import {
  CreateOrderPaymentParams,
  PaymentInitResponse,
  VerifyPaymentParams,
  VerifyPaymentResult,
  IPaymentGatewayAdapter
} from './types';
import { PaymentGatewayType, PaymentGatewayConfig, TransactionRecord } from '@/types';

class PaymentService {
  private adapters: Map<PaymentGatewayType, IPaymentGatewayAdapter>;

  constructor() {
    this.adapters = new Map();
    this.adapters.set('stripe', new StripeGatewayAdapter());
    this.adapters.set('razorpay', new RazorpayGatewayAdapter());
  }

  getActiveGateway(): PaymentGatewayType {
    const settings = db.getSettings();
    return settings.activeGateway;
  }

  getAdapter(gateway?: PaymentGatewayType): IPaymentGatewayAdapter {
    const targetGateway = gateway || this.getActiveGateway();
    const adapter = this.adapters.get(targetGateway);
    if (!adapter) {
      throw new Error(`Unsupported payment gateway: ${targetGateway}`);
    }
    return adapter;
  }

  getPublicConfig(): PaymentGatewayConfig {
    const settings = db.getSettings();
    return {
      activeGateway: settings.activeGateway,
      stripeEnabled: true,
      razorpayEnabled: true,
      isTestMode: settings.isTestMode,
      stripePublishableKey: settings.stripeConfig.publishableKey,
      razorpayKeyId: settings.razorpayConfig.keyId
    };
  }

  async initializeOrderPayment(params: CreateOrderPaymentParams): Promise<PaymentInitResponse> {
    const activeGateway = this.getActiveGateway();
    const adapter = this.getAdapter(activeGateway);
    return adapter.createPaymentOrder(params);
  }

  async verifyAndFinalizePayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const adapter = this.getAdapter(params.gateway);
    const verification = await adapter.verifyPayment(params);

    if (verification.success) {
      // 1. Record transaction in database
      const txnRecord: TransactionRecord = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        amount: params.amount,
        currency: params.gateway === 'razorpay' ? 'INR' : 'AUD',
        gateway: params.gateway,
        gatewayTransactionId: verification.transactionId,
        status: 'succeeded',
        paymentMethod: verification.paymentMethod,
        createdAt: new Date().toISOString()
      };
      db.recordTransaction(txnRecord);

      // 2. Update order in database
      const order = db.getOrderById(params.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'processing';
        order.paymentGateway = params.gateway;
        order.transactionId = verification.transactionId;
        db.updateOrder(order);
        // Decrement stock for all items
        for (const item of order.items) {
          db.decrementStock(item.productId, item.quantity);
        }
      }
    }

    return verification;
  }
}

export const paymentService = new PaymentService();
