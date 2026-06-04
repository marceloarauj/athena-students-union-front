export type PaymentFormat = 'mensal' | 'anual' | 'unica' | 'gratis';

export type AdminInstitution = {
  id: number;
  alias: string;
  name: string;
  document: string;
  paymentFormat: PaymentFormat;
  primaryColor: string;
  saveLogs: boolean;
  active: boolean;
  createdAt: string;
};

export const PAYMENT_FORMAT_LABELS: Record<PaymentFormat, string> = {
  mensal: 'Mensal',
  anual: 'Anual',
  unica: 'Uma vez',
  gratis: 'Grátis',
};

export const RESERVED_ALIASES = ['admin'];
