import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PaymentGatewayType } from '@/types';

export async function GET() {
  try {
    const settings = db.getSettings();
    const transactions = db.getTransactions();
    const webhooks = db.getWebhooks();

    return NextResponse.json({
      success: true,
      activeGateway: settings.activeGateway,
      isTestMode: settings.isTestMode,
      settings: {
        activeGateway: settings.activeGateway,
        isTestMode: settings.isTestMode,
        stripeConfig: {
          publishableKey: settings.stripeConfig.publishableKey,
          // Mask secret key for security
          secretKeyMasked: settings.stripeConfig.secretKey
            ? `${settings.stripeConfig.secretKey.substring(0, 7)}...${settings.stripeConfig.secretKey.slice(-4)}`
            : '',
          hasSecretKey: Boolean(settings.stripeConfig.secretKey),
          webhookSecret: settings.stripeConfig.webhookSecret ? 'whsec_***' : ''
        },
        razorpayConfig: {
          keyId: settings.razorpayConfig.keyId,
          keySecretMasked: settings.razorpayConfig.keySecret
            ? `${settings.razorpayConfig.keySecret.substring(0, 6)}...${settings.razorpayConfig.keySecret.slice(-3)}`
            : '',
          hasKeySecret: Boolean(settings.razorpayConfig.keySecret),
          webhookSecret: settings.razorpayConfig.webhookSecret ? '***' : ''
        }
      },
      transactions,
      webhooks
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin gateway settings';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      activeGateway,
      isTestMode,
      stripePublishableKey,
      stripeSecretKey,
      razorpayKeyId,
      razorpayKeySecret
    }: {
      activeGateway?: PaymentGatewayType;
      isTestMode?: boolean;
      stripePublishableKey?: string;
      stripeSecretKey?: string;
      razorpayKeyId?: string;
      razorpayKeySecret?: string;
    } = body;

    const currentSettings = db.getSettings();

    const updatedSettings = db.updateSettings({
      activeGateway: activeGateway !== undefined ? activeGateway : currentSettings.activeGateway,
      isTestMode: isTestMode !== undefined ? isTestMode : currentSettings.isTestMode,
      stripeConfig: {
        publishableKey: stripePublishableKey !== undefined ? stripePublishableKey : currentSettings.stripeConfig.publishableKey,
        secretKey: stripeSecretKey ? stripeSecretKey : currentSettings.stripeConfig.secretKey,
        webhookSecret: currentSettings.stripeConfig.webhookSecret
      },
      razorpayConfig: {
        keyId: razorpayKeyId !== undefined ? razorpayKeyId : currentSettings.razorpayConfig.keyId,
        keySecret: razorpayKeySecret ? razorpayKeySecret : currentSettings.razorpayConfig.keySecret,
        webhookSecret: currentSettings.razorpayConfig.webhookSecret
      }
    });

    return NextResponse.json({
      success: true,
      message: `Active gateway switched to ${updatedSettings.activeGateway.toUpperCase()}`,
      activeGateway: updatedSettings.activeGateway,
      isTestMode: updatedSettings.isTestMode
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update gateway settings';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
