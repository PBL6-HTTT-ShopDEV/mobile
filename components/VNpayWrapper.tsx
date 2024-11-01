// src/components/VNPayWrapper.tsx
import React from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { EmitterSubscription } from 'react-native';

// Define the VNPay payment parameters interface
interface VNPayParams {
  scheme: string;
  isSandbox: boolean;
  paymentUrl: string;
  tmn_code: string;
  returnschema: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  bankCode: string;
  locale: string;
}

// Define the payment result type
interface PaymentResult {
  resultCode: string;
  message?: string;
}

// Define the VNPay merchant module interface
interface VNPayMerchantModule {
  show: (params: VNPayParams) => void;
}

class VNPayService {
  private static instance: VNPayService;
  private eventEmitter: NativeEventEmitter;
  private eventListener?: EmitterSubscription;
  private vnpayModule: VNPayMerchantModule;

  private constructor() {
    // Get the native module
    const VnpayMerchant = NativeModules.VnpayMerchant;
    
    if (!VnpayMerchant) {
      throw new Error('VNPay Merchant module is not properly linked');
    }

    this.vnpayModule = VnpayMerchant;
    this.eventEmitter = new NativeEventEmitter(VnpayMerchant);
  }

  public static getInstance(): VNPayService {
    if (!VNPayService.instance) {
      VNPayService.instance = new VNPayService();
    }
    return VNPayService.instance;
  }

  public initializePayment(
    params: VNPayParams,
    onSuccess: (result: PaymentResult) => void,
    onError: (error: PaymentResult) => void
  ): void {
    try {
      // Remove any existing listeners
      if (this.eventListener) {
        this.eventListener.remove();
      }

      // Add new payment result listener
      this.eventListener = this.eventEmitter.addListener('PaymentBack', (event) => {
        if (!event) {
          onError({ resultCode: '-1', message: 'No response from payment gateway' });
          return;
        }

        switch (event.resultCode) {
          case '00':
            onSuccess({ resultCode: event.resultCode, message: 'Payment successful' });
            break;
          case '01':
            onError({ resultCode: event.resultCode, message: 'Transaction failed' });
            break;
          case '02':
            onError({ resultCode: event.resultCode, message: 'Transaction cancelled' });
            break;
          case '03':
            onError({ resultCode: event.resultCode, message: 'Invalid merchant' });
            break;
          case '04':
            onError({ resultCode: event.resultCode, message: 'Invalid parameters' });
            break;
          default:
            onError({ resultCode: event.resultCode, message: 'Unknown error occurred' });
        }
      });

      // Show payment UI
      this.vnpayModule.show(params);
    } catch (error) {
      onError({ resultCode: '-1', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  public cleanup(): void {
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }
}

// Hook for using VNPay
export const useVNPay = () => {
  const vnpayService = VNPayService.getInstance();

  React.useEffect(() => {
    return () => {
      vnpayService.cleanup();
    };
  }, []);

  const startPayment = async (
    params: VNPayParams,
    onSuccess: (result: PaymentResult) => void,
    onError: (error: PaymentResult) => void
  ) => {
    vnpayService.initializePayment(params, onSuccess, onError);
  };

  return { startPayment };
};

export type { VNPayParams, PaymentResult };