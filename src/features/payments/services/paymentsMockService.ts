import { IPaymentsService } from './paymentsInterface';
import { PaymentData } from '../models/paymentModel';
import data from '@/seeds/payments_data.json';

export class PaymentsMockService implements IPaymentsService {
  async getPaymentData(): Promise<PaymentData> {
    return data as PaymentData;
  }
}
