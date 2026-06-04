export type InvoiceStatus = 'paid' | 'pending';

export type Invoice = {
  id: string;
  month: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
};

export type PaymentSummary = {
  totalPaid: number;
  totalPending: number;
  totalAnnual: number;
};

export type PaymentData = {
  invoices: Invoice[];
  summary: PaymentSummary;
};
