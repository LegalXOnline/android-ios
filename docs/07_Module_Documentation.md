# 07. Module Spec — Documentation (SCR-03, SCR-04)

> **Depends on:** `01_Product_Vision.md` (8-service list), `04_Design_System.md` (checklist, video, FAQ components), `05_Screen_Inventory.md`
> **Feeds into:** `11_Module_Billing_Payments.md`, `13_Data_Model_Supabase_Schema.md`, `19_Document_Services_Content_Map.md`

---

## 1. Purpose

Let a buyer who already knows (or discovers) which document they need go from "browsing" to "paid" with zero ambiguity about price, requirements, or what they'll receive. This is a **single reusable template rendering 8 data payloads** — not 8 hand-built screens. Content for all 8 is finalized in your content doc; `19_Document_Services_Content_Map.md` maps that content 1:1 to the fields below.

---

## 2. Screen: SCR-03 Service List

- Grid or vertical list of all 8 service cards (per `04_Design_System.md` §5.1: icon, title, one-line description, price line).
- Fixed order (do not randomize or algorithmically rank — this is a fixed, small catalog):
  1. GST Registration
  2. Monthly GST Return Filing
  3. Trademark Registration
  4. Udyam (MSME) Registration
  5. DPIIT Startup India Recognition
  6. Legal Notice Drafting
  7. Rent / Lease Agreement Drafting
  8. Affidavit Drafting
- Tapping any card → SCR-04 with that service's `service_id`.

---

## 3. Screen: SCR-04 Service Detail — Template

This template must render correctly for all 8 payloads without per-service code branches. Section order below is the **merged, final order** — it reconciles the section list from the founding brief with the actual content structure already written for all 8 services.

### 3.1 Section Order

1. **Hero** — Breadcrumb, tag (e.g. "LEGAL SERVICE"), title, one-line description, price line, primary CTA anchor (sticky Buy Now on scroll, per standard e-commerce pattern — recommended addition, confirm before build)
2. **Video** — 30–60 sec explanatory video component (`04_Design_System.md` §5.6). Placeholder in V1; accepts video URL prop for later content upload. **No code required to swap placeholder for real video** — just populate the field in the content payload.
3. **Key Details** — Numbered list (5–6 factual points, e.g. thresholds, timelines, legal figures) — sourced verbatim from each service's "KEY DETAILS" block in the content doc.
4. **What is [Service]?** — 2–4 sentence definition, includes one italicized statutory citation per service (already written into content doc for all 8 — render as a styled blockquote, not plain body text).
5. **Why Choose This Service** — Benefits bullet list (5–6 items).
6. **Required Document Checklist** — Two-group checklist component (`04_Design_System.md` §5.4): required items, then "Additional Documents (if applicable)" as a visually separate group.
7. **What's Included** — Numbered list of deliverables.
8. **How It Works** — 4-step process (Requirements → Your Details → Review → Payment), rendered as a horizontal or vertical stepper, not prose.
9. **FAQ** — Accordion component (`04_Design_System.md` §5.5), 4 Q&As per service (content doc has these written for all 8).
10. **Buy Now** — Primary CTA, fixed at bottom or sticky. Navigates to SCR-13 Billing. **No order tracking, no in-app fulfilment status — Buy Now's only job is to start the Billing flow** (Product Vision §4).

### 3.2 Content Payload Shape (per service — reference for `13_Data_Model_Supabase_Schema.md`)

Each of the 8 services needs, at minimum:
- `service_id`, `title`, `tag`, `breadcrumb`
- `description` (hero), `price_line`, `price_numeric` (for Billing calculations)
- `video_url` (nullable in V1 launch, populated later)
- `key_details[]` (ordered list)
- `what_is_body`, `what_is_citation`
- `benefits[]`
- `checklist_required[]`, `checklist_additional[]` (each item: name, accepted formats, max size)
- `whats_included[]`
- `how_it_works_steps[]` (fixed 4-step structure, same across all 8 — do not vary step count per service)
- `faq[]` (question/answer pairs)

### 3.3 Subtype Selectors (Legal Notice, Rent Agreement, Affidavit only)

Per the content doc's developer note: these 3 services have a subtype selector (e.g. Legal Notice → Recovery / Cheque Bounce / Eviction) that **dynamically changes the checklist fields shown** — selecting "Cheque Bounce" swaps in the bank-return-memo upload field instead of a generic one.

- This selector renders inline within the Required Document Checklist section, above the checklist itself.
- Changing the selector re-renders only the checklist group — Hero, Key Details, FAQ, etc. stay static regardless of subtype.
- This is the one place in the template where content is conditional; every other section is static per service.

---

## 4. States

| State | Behavior |
|---|---|
| Loading | Skeleton for Hero + Video area first (above the fold), rest of sections stream in |
| Error | Full-screen retry — a service page with partial/broken content is worse than a clear error state, given this is a paid-purchase context |
| N/A (list never empty) | Service List is a fixed 8-item catalog; no empty state needed |

---

## 5. Explicitly Out of Scope for This Module

- No document editing/modification after purchase (Product Vision §5).
- No dynamic pricing/quotes — all 8 services are flat-priced or use the two fixed tiers shown in wireframes (e.g. "Below 10 pages / Above 10 pages" for verify-type services); no custom-quote flow.
- No in-app order status beyond the Confirmation screen (SCR-15) and read-only Transactions history (SCR-21).

---

## 6. Analytics Events

- `service_list_viewed`
- `service_detail_viewed` (props: `service_id`)
- `service_video_played` (props: `service_id`)
- `service_faq_expanded` (props: `service_id`, `question_index`)
- `service_buy_now_tapped` (props: `service_id`, `price`)

---

*Next: `08_Module_Knowledge_Centre.md` — placeholder screens and GitHub content-fetch integration contract, pending your approval to proceed.*
