import crypto from 'crypto';
import {
  IPaymentGatewayAdapter,
  CreateOrderPaymentParams,
  PaymentInitResponse,
  VerifyPaymentParams,
  VerifyPaymentResult
} from './types';
import { db } from '@/lib/db';

export class RazorpayGatewayAdapter implements IPaymentGatewayAdapter {
  readonly gatewayName = 'razorpay' as const;

  async createPaymentOrder(params: CreateOrderPaymentParams): Promise<PaymentInitResponse> {
    const settings = db.getSettings();
    const isTestMode = settings.isTestMode;
    const keyId = settings.razorpayConfig.keyId;
    const keySecret = settings.razorpayConfig.keySecret;

    const isLiveKey = keyId && keySecret && keyId.startsWith('rzp_') && !keyId.includes('mock');

    if (isLiveKey) {
      try {
        const amountInSubunits = Math.round(params.amount * 100);
        const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amountInSubunits,
            currency: params.currency === 'INR' ? 'INR' : 'INR', // Razorpay primary currency
            receipt: params.orderNumber,
            notes: {
              orderId: params.orderId,
              customerEmail: params.customer.email
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          return {
            gateway: 'razorpay',
            orderId: params.orderId,
            orderNumber: params.orderNumber,
            amount: params.amount,
            currency: 'INR',
            gatewayOrderId: data.id,
            keyId: keyId,
            isTestMode
          };
        }
      } catch (err) {
        console.warn('Razorpay live API call failed, falling back to simulated sandbox:', err);
      }
    }

    // Sandbox / Test Mode
    const simulatedOrderId = `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return {
      gateway: 'razorpay',
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      amount: params.amount,
      currency: 'INR',
      gatewayOrderId: simulatedOrderId,
      keyId: keyId,
      isTestMode: true,
      extra: {
        supportedMethods: ['UPI (GPay / PhonePe / Paytm)', 'Credit/Debit Cards', 'NetBanking'],
        testUpi: 'success@razorpay'
      }
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const settings = db.getSettings();
    const keySecret = settings.razorpayConfig.keySecret;
    const isLiveKey = settings.razorpayConfig.keyId.startsWith('rzp_') && !settings.razorpayConfig.keyId.includes('mock');

    if (isLiveKey && params.razorpayOrderId && params.razorpayPaymentId && params.razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== params.razorpaySignature) {
        return {
          success: false,
          gateway: 'razorpay',
          transactionId: params.razorpayPaymentId,
          message: 'Razorpay signature verification failed',
          paymentMethod: 'Razorpay'
        };
      }
    }

    const txnId = params.razorpayPaymentId || `pay_${Math.random().toString(36).substring(2, 10)}`;
    return {
      success: true,
      gateway: 'razorpay',
      transactionId: txnId,
      paymentMethod: params.paymentMethod || 'Razorpay (UPI / NetBanking)'
    };
  }

  async handleWebhook(payload: Record<string, unknown>, signature?: string) {
    const event = (payload?.event as string) || 'payment.captured';
    const paymentEntity = ((payload?.payload as Record<string, unknown>)?.payment as Record<string, unknown>)?.entity as Record<string, unknown> | undefined;
    const txnId = (paymentEntity?.id as string) || 'pay_rzp_webhook';
    const notes = (paymentEntity?.notes as Record<string, unknown>) || {};
    const orderId = (notes?.orderId as string) || undefined;

    return {
      handled: true,
      event,
      orderId,
      transactionId: txnId
    };
  }
}
