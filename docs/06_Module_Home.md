# 06. Module Spec — Home (SCR-01, SCR-02)

> **Depends on:** `01_Product_Vision.md`, `02_Information_Architecture.md`, `04_Design_System.md`, `05_Screen_Inventory.md`
> **Feeds into:** `13_Data_Model_Supabase_Schema.md`, `18_API_Integration_Contracts.md`, `21_Analytics_Events.md`

---

## 1. Purpose

Home is the orientation and discovery screen — the first thing a returning user sees, and the launchpad into all three pillars (Product Vision §3). It must let a user with a specific need (buyer) route in 1–2 taps, and a browsing user discover popular content.

---

## 2. Screen: SCR-01 Home

### 2.1 Layout (top to bottom)

1. **Header row** — Greeting ("Good evening, [First name]") + Profile avatar icon (top-right, → SCR-16 Profile) + LX Coin balance chip (top-right or below greeting; view-only, → SCR-18)
2. **Search bar** — Full-width, tappable → SCR-02 Search Results. Placeholder text: "Search documents, lawyers, or topics"
3. **Our Services — 3 entry cards** (equal width, per wireframe):
   - Documentation → SCR-03
   - Knowledge Centre → SCR-05
   - Talk to a Lawyer → SCR-07
4. **Popular Documents** — horizontal scroll of Service Cards (§5.1 of `04_Design_System.md`), max 6 shown, "See all" → SCR-03
5. **Popular Lawyers** — horizontal scroll of Lawyer Profile Cards (compact variant — photo, name, rating, top practice area only), max 6 shown, "See all" → SCR-07

### 2.2 Data Requirements

| Element | Source | Notes |
|---|---|---|
| Greeting name | Supabase Auth session → `profiles.first_name` | Fallback: "Welcome back" if name unset |
| LX Coin balance | `wallets.balance` (view-only in V1) | See `13_Data_Model_Supabase_Schema.md` |
| Popular Documents | Static ranking in V1 (curated list of the 8 services, editorial order) — **not** algorithmic in V1 | Avoid building a "popularity" ranking pipeline for a fixed 8-item catalog; that's over-engineering for V1 |
| Popular Lawyers | Ranked by `rating DESC, review_count DESC`, filtered to `is_available = true` | Simple, defensible default; no ML ranking in V1 |

### 2.3 States

| State | Behavior |
|---|---|
| Loading | Skeleton cards for Popular Documents / Popular Lawyers rows; header renders immediately from cached session data |
| Error (popular content fails to load) | Row-level retry — don't block the whole screen if only one section fails |
| Empty (no lawyers available) | Popular Lawyers row hidden entirely rather than showing an empty state — this is a discovery row, not a required one |

### 2.4 Interactions

- Tapping a Service Card → SCR-04 (Service Detail) directly, skipping SCR-03 — matches wireframe ("Doc Scrolling with img" cards go straight to a document's detail).
- Tapping "Our Services → Documentation" → SCR-03 (the list), a different entry point than tapping an individual popular document card. Both are valid, non-redundant paths.

---

## 3. Screen: SCR-02 Search Results

### 3.1 Behavior

- Single search input queries across: the 8 document services (by name/keyword) and lawyers (by name/practice area).
- Results render as two sections if both types match: "Documents" and "Lawyers" — do not interleave them, per the persona insight in `03_User_Personas_and_Journeys.md` §2 that buyers arrive with one of two distinct intents.
- No search across Knowledge Centre content in V1 — that content is externally sourced (GitHub) and its own search behavior is owned by the existing Knowledge Centre implementation, not rebuilt here.

### 3.2 States

| State | Behavior |
|---|---|
| Empty query | Show recent searches (if any, local-only, no backend persistence needed for V1) or nothing |
| No results | "No matches for '[query]'" + suggestion to browse Documentation or Talk to Lawyer directly |
| Loading | Debounce input 300ms before querying; skeleton rows while pending |
| Error | Inline retry, do not lose the typed query |

---

## 4. Explicitly Out of Scope for This Module

- No personalized/algorithmic recommendations (Product Vision §5 — no AI features in V1).
- No push-notification-driven Home banners/promo carousel — not specified in wireframes or content docs; do not invent one without a scope note in `01`.
- No order-tracking widget on Home (Product Vision §5).

---

## 5. Analytics Events (see `21_Analytics_Events.md` for full taxonomy)

- `home_viewed`
- `home_search_initiated`
- `home_service_card_tapped` (props: `service_id`, `position`)
- `home_lawyer_card_tapped` (props: `lawyer_id`, `position`)
- `home_popular_documents_see_all_tapped`
- `home_popular_lawyers_see_all_tapped`

---

*Next: `07_Module_Documentation.md` — the Documentation module and single-service page template spec, pending your approval to proceed.*
