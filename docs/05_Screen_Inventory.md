# 05. Screen Inventory — LegalX V1

> **Depends on:** `02_Information_Architecture.md` (sitemap), `04_Design_System.md` (state requirements)
> **Feeds into:** module docs (06–12), `22_QA_Test_Plan.md`
> **Purpose:** The definitive, numbered list of every screen in V1. If a screen isn't in this table, it isn't in V1. Module docs (06–12) expand each row into full specs.

---

## 1. How to Read This Table

- **ID** — stable reference used in module docs, tickets, and QA test cases (e.g. `SCR-07`).
- **Entry from** — where a user arrives from.
- **Exit to** — where the primary action takes them.
- **States** — per `04_Design_System.md` §6; `—` means not applicable to that screen.

---

## 2. Home Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-01 | Home | App launch (post-auth) | Search, Documentation, Knowledge Centre, Talk to Lawyer, Profile, service/lawyer detail | Loading, Error (retry) |
| SCR-02 | Search Results | Home search bar | Service detail or Lawyer profile | Empty, Loading, Error |

## 3. Documentation Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-03 | Service List (8 cards) | Home tab, Home "Popular Documents" | Service Detail | Loading, Error |
| SCR-04 | Service Detail (1 template × 8 payloads) | Service List, Search, Home popular card | Billing | Loading, Error |

## 3a. Document Verification Module (added — see `01_Product_Vision.md` §4a, `26_Module_Document_Verification.md`)

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-23 | Select Verification Package | "Doc Verify & Consult" entry (Documentation/Home) | Upload Document | Loading, Error |
| SCR-24 | Upload Document | Select Verification Package | Billing (`order_type = verification`) | Error (upload failed), Loading |

## 4. Knowledge Centre Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-05 | Knowledge Feed (placeholder) | Home tab | Article Detail (placeholder) | Empty (permanent placeholder in V1) |
| SCR-06 | Article Detail (placeholder) | Knowledge Feed | Documentation or Talk to Lawyer (cross-sell CTAs per `03` §4) | Empty (placeholder) |

## 5. Talk to Lawyer Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-07 | Lawyer Listing | Home tab, Home "Popular Lawyers" | Filters, Lawyer Profile | Empty, Loading, Error |
| SCR-08 | Search / Filters (overlay or pushed screen) | Lawyer Listing | Lawyer Listing (filtered) | Empty result state |
| SCR-09 | Lawyer Profile Detail | Lawyer Listing, Search, Favourites | Consultation Booking | Loading, Error |

## 6. Consultation Booking Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-10 | Mode Selection (Chat/Voice/Video) | Lawyer Profile Detail | Date Selection | — |
| SCR-11 | Date Selection (next 5 days only) | Mode Selection | Time Selection | — |
| SCR-12 | Time Selection | Date Selection | Billing | Empty (no slots available that day) |

## 7. Billing Module (shared — see `02` §4)

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-13 | Billing | Service Detail (Buy Now), Time Selection (Continue) | Razorpay Checkout | Error (invalid coupon) |
| SCR-14 | Razorpay Checkout (native SDK sheet) | Billing | Confirmation | Error (payment failed → back to Billing, order not created) |
| SCR-15 | Confirmation | Razorpay Checkout | Home, or Profile → Transactions | — |

## 8. Profile Module

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-16 | Profile (root) | Home avatar icon | Edit Profile, LX Coins, Favourite Lawyers, Call History, Transactions, Support, Logout | Loading |
| SCR-17 | Edit Profile | Profile | Profile (on save) | Error (validation) |
| SCR-18 | LX Coins (balance view) | Profile | Profile (back) | — |
| SCR-19 | Favourite Lawyers | Profile | Lawyer Profile Detail | Empty |
| SCR-20 | Call History | Profile | — (read-only list) | Empty |
| SCR-21 | Transactions | Profile | — (read-only list, receipts) | Empty, Error |
| SCR-22 | Support | Profile | — (contact/help form or link) | — |

## 9. Auth / Onboarding (referenced, spec owned by `14_Auth_and_Roles.md`)

| ID | Screen | Entry from | Exit to | States |
|---|---|---|---|---|
| SCR-00a | Onboarding / Splash | App launch (first run) | Login | — |
| SCR-00b | Login / Sign-up | Onboarding, session expiry | Home | Error (invalid OTP/credentials), Loading |

---

## 10. Screen Count Summary

**26 screens total** (24 core + 2 auth). Updated from 24 to reflect the confirmed Document Verification flow (`01_Product_Vision.md` §4a). This is the number to reconcile against Antigravity's build plan — if the generated app has materially more or fewer screens than this, stop and reconcile against this doc before continuing, not after.

| Module | Screen count |
|---|---|
| Home | 2 |
| Documentation | 2 |
| Document Verification | 2 |
| Knowledge Centre | 2 |
| Talk to Lawyer | 3 |
| Consultation Booking | 3 |
| Billing | 3 |
| Profile | 7 |
| Auth | 2 |

---

## 11. Explicitly Not a Screen in V1

Called out here because each of these was visible in a reference/inspiration source and could plausibly be mistaken for in-scope:

- Order Tracking screen
- Document Vault / Escrow screen
- AI Chat / AI Assistant screen
- Wallet Recharge screen (LX Coins is view-only — SCR-18 shows balance, not a purchase flow)
- Referral / Invite Friends screen

These belong in `24_Future_Roadmap_Parking_Lot.md`.

---

*Next: `06_Module_Home.md` — the first full module spec, pending your approval to proceed.*
