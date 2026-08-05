# 21. Analytics Events — Canonical Taxonomy

> **Depends on:** all module docs (06–17), each of which listed its own events — this doc consolidates them into one canonical, de-duplicated list
> **Feeds into:** `22_QA_Test_Plan.md`, `23_Release_Environment_Strategy.md`
> **Format note:** Event names and properties only — analytics vendor/SDK choice is an implementation detail (`18_API_Integration_Contracts.md` §8), not fixed here.

---

## 1. Naming Convention

`{module}_{object}_{action}` — lowercase, snake_case, past-tense action where the event marks completion (`_viewed`, `_tapped`, `_completed`), present participle where it marks a state change in progress (`_applying` avoided in favor of clear before/after event pairs instead).

---

## 2. Full Event List by Module

### Home (`06`)
- `home_viewed`
- `home_search_initiated`
- `home_service_card_tapped` — `service_id`, `position`
- `home_lawyer_card_tapped` — `lawyer_id`, `position`
- `home_popular_documents_see_all_tapped`
- `home_popular_lawyers_see_all_tapped`

### Documentation (`07`)
- `service_list_viewed`
- `service_detail_viewed` — `service_id`
- `service_video_played` — `service_id`
- `service_faq_expanded` — `service_id`, `question_index`
- `service_buy_now_tapped` — `service_id`, `price`

### Document Verification (`26` — new, see `01_Product_Vision.md` §4a)
- `verification_package_selected` — `package_id`
- `verification_document_uploaded` — `package_id`
- `verification_upload_failed` — `package_id`, `reason`
- `verification_continue_to_billing` — `package_id`

### Knowledge Centre (`08`)
- `knowledge_feed_viewed`
- `knowledge_article_viewed` — `article_id_placeholder`
- `knowledge_crosssell_documentation_tapped`
- `knowledge_crosssell_lawyer_tapped`

### Talk to Lawyer (`09`)
- `lawyer_listing_viewed`
- `lawyer_filter_applied` — filter set
- `lawyer_profile_viewed` — `lawyer_id`
- `lawyer_favourited` / `lawyer_unfavourited` — `lawyer_id`
- `lawyer_consult_now_tapped` — `lawyer_id`, `mode`
- `lawyer_schedule_tapped` — `lawyer_id`, `mode`

### Consultation Booking (`10`)
- `booking_mode_selected` — `lawyer_id`, `mode`
- `booking_date_selected` — `lawyer_id`, `date`
- `booking_time_selected` — `lawyer_id`, `time`
- `booking_instant_consult_started` — `lawyer_id`, `mode`
- `booking_continue_to_billing` — `lawyer_id`, `is_instant`

### Billing & Payments (`11`, `16`)
- `billing_viewed` — `order_type`, `item_id`
- `billing_coupon_applied` / `billing_coupon_failed`
- `billing_buy_now_tapped` — `order_type`, `total_price`
- `payment_order_created` — `order_type`, `amount`
- `payment_captured` — `order_id`, `amount`
- `payment_failed` — `order_id`, `reason`
- `payment_succeeded` *(alias of `payment_captured` — pick one; flagged as a duplicate to resolve, see §4)*
- `refund_issued` — `order_id`, `amount`, `reason`

### Profile (`12`)
- `profile_viewed`
- `profile_edit_saved`
- `favourite_lawyers_viewed`
- `call_history_viewed`
- `transactions_viewed`
- `transaction_detail_viewed` — `transaction_id`
- `support_viewed`
- `logout_confirmed`

### Realtime Communication (`15`)
- `consultation_session_created` — `consultation_id`, `is_instant`, `mode`
- `consultation_session_joined` — `consultation_id`, `role: buyer`
- `consultation_session_ended` — `consultation_id`, `duration_minutes`
- `consultation_no_show` — `consultation_id`, `party: lawyer|buyer`

### Notifications (`17`)
- `notification_sent` — `type`, `channel`
- `notification_opened` — `type`, `channel`
- `whatsapp_fallback_triggered` — `type`

---

## 3. Funnel Groupings (for dashboard construction)

| Funnel | Event sequence |
|---|---|
| Document purchase | `service_detail_viewed` → `service_buy_now_tapped` → `billing_viewed` → `billing_buy_now_tapped` → `payment_captured` |
| Document verification | `verification_package_selected` → `verification_document_uploaded` → `verification_continue_to_billing` → `billing_viewed` → `payment_captured` |
| Consultation booking (scheduled) | `lawyer_profile_viewed` → `lawyer_schedule_tapped` → `booking_mode_selected` → `booking_date_selected` → `booking_time_selected` → `billing_viewed` → `payment_captured` |
| Consultation booking (instant) | `lawyer_profile_viewed` → `lawyer_consult_now_tapped` → `billing_viewed` → `payment_captured` → `consultation_session_joined` |
| Knowledge Centre → conversion | `knowledge_article_viewed` → `knowledge_crosssell_documentation_tapped` (or `_lawyer_tapped`) → respective funnel above |

These funnels are the ones worth building dashboards against first — they directly answer "where do buyers drop off," which matters more at launch than granular per-screen engagement metrics.

---

## 4. Cleanup Item

`payment_succeeded` (from `11`) and `payment_captured` (from `16`) refer to the same event, named differently across two docs written at different times. **Recommend standardizing on `payment_captured`** (matches Razorpay's own webhook terminology, reducing translation confusion for whoever wires up the webhook handler) — flag this as a one-line fix to make in `11_Module_Billing_Payments.md` §6 for consistency.

---

## 5. Explicitly Out of Scope

- No user-level PII in event properties (e.g. don't pass raw phone/email as an event property — use `profile_id` and join to PII-containing tables only where genuinely needed, minimizing DPDP exposure per `20_Non_Functional_Requirements.md` §3).
- No third-party ad-attribution SDKs (Facebook Pixel, etc.) — not relevant to a transactional legal-services app and adds privacy surface area for no clear benefit at this stage.

---

*Next: `22_QA_Test_Plan.md` — acceptance criteria per module, pending your approval to proceed.*
