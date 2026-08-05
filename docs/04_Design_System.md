# 04. Design System — LegalX V1

> **Depends on:** `01_Product_Vision.md` (brand tone), `02_Information_Architecture.md`, `03_User_Personas_and_Journeys.md`
> **Feeds into:** `05_Screen_Inventory.md`, all module docs (06–12)
> **Status:** Reflects the design system already finalized and applied to the live GST Registration page and the Stitch prompts for all 23 screens. This doc codifies it for engineering — it does not introduce new decisions.

---

## 1. Brand Tone → Design Translation

Brand pillars from `01_Product_Vision.md`: **Clear, Trustworthy, Approachable, Efficient.**

| Pillar | Design consequence |
|---|---|
| Clear | High-contrast text, generous whitespace, no more than one CTA emphasized per screen |
| Trustworthy | Restrained color use — gold is scarce and always means "primary action," never decorative |
| Approachable | Rounded corners on cards/buttons, no dense legal-document typography in UI chrome |
| Efficient | Short forms, progressive disclosure (FAQ accordions, not walls of text), template-driven pages |

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color/primary` — LegalX Gold | `#D4A91F` | **Primary CTAs only** (Buy Now, Continue, Book Consultation, Confirm Payment). Never used for backgrounds, icons, or decorative elements. |
| `color/ink` — Slate Navy | `#334155` | Primary text, headers, nav bar active state |
| `color/surface` — Pearl White | `#FAFAF8` | App background, card surfaces |
| `color/surface-alt` | `#FFFFFF` | Elevated cards (lawyer profile card, billing summary) |
| `color/border` | `#E4E1D8` | Hairline dividers, input borders (derived from Pearl White, not pure gray, to keep warmth) |
| `color/text-secondary` | `#64748B` | Sub-labels, metadata (e.g. "3–7 working days") |
| `color/success` | `#1D9E75` | Payment success, "Verified" badges |
| `color/danger` | `#D85A30` | Errors, cancellation states |
| `color/warning` | `#F2A623` | Pending states (e.g. "Awaiting document review") |

**Hard rule:** Gold (`#D4A91F`) appears on at most one element per screen at full saturation. If a screen has two CTAs (e.g. "Consult" + "Buy Now" side by side, per wireframes), only the higher-intent action gets full gold; the secondary gets an outlined/ghost treatment in Slate Navy. This matches the wireframe pattern where secondary actions ("Book Slot," outlined) sit next to primary ones (filled).

---

## 3. Typography

| Style | Size | Weight | Usage |
|---|---|---|---|
| Display | 28px | Semibold | Onboarding / empty states only |
| H1 | 22px | Semibold | Screen titles (e.g. "GST Registration") |
| H2 | 18px | Medium | Section headers (Key Details, FAQ, etc.) |
| Body | 15px | Regular | Paragraph content, descriptions |
| Body Small | 13px | Regular | Metadata, timestamps, helper text |
| Label | 13px | Medium | Form field labels, chip text |
| Price | 20px | Semibold | Always paired with `color/primary` accent underline or badge, never gold text-on-text |

**Font family:** System default (SF Pro / Roboto) — no custom font loading in V1 to keep bundle size and load time low. Revisit only if brand review requires it.

---

## 4. Spacing & Layout

- Base unit: **4px**. All spacing values are multiples of 4 (4, 8, 12, 16, 24, 32).
- Screen horizontal padding: **16px** standard, **20px** on card-heavy screens (Home, Talk to Lawyer listing).
- Card internal padding: **16px**.
- Minimum tap target: **44×44px** (all buttons, chips, list rows).
- Card corner radius: **12px**. Button corner radius: **8px**. Chip/pill radius: **full (999px)** — matches practice-area tags and language tags seen in wireframes.

---

## 5. Core Components

