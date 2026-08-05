# 18. API & Integration Contracts

> **Depends on:** `13_Data_Model_Supabase_Schema.md`, `15_Realtime_Communication_Agora.md`, `16_Payments_Razorpay.md`, `08_Module_Knowledge_Centre.md` (§4 GitHub contract)
> **Feeds into:** `20_Non_Functional_Requirements.md`, `22_QA_Test_Plan.md`
> **Format note:** Contracts described as inputs/outputs/behavior, not code — actual implementation (Supabase Edge Functions, client calls) is an engineering task downstream of this doc.

---

## 1. Purpose

This is the seam list — every point where the app talks to something outside itself. Each entry defines *what* crosses the boundary and *why*, so backend and frontend work can proceed in parallel against a shared contract.

---

## 2. Supabase Edge Functions (Server-Side Logic)

| Function | Trigger | Input | Output | Notes |
|---|---|---|---|---|
| `create-order` | Buyer taps Buy Now/Continue (Billing) | `order_type` (`document`\|`verification`\|`consultation`), `item_id`, `metadata`, coupon code (optional) | `order_id`, `razorpay_order_id` | Validates coupon server-side; never trusts client-calculated price (`16` §2). Handles all three order types with one function — no per-type branching at the API-contract level |
| `upload-verification-document` | Buyer uploads a file on Upload Document (SCR-24) | File binary, `profile_id` | `uploaded_file_url` | Stored in Supabase Storage, private bucket; URL passed into `create-order` metadata for `verification` order type |
| `verify-payment-webhook` | Razorpay webhook | Razorpay signature + payload | Updates `orders.status`, creates `payments` row | Signature verification is mandatory before any state change (`16` §2) |
| `create-agora-session` | Consultation order confirmed paid | `consultation_id` | Agora token + channel name | Only issued after server-verified `order.status = paid` (`15` §2) |
| `report-session-duration` | Consultation session ends | `consultation_id`, join/leave event timestamps (server-recorded, not client-reported) | `actual_duration_minutes` written to `consultations` | Feeds billing true-up (`16` §4) |
| `process-refund` | No-show, under-time true-up, cancellation | `order_id`, `refund_type`, `amount` | Refund status | Calls Razorpay refund API |
| `send-notification` | Various triggers (`17` §3) | `profile_id`, `notification_type`, `payload` | Delivery status | Handles push + WhatsApp fallback logic (`17` §4) |
| `sync-lawyer-availability` (read) | Date/Time Selection screens load | `lawyer_id`, `date_range` (app enforces 5-day window on read, per `13` §2.5) | Available slots | Read-only from this app's perspective — availability is set on the lawyer PWA dashboard |

---

## 3. Direct Supabase Client Calls (No Edge Function Needed)

Standard authenticated reads/writes that don't need custom server logic, governed entirely by RLS (`13` §3):

| Operation | Table(s) | Notes |
|---|---|---|
| Fetch services list/detail | `services` | Public read |
| Fetch verification packages | `verification_packages` | Public read; app must filter/display only `requires_human_review = true` packages per `01` §4a pending the AI-tier decision |
| Fetch lawyer listing/profile | `lawyers` (filtered `is_enrolled_advocate = true`) | Public read, compliance-filtered at query level |
| Fetch/update own profile | `profiles` | Own-row RLS |
| Fetch own orders/transactions | `orders`, `payments` | Own-row RLS |
| Fetch own consultations/call history | `consultations` | Own-row RLS |
| Add/remove favourite lawyer | `favourite_lawyers` | Own-row RLS |
| Submit consultation review | `consultation_reviews` | Own-row RLS, only after `consultation.status = completed` (`13` §3) |
| Fetch own wallet balance | `wallets` | Own-row RLS, read-only from client (writes are server-only per `13` §3) |

---

## 4. GitHub Knowledge Centre Fetch (V2 — contract shape only)

Per `08_Module_Knowledge_Centre.md` §4, this is not implemented in V1 but the contract shape is fixed now so placeholder components don't need rework later.

| Field | Type | Notes |
|---|---|---|
| `article.headline` | String | |
| `article.body` | String (Markdown or plain) | |
| `article.hero_image_url` | String | |
| `article.category` | String | Matches placeholder category tabs (`08` §2.1) |
| `article.sources` | Array of strings/URLs | |

**V1 build requirement (restated from `08`):** placeholder components consume this exact shape from static/dummy data, so wiring in a real fetch later is a data-source swap, not a component rewrite.

---

## 5. Razorpay Integration Points

Covered in detail in `16_Payments_Razorpay.md` — summarized here for completeness of the seam list:
- Order creation (`create-order` → Razorpay order API)
- Checkout SDK (client-side, native sheet)
- Webhook (`verify-payment-webhook`)
- Refunds (`process-refund` → Razorpay refund API)

## 6. Agora Integration Points

Covered in detail in `15_Realtime_Communication_Agora.md` — summarized here:
- Token/channel generation (`create-agora-session`)
- Client SDK join/leave (Chat/Voice/Video)
- Duration reporting (`report-session-duration`)

---

## 7. Error Handling — Cross-Cutting Rule

Every Edge Function in §2 must return a consistent error shape (error code + human-readable message) so the app can render consistent error states across modules (per the Loading/Empty/Error/Disabled requirement in `04_Design_System.md` §6) rather than each module inventing its own error handling pattern.

---

## 8. Explicitly Out of Scope for This Module

- No third-party analytics vendor integration specified here — see `21_Analytics_Events.md` for the event taxonomy; the choice of analytics backend (e.g. which SDK) is an implementation detail, not fixed by this doc.
- No admin/CMS API contracts (managing `services` content, lawyer onboarding) — those belong to internal tooling docs, not this buyer-app doc set.

---

*Next: `19_Document_Services_Content_Map.md` — maps your finalized 8-service content doc to the page template fields defined in `07`, pending your approval to proceed.*
