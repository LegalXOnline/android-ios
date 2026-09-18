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
  /** Storage paths of the documents attached for this service. */
  documents?: { docType: string; path: string; name: string }[];
  coupon_code?: string;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
}

export const DEFAULT_BILLING_ORDER: BillingOrderPayload = {
  order_type: 'document',
  item_id: '',
  item_title: '',
  price: 0,
  user_name: '',
  user_email: '',
  user_phone: '',
  user_address: '',
  documents: [],
  coupon_code: '',
  discount_amount: 0,
  tax_amount: 0,
  total_amount: 0,
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

/**
 * The reference the server gave this order.
 *
 * Kept here rather than in the paying screen's state: that screen navigates
 * away the moment the order lands, so anything held locally is gone before the
 * confirmation can show it.
 */
let currentOrderReference: string | null = null;

export function getOrderReference(): string | null {
  return currentOrderReference;
}

export function setOrderReference(reference: string | null): void {
  currentOrderReference = reference;
}