### 5.1 Service Card (Documentation list, Home "Popular Documents")
- Icon or thumbnail, title, one-line description, price line ("From ₹499"), tap target = full card.
- No CTA button on the list card itself — tapping navigates to detail page, where Buy Now lives. This matches wireframe density (grid of service cards with no inline buttons).

### 5.2 Lawyer Profile Card (Talk to Lawyer listing)
- Photo (circular), name, rating (star + number), review count, experience badge, language tags, practice-area tags, three mode buttons (Chat/Voice/Video) each showing per-minute price inline (per decision in `03_User_Personas_and_Journeys.md` §3).
- Favourite icon (heart outline) top-right of card — feeds `Favourite Lawyers` in Profile.

### 5.3 Price Breakdown Block (Billing)
- Line-item list (left-aligned label, right-aligned amount), divider, bold total row.
- Coupon field sits above the breakdown, collapsed by default with a "Have a coupon?" text link — not an always-visible input (reduces perceived friction for the ~90% who don't have one).

### 5.4 Checklist Component (Document detail — "Required Document Checklist")
- Each item: file-type icon, document name, accepted formats + max size as `color/text-secondary` caption.
- Required items and "Additional Documents (if applicable)" render as two visually distinct groups — required first, optional second, with a subtle header divider. Do not merge into one flat list; the content doc explicitly separates them for every one of the 8 services.

### 5.5 FAQ Accordion
- Collapsed by default, single-open (opening one closes any other open item), chevron rotates on expand. Standard pattern — no custom behavior needed.

### 5.6 Video Placeholder Component
- 16:9 frame, `color/border` outline, centered play icon, caption below: "30–60 sec overview." In V1 this renders a placeholder until content is uploaded — build the component to accept a video URL prop so no rework is needed at content-upload time.

### 5.7 Buttons
| Variant | Fill | Text color | Usage |
|---|---|---|---|
| Primary | `color/primary` (Gold) | Slate Navy (`#334155`) — not white, for AA contrast on gold | Buy Now, Confirm, Book Consultation |
| Secondary | Outline, Slate Navy border | Slate Navy | Cancel, secondary actions |
| Ghost | Transparent | Slate Navy | Tertiary actions (e.g. "Skip," "Have a coupon?") |
| Disabled | `color/border` fill | `color/text-secondary` | Any button pending a required input |

### 5.8 Mode Selector (Chat/Voice/Video)
- Three equal-width segmented buttons, icon + label + price. Selected state = filled Slate Navy background, white text (this is the one place navy fills a button, to visually separate "selecting a mode" from "committing to pay").

---

## 6. States Every Component Must Support

Per screen/component, define: **default, loading, empty, error, disabled.** This is a build requirement, not a suggestion — flag any module doc (06–12) that ships without empty/error states called out as incomplete.

| Screen | Empty state | Error state |
|---|---|---|
| Documentation list | N/A (fixed 8 services, never empty) | Failed to load → retry button |
| Knowledge Centre | "Content coming soon" placeholder | N/A (static placeholder in V1) |
| Lawyer listing | "No lawyers match your filters" + clear-filters CTA | Failed to load → retry |
| Favourite Lawyers | "You haven't favourited any lawyers yet" + CTA to Talk to Lawyer | — |
| Transactions | "No transactions yet" | Failed to load → retry |
| Billing (payment) | — | Payment failed → clear retry path, order not created until payment confirms |

---

## 7. Accessibility Baseline

- Minimum text contrast: WCAG AA (4.5:1 body text, 3:1 large text/UI components).
- Gold-on-navy and navy-on-gold both pass AA — verified pairing. Do not introduce gold-on-white text (fails contrast) or white-on-gold text (fails contrast) — gold is a fill color for buttons with navy text, not a text color.
- All tap targets ≥44×44px (see §4).
- All icons paired with text labels in navigation (no icon-only bottom tabs).

---

*Next: `05_Screen_Inventory.md` — every screen with its states and entry/exit points, pending your approval to proceed.*
