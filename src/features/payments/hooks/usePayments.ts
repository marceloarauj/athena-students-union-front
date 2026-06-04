'use client';

import { useEffect, useState } from 'react';
import { PaymentData } from '../models/paymentModel';
import { getPaymentsService } from '../services/paymentsInterface';

export function usePayments(institution: string) {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getPaymentsService(institution);
    service.getPaymentData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, [institution]);

  return { data, loading };
}
