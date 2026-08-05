# 26. Module Spec — Document Verification (SCR-23, SCR-24)

> **Depends on:** `01_Product_Vision.md` §4a (scope-change note), `02_Information_Architecture.md` §3.8, `05_Screen_Inventory.md` §3a
> **Feeds into:** `11_Module_Billing_Payments.md` §2.2, `13_Data_Model_Supabase_Schema.md` §2.3a, `18_API_Integration_Contracts.md`
> **Status:** Confirmed as V1 scope via founder-provided flow diagrams. One open decision remains — see §3.

---

## 1. Purpose

A third paid flow, distinct from buying a fixed document or booking a lawyer: a buyer uploads a document they already have (e.g. a property agreement, a contract) and pays for it to be reviewed. Confirmed via the "Final Payment Architecture" diagram as a peer to Documentation and Talk to Lawyer, sharing the same Billing screen.

```mermaid
flowchart LR
    A[Entry: "Doc Verify & Consult"<br/>within Documentation/Home] --> B[SCR-23: Select Package]
    B --> C[SCR-24: Upload Document]
    C --> D[Billing<br/>order_type = verification]
    D --> E[Razorpay]
    E --> F[Confirmation]
```

---

## 2. Screen: SCR-23 Select Verification Package

### 2.1 Layout

- List of verification packages (pricing tiers), each showing: title, price, included features (per `13_Data_Model_Supabase_Schema.md` §2.3a `verification_packages`).
- Single-select — tapping a package highlights it and enables Continue → SCR-24.

### 2.2 Package Content — Open Decision (carried from `01_Product_Vision.md` §4a)

Your source wireframes (from earlier in this project) showed two tiers:
- **AI Verification** — instant, AI-only review (risk detection, clause summary)
- **Verification + Consultation** — human expert review + 15-min consultation call

**V1 build assumption, pending your confirmation:** only the human-reviewed tier ships in V1. If you want the AI-only tier included, it needs the dated scope-change treatment `01_Product_Vision.md` §4a describes for exactly this situation — flagging again here since this is the screen where that decision becomes concrete UI copy, not just an abstract policy note.

- [ ] **Confirm:** ship human-review-only package(s) in V1, or add the AI-only tier with an explicit scope-change note in `01`.

### 2.3 States

| State | Behavior |
|---|---|
| Loading | Skeleton package cards |
| Error | Retry |

---

## 3. Screen: SCR-24 Upload Document

### 3.1 Layout (per wireframe)

- File upload control (drag/tap to upload, matches the pattern already defined for document checklists in `04_Design_System.md` §5.4)
- Problem Type — dropdown/selector
- Language — dropdown/selector
- Continue button → Billing

### 3.2 Data Requirements

| Field | Notes |
|---|---|
| Uploaded file | Sent via `upload-verification-document` (`18_API_Integration_Contracts.md`), stored in a private Supabase Storage bucket — never public |
| `problem_type` | Free-text or enum selector — confirm which; not specified in source wireframes beyond the field existing |
| `language` | Matches the language list already used for lawyer filtering (`09_Module_Talk_to_Lawyer.md` §3.1), for consistency rather than a separate list |

### 3.3 States

| State | Behavior |
|---|---|
| Upload in progress | Progress indicator on the file item, Continue disabled until upload completes |
| Upload failed | Inline retry, file must not silently disappear from the UI on failure |
| Missing required field | Continue disabled, inline validation |

---

## 4. Handoff to Billing

Per `11_Module_Billing_Payments.md` §2.2, this flow produces an `order_type = verification` payload:

| Field | Value |
|---|---|
| `item_id` | Selected `verification_package_id` |
| `item_title` | Package name |
| `price` | Package price |
| `metadata` | `uploaded_file_url`, `language`, `problem_type` |

Billing's Verification Summary variant renders: package name, uploaded file name (not the file itself), language, problem type, price — matching the wireframe's Billing Summary block exactly (Verification Package, Uploaded File, Language, Problem Type, Price, Coupon, Total, Pay).

---

## 5. Fulfilment — What Happens After Payment (flag for ops, not just engineering)

Unlike a document purchase (buyer receives a drafted document) or a consultation (a scheduled/instant call), a paid verification order's fulfilment is **a human reviewer producing feedback on the uploaded document.** This doc set doesn't yet specify:
- Where the reviewer's output/feedback surfaces to the buyer (a new screen? Transactions detail? Notification with an attached file?)
- Turnaround time commitment (needed for the package's "included features" copy and for buyer-facing expectations)

**Recommend resolving this before `26` is treated as fully build-ready** — it's the one piece of this flow without a clear V1 answer yet, unlike Documentation (delivery is implicit in the existing 8-service model) or Consultation (fulfilment is the call itself).

---

## 6. Explicitly Out of Scope for This Module

- No AI-only review tier without the confirmation in §2.2.
- No in-app document markup/annotation tools (a human reviewer's own tooling, not a buyer-facing app feature).
- No revision/re-upload flow after initial submission — a v2 concern unless flagged otherwise.

---

## 7. Analytics Events

- `verification_package_selected` — `package_id`
- `verification_document_uploaded` — `package_id`
- `verification_upload_failed` — `package_id`, `reason`
- `verification_continue_to_billing` — `package_id`

---

*This module is layered onto the existing 01–25 doc set. Cross-referenced patches were applied to `01`, `02`, `05`, `11`, `13`, `18`, `21` to keep the full doc set internally consistent.*
