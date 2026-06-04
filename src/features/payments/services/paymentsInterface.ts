import { PaymentData } from '../models/paymentModel';
import { PaymentsMockService } from './paymentsMockService';
import { PaymentsService } from './paymentsService';
import { isMock } from '@/lib/serviceFactory';

export interface IPaymentsService {
  getPaymentData(): Promise<PaymentData>;
}

export function getPaymentsService(institution: string): IPaymentsService {
  return isMock(institution) ? new PaymentsMockService() : new PaymentsService();
}
