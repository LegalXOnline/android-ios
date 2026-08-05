# 08. Module Spec — Knowledge Centre (SCR-05, SCR-06)

> **Depends on:** `01_Product_Vision.md` (explicit: do NOT redesign), `02_Information_Architecture.md`, `05_Screen_Inventory.md`
> **Feeds into:** `18_API_Integration_Contracts.md`
> **Status:** Placeholder only. Content and final visual design already exist, built by another team. This doc's only job is to define the placeholder and the integration seam — not to design the feature.

---

## 1. Purpose & Boundary

The Knowledge Centre is one of LegalX's three pillars (Product Vision §3) and a top-of-funnel entry point (Journey map, `03` §4), but its content and content-design were already completed elsewhere. **This app's job in V1 is to build the shell that will later fetch and render that content from GitHub — nothing more.**

Do not:
- Redesign the article layout
- Invent a new content taxonomy
- Build a CMS or admin interface
- Build real GitHub-fetch logic in V1 (placeholder only — see §4)

---

## 2. Screen: SCR-05 Knowledge Feed (placeholder)

### 2.1 Layout

- Category tabs row (horizontal scroll) — placeholder categories only (e.g. "My Feed," "Cyber," "Traffic," "POCSO" per wireframe reference); **final category list and content come from the existing Knowledge Centre build, not invented here.**
- Below tabs: a vertical list of placeholder article cards — image, headline, 1-line teaser, per wireframe pattern.
- All content on this screen in V1 is static placeholder/dummy data, not live.

### 2.2 States

| State | Behavior |
|---|---|
| Placeholder (permanent for V1) | Renders static dummy cards — this is the only state this screen needs for launch |
| Future: Loading/Error/Empty | Deferred to the version where GitHub fetch is wired up — do not build these states prematurely |

---

## 3. Screen: SCR-06 Article Detail (placeholder)

### 3.1 Layout (per wireframe)

- Hero image related to the law/topic
- Headline
- Body content (~250–400 words placeholder text)
- Sources section
- Media controls (play/pause/resume/download icons) — placeholder only, wired to nothing in V1
- **Cross-sell CTA block at the bottom:** "Need this done? → Documentation" and "Still unsure? → Talk to Lawyer" (per Journey Map `03` §4 — this is the one piece of real, functional behavior this module needs in V1, since it's the bridge into the two revenue-generating flows)

### 3.2 States

| State | Behavior |
|---|---|
| Placeholder (permanent for V1) | Static dummy article content |

---

## 4. GitHub Content-Fetch Integration Contract (future-facing, documented now to avoid rework)

This section defines the **shape** of the future integration so the placeholder components are built with the right props from day one — even though the fetch logic itself is not implemented in V1.

- Content source: a GitHub repository (already built/maintained by the separate Knowledge Centre team).
- Expected content unit: individual article as Markdown or JSON with fields matching the placeholder layout in §3.1 (headline, body, sources, hero image URL, category).
- Fetch pattern (for V2 implementation, not V1 build): likely a scheduled sync job pulling from GitHub into a Supabase table, rather than live-fetching GitHub on every app load — flag this as a decision for `18_API_Integration_Contracts.md` when that integration is actually scoped.
- **V1 build requirement:** component props should already match this future shape (e.g. `article.headline`, `article.body`, `article.sources[]`) even while fed by static placeholder data, so swapping the data source later requires no component rework.

---

## 5. Explicitly Out of Scope for This Module

- No search within Knowledge Centre (covered by Home search only for document/lawyer results — see `06_Module_Home.md` §3.1).
- No user-generated content, comments, or bookmarking of articles in V1.
- No redesign of visual layout — wireframe pattern shown is the existing team's design; replicate, don't reinterpret.

---

## 6. Analytics Events

- `knowledge_feed_viewed`
- `knowledge_article_viewed` (props: `article_id_placeholder`)
- `knowledge_crosssell_documentation_tapped`
- `knowledge_crosssell_lawyer_tapped`

---

*Next: `09_Module_Talk_to_Lawyer.md` — lawyer discovery, filters, and profile detail spec, pending your approval to proceed.*
