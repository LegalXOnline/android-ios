# 12. Module Spec — Profile (SCR-16 to SCR-22)

> **Depends on:** `04_Design_System.md`, `05_Screen_Inventory.md`, `11_Module_Billing_Payments.md` (Transactions data), `09_Module_Talk_to_Lawyer.md` (Favourites data)
> **Feeds into:** `13_Data_Model_Supabase_Schema.md`, `14_Auth_and_Roles.md`

---

## 1. Purpose

Profile is the returning-user hub — account management, purchase/consultation history, and support. Per `03_User_Personas_and_Journeys.md` §5, it is read-heavy and history-oriented in V1, not a live-status dashboard.

---

## 2. Screen: SCR-16 Profile (root)

### 2.1 Layout

1. Avatar, name, phone/email (masked/partial, edit via SCR-17)
2. LX Coin balance (view-only chip) → SCR-18
3. Menu list:
   - Favourite Lawyers → SCR-19
   - Doc Vault *(note — see §6 boundary)*
   - Call History → SCR-20
   - Transactions → SCR-21
   - Support → SCR-22
   - Notifications settings (toggle, inline — not a separate screen, per wireframe simplicity)
4. Logout (confirmation dialog before executing — prevents accidental logout)

### 2.2 States

| State | Behavior |
|---|---|
| Loading | Skeleton for avatar/name block; menu items render immediately (static labels, no data dependency) |

---

## 3. Screen: SCR-17 Edit Profile

### 3.1 Fields

Name, Email, Phone, Address, Gender (optional), State/City/Pincode — per wireframe. Email/Phone show a "Verified" badge if confirmed via Supabase Auth OTP; changing either triggers re-verification (spec owned by `14_Auth_and_Roles.md`).

### 3.2 States

| State | Behavior |
|---|---|
| Validation error | Inline, field-level (e.g. invalid phone format) |
| Save success | Toast/confirmation, return to SCR-16 |
| Save failure (network) | Inline error, form retains entered values (never clear a form on failure) |

---

## 4. Screen: SCR-18 LX Coins

- **View-only balance display in V1** (Product Vision §5 — no recharge/reward logic). Shows current balance and, if Model A from `11_Module_Billing_Payments.md` §4 is confirmed, may show "held"/pending amounts from an active consultation pre-authorization.
- No "Buy Coins" or "Redeem" CTA in V1 — if wireframes or reference builds show a recharge tier UI (they do, in the reviewed inspiration source), that entire flow is deferred to `24_Future_Roadmap_Parking_Lot.md`. Do not partially build it (e.g. don't ship a recharge button that's non-functional — omit it entirely rather than ship dead UI).

---

## 5. Screen: SCR-19 Favourite Lawyers

- List of Lawyer Profile Cards (compact variant, same as Home's Popular Lawyers), sourced from the user's favourites (toggled from SCR-09 per `09` §4.1).
- Empty state: "You haven't favourited any lawyers yet" + CTA to SCR-07.
- Un-favouriting from this list is a direct action (tap heart icon) — no confirmation dialog needed (low-stakes, reversible action).

---

## 6. Screen: SCR-20 Call History

- Read-only list: lawyer name/photo, date, mode (chat/voice/video), duration, cost.
- Tapping an entry: no drill-down screen needed in V1 (no call transcript/recording playback — out of scope; flag if this is expected, since Agora sessions could theoretically be recorded, but that's a privacy/compliance decision, not a default to assume).
- Empty state: "No consultations yet."

---

## 7. Screen: SCR-21 Transactions

- Read-only list: item name (service or lawyer/consultation), date, amount, payment status (Success/Failed/Refunded).
- This is a **receipt/history list, not a live order-tracking widget** — reiterating Product Vision §5 explicitly here since Transactions is the screen most likely to accidentally grow order-tracking features if not constrained.
- Tapping an entry can show a simple receipt detail (line items, payment ID) — this is acceptable V1 scope (it's historical record-keeping, not live status).
- Empty state: "No transactions yet."

---

## 8. Screen: SCR-22 Support

- Simple contact/help entry point: FAQ link (can reuse the FAQ pattern from `04_Design_System.md` §5.5 for common app-wide questions), and a contact method (email/WhatsApp link or a basic support-ticket form).
- No in-app live chat with support staff in V1 — that's a different system from the lawyer-consultation Agora integration and should not be conflated with it.
- Reschedule/cancellation requests (flagged as out of self-serve scope in `10_Module_Consultation_Booking.md` §6) are handled here, manually, in V1 — this screen is effectively the escape hatch for anything not self-serve elsewhere in the app. Worth knowing this dependency exists before support tooling/staffing is planned.

---

## 9. "Doc Vault" — Naming Flag

The wireframes list a Profile menu item labeled "Doc Vault." Per `01_Product_Vision.md` §5, Document Vault/Escrow (encrypted storage) is explicitly deferred to V2. **Recommendation:** rename this V1 menu item to something scoped to what actually exists in V1 — e.g. it could reasonably just point to Transactions/purchased-document downloads (a document you bought, downloadable as a PDF) rather than a full encrypted vault system. Confirm which of these two you intend:

- **Option A:** "Doc Vault" is really just "your purchased documents, downloadable" — buildable in V1, rename to avoid implying encrypted storage.
- **Option B:** "Doc Vault" stays out of V1 entirely, remove the menu item until V2.

---

## 10. Explicitly Out of Scope for This Module

- No LX Coin recharge/purchase flow (§4).
- No encrypted document vault/escrow (§9 — pending your decision).
- No in-app live support chat.
- No referral/invite-friends screen (Product Vision §5).

---

## 11. Analytics Events

- `profile_viewed`
- `profile_edit_saved`
- `favourite_lawyers_viewed`
- `call_history_viewed`
- `transactions_viewed`
- `transaction_detail_viewed` (props: `transaction_id`)
- `support_viewed`
- `logout_confirmed`

---

*This completes the module spec set (06–12). Next in the roadmap: `13_Data_Model_Supabase_Schema.md` — entities, relationships, and RLS policy intent, pending your approval to proceed.*
