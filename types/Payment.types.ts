export interface PendingPayment {
  bookingId: string;
  paymentUrl: string;
  expiredAt: string;
}

export interface IPaymentParams {
  amount: number;
  bookingId: string;
  [key: string]: any;
} 