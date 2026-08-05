export type OrderType = 'document' | 'verification' | 'consultation' | 'coins';

export interface BillingOrderPayload {
  order_type: OrderType;
  item_id: string;
  item_title: string;
  price: number;
  lawyer_name?: string;
  package_name?: string;
  mode?: string;
  date_time?: string;
  uploaded_file_name?: string;
  notes?: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address?: string;
  coupon_code?: string;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
}

export const DEFAULT_BILLING_ORDER: BillingOrderPayload = {
  order_type: 'document',
  item_id: 'service-gst-registration',
  item_title: 'GST Registration & Audit Package',
  price: 1499,
  user_name: 'Prince Kumar',
  user_email: 'prince.kumar@example.com',
  user_phone: '+91 98765 43210',
  user_address: '42, Cyber City, Sector 24, Gurugram, Haryana',
  coupon_code: '',
  discount_amount: 0,
  tax_amount: 270,
  total_amount: 1769,
};

let currentBillingOrder: BillingOrderPayload = { ...DEFAULT_BILLING_ORDER };

export function getBillingOrder(): BillingOrderPayload {
  return currentBillingOrder;
}

export function setBillingOrder(order: Partial<BillingOrderPayload>): void {
  currentBillingOrder = { ...currentBillingOrder, ...order };
}

export function resetBillingOrder(): void {
  currentBillingOrder = { ...DEFAULT_BILLING_ORDER };
}
