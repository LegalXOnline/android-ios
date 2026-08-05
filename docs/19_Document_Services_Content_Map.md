# 19. Document Services Content Map

> **Depends on:** `07_Module_Documentation.md` (§3.2 payload shape), `13_Data_Model_Supabase_Schema.md` (§2.3 `services` table)
> **Source of truth for actual copy:** your finalized content doc ("LegalX — Website Page Content for 8 Documents"). This file maps that content to the template fields — it does not duplicate the full copy verbatim (avoids two sources of truth drifting apart). Whoever populates the `services` table should pull directly from the source content doc, using this file as the field-mapping key.

---

## 1. Mapping Key (applies to all 8 services)

| Content doc section | → Template field (`07` §3.2) |
|---|---|
| Breadcrumb / Tag / Title | `breadcrumb`, `tag`, `title` |
| Description (hero) | `description` |
| Price line | `price_line` (display string) + `price_numeric` (extracted number for Billing calculations) |
| "KEY DETAILS" numbered list | `key_details[]` |
| "What is X?" paragraph + italicized statutory quote | `what_is_body`, `what_is_citation` |
| "WHY REGISTER/SUBSCRIBE/APPLY?" bullet list | `benefits[]` |
| "CHECKLIST — Required Documents" | `checklist_required[]` |
| "ADDITIONAL DOCUMENTS (if applicable)" | `checklist_additional[]` |
| "What's Included" numbered list | `whats_included[]` |
| "How It Works" 4 steps | `how_it_works_steps[]` (fixed structure — Requirements → Your Details → Review → Payment) |
| "FAQ" | `faq[]` |
| CTA text | Reused as the Buy Now button label if it varies per service (e.g. "Get my notice drafted" vs. generic "Get started") — confirm whether button copy should vary per service or stay uniform; content doc has both a top CTA and a bottom CTA per service and they aren't always identical |

---

## 2. Per-Service Summary

Full copy lives in the source content doc — this table is a quick-reference index, not a copy replacement.

| # | Service ID | Price line | Has subtype selector? (`07` §3.3) | Checklist: required / additional | FAQ count |
|---|---|---|---|---|---|
| 1 | `gst-registration` | From ₹499 · 3–7 working days | No | 6 / 2 | 4 |
| 2 | `gst-return-filing` | From ₹499/month · Filed by the 20th | No | 6 / 2 | 4 |
| 3 | `trademark-registration` | From ₹1,499 + Govt. fee · 24–48 hrs to file | No | 6 / 2 | 4 |
| 4 | `udyam-registration` | Free–₹299 · ~10 min | No | 6 / 2 | 4 |
| 5 | `dpiit-recognition` | From ₹499 · 7–15 working days | No | 6 / 2 | 4 |
| 6 | `legal-notice-drafting` | From ₹999/notice · 24–48 hrs | **Yes** — Recovery / Cheque Bounce / Eviction | 6 / 2 | 4 |
| 7 | `rent-agreement-drafting` | From ₹499/agreement | **Yes** (implied — residential/commercial/leave-and-license format; confirm whether this drives a checklist swap the way Legal Notice does, or is just informational) | 6 / 2 | 4 |
| 8 | `affidavit-drafting` | From ₹299/affidavit | **Yes** — name change / address proof / income declaration / general | 6 / 2 | 4 |

---

## 3. Subtype Selector Detail (services #6, #8, and possibly #7)

Per the content doc's own developer note: *"choosing 'Cheque Bounce' under Legal Notice should dynamically show the 'bank return memo / cheque copy' upload field instead of a generic one."*

| Service | Subtype options | Checklist field that changes |
|---|---|---|
| Legal Notice Drafting | Recovery / Cheque Bounce / Tenant Eviction | Supporting-documents item swaps: cheque copy + bank memo (Cheque Bounce) vs. rent agreement (Eviction) vs. transaction proof (Recovery) |
| Affidavit Drafting | Name change / Address proof / Income declaration / General | Supporting-documents item swaps: old ID (name change) / utility bill (address) / Form 16 (income) |
| Rent/Lease Agreement Drafting | Format type mentioned in content (residential/commercial/leave-and-license) but **not confirmed as a checklist-driving selector** the way #6 and #8 are — flag for a quick decision: does this need the same dynamic-field pattern, or is it just descriptive text? |

**Recommendation:** resolve the Rent Agreement question now, since `07_Module_Documentation.md` §3.3 was written assuming exactly 3 services have this pattern — if it's actually 2, that's a simpler build; if it's 3, the module doc's subtype-selector component needs to be reused a third time, which is fine, just worth confirming before Antigravity starts building.

---

## 4. Pricing Model Note (ties to `11_Module_Billing_Payments.md`)

All 8 services use either:
- **Flat pricing** ("From ₹X") — 7 of 8 services
- **Page-count tiered pricing** (seen in the wireframes as "Below 10 pages / Above 10 pages" for verify-type services) — this pattern appears in the wireframes but isn't reflected in the current content doc's 8 services as written. Confirm whether any of these 8 actually needs tiered pricing, or whether that wireframe pattern belongs to a service not in this content doc (e.g. the "Doc Verify & Consult" flow shown separately in the wireframes, which may be a distinct feature from the 8 fixed document services).

This is worth resolving because `13_Data_Model_Supabase_Schema.md` §2.3 currently models `price_numeric` as a single value per service — if tiered pricing applies to any of the 8, that field needs to become a structure (e.g. price-per-tier), which is a schema change, not just a content change.

---

## 5. Content Population Checklist (for whoever loads the `services` table)

- [ ] All 8 services' full copy transcribed from source content doc into `services` table fields per §1 mapping
- [ ] `price_numeric` extracted as a clean number for each (strip "From ₹" / "/month" etc. — display string stays in `price_line`, calculation value goes in `price_numeric`)
- [ ] Subtype question from §3 resolved before Rent Agreement's `has_subtype` flag is set
- [ ] Tiered-pricing question from §4 resolved before Billing price-calculation logic is finalized
- [ ] `video_url` left null at launch, populated when video content is ready (component already supports this per `04_Design_System.md` §5.6)

---

*Next: `20_Non_Functional_Requirements.md` — performance, security, and DPDP compliance requirements, pending your approval to proceed.*
