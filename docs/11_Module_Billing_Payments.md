# 11. Module Spec — Billing & Payments (SCR-13, SCR-14, SCR-15)

> **Depends on:** `02_Information_Architecture.md` §4 (shared Billing decision), `07_Module_Documentation.md` §3.2, `10_Module_Consultation_Booking.md` §5, `04_Design_System.md` §5.3
> **Feeds into:** `13_Data_Model_Supabase_Schema.md`, `16_Payments_Razorpay.md`, `17_Notifications.md`

---

## 1. Purpose

One screen, one checkout flow, for both order types (document purchase and consultation booking). This is the highest-stakes screen in the app — every ambiguity here costs a transaction. No feature here should be "clever"; it should be unambiguous.

---

## 2. Screen: SCR-13 Billing

### 2.1 Layout (top to bottom)

1. **User Details** — Name, email, phone, address (pre-filled from `profiles`, editable inline). Address only required for document orders where physical delivery/notarization context matters (e.g. Legal Notice, Rent Agreement); not required for consultation bookings — render conditionally based on order type.
2. **Order Summary** (polymorphic — renders one of three variants, per `order_type`):
   - **Service Summary** (`document`): service name, subtype if applicable (`07` §3.3), price
   - **Verification Summary** (`verification`): package name, uploaded file name, language, problem type, price — per `26_Module_Document_Verification.md` §2.2
   - **Consultation Summary** (`consultation`): lawyer name/photo, mode, date/time or "Instant," rate per minute
3. **Coupon** — Collapsed "Have a coupon?" link (per `04_Design_System.md` §5.3), expands to input + Apply button on tap
4. **Price Breakdown** — Line items (base price, applicable discount, any page-count-based add-on per the two-tier pricing pattern in wireframes — "Below 10 pages / Above 10 pages" — where relevant), bold total row
5. **Buy Now** — Primary CTA → SCR-14 Razorpay Checkout

### 2.2 Order Payload Reconciliation

**Confirmed via founder-provided "Final Payment Architecture" diagram: three order types, one Billing implementation.** Billing must accept and correctly render **all three** payload shapes without a separate implementation per type:

| Field | Document order | Verification order | Consultation order |
|---|---|---|---|
| `order_type` | `"document"` | `"verification"` | `"consultation"` |
| `item_id` | `service_id` | `verification_package_id` | `lawyer_id` |
| `item_title` | Service name | Package name | Lawyer name |
| `price` | Fixed or tiered service price | Package price (tiered — see `26` §2.1) | `price_per_minute` (billed amount TBD — see §4) |
| `metadata` | Subtype selection (if applicable) | `uploaded_file_url`, `language`, `problem_type` | `mode`, `scheduled_date/time`, `is_instant` |

### 2.3 States

| State | Behavior |
|---|---|
| Invalid coupon | Inline error under coupon field, does not block Buy Now — total simply excludes the discount |
| Missing required field (e.g. phone) | Buy Now disabled until resolved, inline validation, not a blocking modal |
| Loading (fetching user profile prefill) | Skeleton on User Details block only, rest of screen renders from the order payload immediately |

---

## 3. Screen: SCR-14 Razorpay Checkout

- Native Razorpay SDK checkout sheet — presented modally over Billing, not a custom-built payment form.
- On success → SCR-15 Confirmation.
- On failure/cancellation → return to Billing, **order record is not created until payment is confirmed server-side** (webhook-based, not client-trusted — see `16_Payments_Razorpay.md`). This prevents "ghost orders" from abandoned checkouts.

---

## 4. Open Question — Consultation Billing Amount

Document orders have a fixed, known price at Billing time. Consultation orders are priced **per minute**, but a consultation's actual duration isn't known until the call ends. Two possible models — needs your decision before `16_Payments_Razorpay.md` can be finalized:

- **Model A — Pre-authorized block:** charge for a fixed block (e.g. 15 min) upfront, true-up or refund the difference after the call based on actual duration.
- **Model B — Wallet/LX Coin deduction:** treat LX Coin balance as the metering mechanism, deducting per minute in real time during the call, requiring a minimum balance to start.

Given LX Coin recharge/wallet-purchase logic is explicitly out of V1 scope (Product Vision §5), **Model A is the only one buildable within current V1 scope** — flagging this here so it's a conscious decision, not a default nobody chose.

---

## 5. Explicitly Out of Scope for This Module

- No saved payment methods / stored cards (Razorpay's own saved-card handling, if any, is Razorpay-side, not a LegalX feature to build).
- No installment/EMI options.
- No invoice/GST-invoice generation UI beyond what's needed for the Transactions history record (SCR-21) — formal tax invoicing is a backend/ops concern, not an app screen.
- No multi-item cart — one order (one document or one consultation) per Billing pass, per the wireframes showing a single order flowing through.

---

## 6. Analytics Events

- `billing_viewed` (props: `order_type`, `item_id`)
- `billing_coupon_applied` / `billing_coupon_failed`
- `billing_buy_now_tapped` (props: `order_type`, `total_price`)
- `payment_succeeded` / `payment_failed` (props: `order_type`, `amount`)

---

*Next: `12_Module_Profile.md` — profile, LX Coins, favourites, call history, transactions, support, pending your approval to proceed.*
