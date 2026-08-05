# 22. QA Test Plan — Acceptance Criteria

> **Depends on:** all module docs (06–17), `05_Screen_Inventory.md` (24-screen baseline)
> **Feeds into:** `23_Release_Environment_Strategy.md`
> **Format note:** This is acceptance criteria, not a full test script — QA owns writing detailed test cases against these criteria.

---

## 1. Priority Tiers

| Tier | Definition |
|---|---|
| P0 — Launch blocker | If this fails, do not ship. Money, compliance, or data-integrity risk. |
| P1 — Fix before launch if possible | Core UX quality, but not a hard blocker if genuinely time-constrained. |
| P2 — Fix post-launch acceptable | Polish, edge cases with low real-world frequency. |

---

## 2. P0 — Compliance & Money (test these first, test these hardest)

| # | Criterion | Source |
|---|---|---|
| P0-1 | A non-enrolled advocate can never appear in the Lawyer Listing or Search results, under any filter combination | `09` §1, `13` §3 |
| P0-2 | An order's `status` never becomes `paid` from a client-side signal alone — only a verified Razorpay webhook can set it | `16` §2 |
| P0-3 | A duplicate webhook delivery does not double-charge or create duplicate `orders`/`payments` rows | `20` §4 |
| P0-4 | An Agora session token is never issued for an unpaid consultation order | `15` §2 |
| P0-5 | RLS policies from `13` §3 are individually tested — attempt to read/write another user's `profiles`, `orders`, `wallets`, `consultations` rows and confirm denial | `13` §3, `20` §2 |
| P0-6 | Coupon discount amount is always server-validated, never trusted from client calculation | `16` §5 |
| P0-7 | Consultation duration used for billing true-up comes from server-recorded session events, not client-reported timers | `15` §5 |

---

## 3. P0/P1 — Core Funnels End-to-End

### Document Purchase Funnel
- [ ] P0: Complete purchase for all 8 services individually — each must reach `payment_captured` and appear correctly in Transactions
- [ ] P0: Payment failure returns user to Billing with order still `pending_payment`, not silently lost
- [ ] P1: Coupon apply/fail states behave per `11` §2.3
- [ ] P1: Subtype selector (Legal Notice, Affidavit, and Rent Agreement pending `19` §3 resolution) correctly swaps checklist fields without affecting other sections

### Consultation Booking Funnel — Scheduled
- [ ] P0: Full flow (profile → mode → date → time → billing → payment) completes and creates a correctly-linked `consultations` + `orders` row
- [ ] P0: Date selection never allows a date outside the next 5 days, including timezone edge cases (e.g. near midnight)
- [ ] P1: Time slot grid correctly reflects real lawyer availability minus already-booked slots

### Consultation Booking Funnel — Instant
- [ ] P0: "Consult Now" only appears/enables when lawyer is genuinely live-available
- [ ] P0: Session provisioning only occurs after payment confirmation
- [ ] P1: No-show grace window (`15` §4) correctly triggers refund path if lawyer doesn't join in time

---

## 4. P1 — Module-Level Acceptance Criteria

| Module | Key criteria |
|---|---|
| Home (`06`) | All 3 service entry cards route correctly; Popular Documents/Lawyers rows fail gracefully independent of each other |
| Documentation (`07`) | Template renders correctly for all 8 payloads with zero per-service code branches (verifies the "1 template × 8 payloads" architecture actually held) |
| Knowledge Centre (`08`) | Placeholder never blocks navigation to other tabs; cross-sell CTAs route correctly |
| Talk to Lawyer (`09`) | Filters apply correctly in combination (e.g. practice area + language + rating together); empty-result state shows correctly |
| Profile (`12`) | Edit Profile validation, LX Coins is genuinely view-only (no hidden recharge path), Doc Vault naming resolved per `12` §9 decision |
| Notifications (`17`) | Push + WhatsApp fallback triggers correctly for time-critical events only, not all events |

---

## 5. P2 — Non-Functional Spot Checks

- Cold start time on a representative mid-range Android device (`20` §1)
- Accessibility: tap target sizes, contrast ratios per `04_Design_System.md` §7
- Offline messaging (`20` §4) — no silent failures or infinite spinners

---

## 6. Regression Watch List (things easy to accidentally break)

- The shared Billing screen (`11`) handling both order-type payloads — a change for one order type must not silently break the other
- The RLS lawyer-enrollment filter (P0-1) — any future query touching `lawyers` must inherit this filter, not just the original listing query
- The 5-day date window — a "fix" to date selection logic must not accidentally widen or narrow this

---

## 7. Explicitly Out of Scope for This Plan

- Load/performance testing at scale — deferred per `20` §7.
- Formal penetration testing — recommended separately, not covered by this functional QA plan.

---

*Next: `23_Release_Environment_Strategy.md` — dev/staging/prod environments and EAS build config references, pending your approval to proceed.*
