/**
 * Orders service — typed interface stubs.
 *
 * create-order calls a Supabase Edge Function (not a direct table write).
 * Order status is ONLY updated by the server webhook — never client-side.
 * See 18_API_Integration_Contracts.md §2, 16_Payments_Razorpay.md §2.
 */
import type { Order, Payment, VerificationPackage } from '@/types/database.types';
import type {
  CreateOrderInput,
  CreateOrderResponse,
  UploadVerificationDocumentInput,
  UploadVerificationDocumentResponse,
} from '@/types/api.types';

/**
 * Create an order (document | verification | consultation).
 * Calls the create-order Edge Function — validates coupon server-side,
 * never trusts client-calculated price.
 * See 18_API_Integration_Contracts §2 (create-order).
 */
export async function createOrder(_input: CreateOrderInput): Promise<CreateOrderResponse> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §2 (create-order)');
}

/**
 * Fetch a single order by ID to check its payment status.
 * Used to poll/check after Razorpay SDK callback — the SDK callback is
 * informational only; this call confirms actual server-side status.
 * See 16_Payments_Razorpay.md §2.
 */
export async function getOrderById(_orderId: string): Promise<Order> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: orders');
}

/** Fetch all of the current user's orders (for Transactions SCR-21). */
export async function getUserOrders(_profileId: string): Promise<{ orders: Order[]; payments: Payment[] }> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, tables: orders, payments');
}

/**
 * Upload a document for verification.
 * Calls upload-verification-document Edge Function.
 * See 18_API_Integration_Contracts §2 (upload-verification-document).
 */
export async function uploadVerificationDocument(
  _input: UploadVerificationDocumentInput,
): Promise<UploadVerificationDocumentResponse> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §2 (upload-verification-document)');
}

/** Fetch all verification packages. Filters to requires_human_review = true. */
export async function getVerificationPackages(): Promise<VerificationPackage[]> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: verification_packages');
}
