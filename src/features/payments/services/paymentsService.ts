import { IPaymentsService } from './paymentsInterface';
import { PaymentData } from '../models/paymentModel';

export class PaymentsService implements IPaymentsService {
  async getPaymentData(): Promise<PaymentData> {
    const response = await fetch('/api/payments');
    return response.json();
  }
}
