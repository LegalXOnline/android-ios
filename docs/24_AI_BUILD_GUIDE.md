# 24_AI_BUILD_GUIDE.md

> **Audience:** AI coding assistants only (Antigravity — primary; Claude, Cursor, Windsurf, Copilot, and similar tools — secondary). Not for human developers, not for users.
> **Authority:** This guide governs *how* code gets written. Documents `01`–`23` govern *what* gets built. If this guide and `01`–`23` conflict on a specific, already-documented feature (e.g. Notifications in `17`, Analytics in `21`), **the specific module doc wins** — this guide's forbidden-features list (§6) is a default-off rule for anything *not* already documented, not a retroactive cut of approved scope. When in doubt, stop and ask rather than guessing which wins.
> **Reference before every frontend task. No exceptions.**

---

## 1. Purpose of This Guide

Ensure every AI assistant working on this codebase produces consistent, production-ready, scalable TypeScript/React Native code that strictly matches LegalX V1 scope — without re-deriving product decisions, re-litigating scope, or introducing style drift between sessions or tools.

---

## 2. AI Responsibilities

- Read `01_Product_Vision.md` through `23_Release_Environment_Strategy.md` before generating any screen or component tied to a module those docs cover.
- Generate **frontend code only.** Backend (Supabase schema, RLS, Edge Functions, Razorpay/Agora server logic) belongs to interns — see §8.
- Flag ambiguity instead of guessing. If a doc doesn't answer a question this guide can't resolve either, stop and surface the question rather than inventing an answer.
- Never treat a wireframe, reference build, or prior conversation as authoritative over the numbered docs. Docs `01`–`23` are the source of truth.

---

## 3. AI Decision-Making Rules

| Situation | Rule |
|---|---|
| Doc says X, assumption says Y | Doc wins, always |
| Doc is silent on a UI detail | Follow `04_Design_System.md` tokens/components; do not invent new visual patterns |
| Doc is silent on a behavior | Stop and ask — do not infer from "what a typical app would do" |
| Two docs appear to conflict | Surface the conflict explicitly; do not silently pick one |
| A reference/inspiration design shows a feature not in `01`–`23` | It is out of scope by default (see §6) |

---

## 4. Version 1 Philosophy

- V1 is a **thin, complete slice** — every documented screen works end-to-end; nothing undocumented exists at all.
- Simple and shipped beats clever and speculative.
- Do not build for a V2 that isn't specified. Do not add extensibility "just in case" — that's premature abstraction, not good architecture.

---

## 5. Scope Restrictions

- Generate code **only** for the 24 screens (SCR-01 to SCR-22 + auth) in `05_Screen_Inventory.md`. Nothing else.
- Never invent a new screen, tab, modal, or user flow.
- Never rename a documented component, field, or route.
- Never redesign an approved layout because it "could be better" — raise it as a question, don't silently change it.

---

## 6. Features Explicitly Forbidden (Do Not Build Without a Documented Spec)

None of the below may be built unless a numbered doc (`01`–`23`) specifically describes it. As of this guide, none do:

- AI Assistant / AI Chat
- Case Prediction
- Document Modification (post-purchase editing)
- Order Tracking (live fulfilment status UI)
- Referral / Invite-Friends system
- Wallet recharge / reward logic (LX Coin balance **display** is in scope per `12_Module_Profile.md` §4 — recharge is not)
- Document Vault / Escrow
- Admin panel
- Settings beyond what `12_Module_Profile.md` §2.1 documents
- Offline mode (beyond the minimal messaging in `20_Non_Functional_Requirements.md` §4)
- Automated testing framework setup (not a frontend build task for this guide)
- Any experimental/undocumented feature, however small it looks

**Clarification on Notifications and Analytics:** `17_Notifications.md` and `21_Analytics_Events.md` are approved, in-scope modules — build exactly what they specify (push + WhatsApp fallback triggers; the canonical event list). What's forbidden is an AI assistant *inventing additional* notification types, analytics events, or a notification/analytics system beyond what those two docs define.

---

## 7. Frontend Responsibilities

- All 24 screens, navigation, state management, API-consuming UI, and component library.
- Consuming contracts defined in `18_API_Integration_Contracts.md` — calling the documented functions/tables, not designing new ones.
- Rendering, not deciding: e.g. render whatever `lawyers` query RLS returns; do not add a client-side "just in case" filter duplicating backend logic.

---

## 8. Backend Boundaries — Never Generate

- Supabase table/schema definitions or SQL
- RLS policies
- Edge Functions / server-side logic
- Authentication backend logic (consume Supabase Auth client SDK only — see `14_Auth_and_Roles.md`)
- Payment verification logic (Razorpay webhook handling — see §36)
- Agora token generation (see §37)
- Any business logic that belongs server-side per `13_Data_Model_Supabase_Schema.md` §3 or `18_API_Integration_Contracts.md`

If a task seems to require backend logic, create the integration point (a typed function signature, a clearly marked TODO) and stop — leave implementation to interns.

---

## 9. Component Design Rules

- Every component: single responsibility, typed props, no implicit `any`.
- Prefer composition over configuration flags that branch behavior heavily (e.g. don't build one `<Card variant="lawyer" | "service" | "billing">` monolith — build distinct, small components per `04_Design_System.md` patterns).
- No component should encode business logic (pricing math, RLS-equivalent filtering) — components render what they're given.
- Reusable primitives (Button, Card, Chip, Accordion, Checklist, VideoPlaceholder) live centrally; screen-specific compositions live per-screen.

---

## 10. Screen Design Rules

- One screen = one file (plus co-located sub-components if truly screen-specific).
- Screen order and section order within a screen must match the exact order specified in the relevant module doc (`06`–`12`) — do not reorder for "better flow" without flagging it.
- Every screen must implement all applicable states from `04_Design_System.md` §6 (loading, empty, error, disabled) — a screen without these is incomplete, not done.

---

## 11. Navigation Rules

- Bottom tab navigator: exactly 4 tabs (Home, Documentation, Knowledge Centre, Talk to Lawyer) per `02_Information_Architecture.md` §1. Never a 5th tab.
- Profile is a stack push from Home's avatar icon, not a tab.
- Billing (SCR-13) is a **single shared screen** reached from two different flows — do not build two Billing implementations (`02` §4).
- Deep-link structure per `02_Information_Architecture.md` §5 where applicable.

---

## 12. Folder Structure Rules

- Organize by feature/module (`home/`, `documentation/`, `knowledge-centre/`, `talk-to-lawyer/`, `booking/`, `billing/`, `profile/`), not by file type (`components/`, `screens/`, `hooks/` sprawled flat).
- Shared/reusable components live in a top-level `shared/components/` or `ui/` directory — nothing feature-specific belongs there.
- Design tokens (colors, spacing, typography from `04_Design_System.md`) live in one central theme file, imported everywhere — never redefined per-component.

---

## 13. File Naming Rules

- Components: PascalCase (`LawyerProfileCard.tsx`)
- Hooks: camelCase with `use` prefix (`useLawyerAvailability.ts`)
- Screens: PascalCase matching the `05_Screen_Inventory.md` screen name (`LawyerProfileDetailScreen.tsx`)
- Types/interfaces: PascalCase, colocated with what they describe or in a shared `types/` file for cross-cutting shapes (e.g. `Order`, `Consultation` matching `13_Data_Model_Supabase_Schema.md`)

---

## 14. TypeScript Rules

- Strict mode on. No `any` without an explicit, justified comment.
- Every data shape consumed from Supabase/Razorpay/Agora is typed, matching the field names in `13_Data_Model_Supabase_Schema.md` and `18_API_Integration_Contracts.md` exactly — no ad hoc renaming.
- Prefer discriminated unions for polymorphic shapes (e.g. `Order` with `order_type: 'document' | 'consultation'`) over loosely-typed optional fields — this directly mirrors the `orders` table design in `13` §2.6.

---

## 15. React Native Best Practices

- Functional components with hooks only — no class components.
- Avoid unnecessary re-renders: memoize list item renderers (lawyer cards, service cards) used in `FlatList`/`FlashList`.
- Use `SafeAreaView`/safe-area hooks consistently across all screens (Android-first, but respect notches/gesture bars).
- No inline anonymous functions passed as props inside list renderers where it causes avoidable re-renders at scale (Lawyer Listing, Service List).

---

## 16. State Management Rules

- Local component state for UI-only concerns (form inputs, accordion open/close, selected tab).
- Server state (services, lawyers, orders, profile) via a data-fetching layer (React Query or equivalent) — do not hand-roll caching/loading state management per screen.
- Global state limited to session/auth and the in-progress order/booking payload (per `10_Module_Consultation_Booking.md` §5, `14_Auth_and_Roles.md` §3 session-preservation requirement) — do not create a global store for things that are genuinely screen-local.

---

## 17. Styling Rules

- No inline styles for anything reusable — use `StyleSheet.create` or the project's styling solution, sourced from centralized design tokens (§18).
- No magic numbers for spacing/color — every value traces back to `04_Design_System.md` §2–§4.
- No per-screen one-off color values, ever.

---

## 18. Theme Rules

- **One theme only.** No Light Mode, No Dark Mode, no theme switching, no OS appearance detection.
- Colors, typography, spacing come from a single centralized theme object matching `04_Design_System.md` exactly.
- Do not build theme-switching infrastructure "for future flexibility" — that's exactly the premature-abstraction pattern §4 warns against.

---

## 19. Performance Rules

- Keep bundle size lean — every new dependency needs a reason; prefer what's already in the approved stack (`13_Data_Model_Supabase_Schema.md`'s referenced tech: React Native/Expo, Supabase, Razorpay, Agora) over adding a new library for a one-off need.
- Lazy-load/paginate lists (Lawyer Listing) rather than fetching entire tables client-side, per `20_Non_Functional_Requirements.md` §1.
- Static, template-driven content (the 8 services) should not re-fetch on every navigation if already cached for the session.

---

## 20. Responsive Design Rules

- **Android phones only.** No tablet layouts, no foldable-specific handling, no desktop/web breakpoints.
- Design for a representative mid-range Android screen size range, not just one device.
- Respect `04_Design_System.md` §4 spacing/tap-target rules across the supported size range — don't hardcode pixel-perfect layouts that break on smaller screens.

---

## 21. Animation Rules

- Minimal, functional only: screen transitions (default navigator transitions), accordion expand/collapse, button press feedback.
- No decorative animation, no gratuitous micro-interactions, no Lottie/complex animation libraries unless a specific doc calls for it (none currently do).

---

## 22. Image Handling Rules

- Lawyer photos, service icons, Knowledge Centre placeholder images: use a consistent image component with loading/error fallback (a broken image must never show a raw broken-image icon to the user).
- Video placeholder component (`04_Design_System.md` §5.6) accepts a URL prop from day one, even while unpopulated — no rework needed when real video content ships.

---

## 23. Icons Rules

- One icon set, used consistently (do not mix icon libraries across screens).
- Icons always paired with text labels in navigation — no icon-only bottom tabs (`04_Design_System.md` §7).

---

## 24. Forms & Validation Rules

- Inline, field-level validation (Edit Profile, Billing user details) — never a blocking modal for validation errors.
- Required vs. optional fields must visually match what `12_Module_Profile.md` §3.1 and `11_Module_Billing_Payments.md` §2.1 specify — do not add extra required fields.
- Forms never clear entered data on a failed submit (`12` §3.2).

---

## 25. Error Handling Rules

- Every API-consuming screen implements the error state defined in its module doc — a screen that only handles the happy path is incomplete.
- Payment errors: return to Billing, preserve the order context, never lose the user's place mid-checkout (`14_Auth_and_Roles.md` §3, `11_Module_Billing_Payments.md` §3).
- Error messages are human-readable, not raw error codes/stack traces surfaced to the user.

---

## 26. Loading States

- Skeleton loaders for content-bearing sections (per each module doc's §on states) — not blank screens or unexplained spinners for anything more than a brief fetch.
- Header/nav chrome renders immediately from cached/session data even while content below loads (`06_Module_Home.md` §2.3).

---

## 27. Empty States

- Every list-type screen (Favourite Lawyers, Call History, Transactions, Lawyer Listing with filters applied) implements its documented empty state copy and CTA — not a blank list.

---

## 28. Reusable Component Guidelines

- If a UI pattern appears in 2+ screens (Service Card, Lawyer Profile Card, FAQ Accordion, Checklist, Price Breakdown), it is a shared component — never duplicated per-screen.
- Shared components take typed data props; they do not fetch their own data.

---

## 29. Code Quality Standards

- Consistent formatting (Prettier/ESLint config as set up by interns — follow it, don't override).
- No commented-out dead code left in commits.
- No `console.log` left in production code paths.
- Functions and components stay small and single-purpose — if a screen component exceeds a few hundred lines, extract sub-components.

---

## 30. Documentation Rules

- Every non-obvious piece of frontend logic gets a one-line comment explaining *why*, not *what* (the code already shows what).
- Any deviation from a documented spec (even a small one, made because the spec was ambiguous) must be flagged in the PR description, not silently absorbed.

---

## 31. Git & Commit Expectations

- Small, scoped commits per screen/component, not one giant commit per module.
- Commit messages reference the relevant doc/screen ID where useful (e.g. `feat: SCR-04 service detail template`).
- No direct commits to main/production branch — follow whatever branch strategy interns have set up.

---

## 32. Build Rules

- Follow the environment tiers in `23_Release_Environment_Strategy.md` §1 — never point a dev build at production Supabase/Razorpay/Agora credentials.
- EAS build profiles match Dev/Staging/Production per `23` §2.

---

## 33. Dependency Rules

- No new dependency added without checking whether an already-approved library covers the need.
- No experimental/unmaintained packages.
- No dependency that duplicates functionality already covered by Supabase client SDK, Razorpay SDK, or Agora SDK.

---

## 34. Accessibility (Basic Only)

- WCAG AA contrast (`04_Design_System.md` §7).
- Minimum 44×44px tap targets.
- No accessibility framework beyond RN's built-in accessibility props (`accessibilityLabel`, `accessibilityRole`) — nothing more elaborate is in scope for V1.

---

## 35. Security Considerations (Frontend Only)

- Never store raw payment credentials client-side (Razorpay SDK handles this — `20_Non_Functional_Requirements.md` §2).
- Never trust client-side payment-success callbacks as ground truth (`16_Payments_Razorpay.md` §2) — always defer to server-confirmed order status before showing Confirmation.
- Auth tokens handled via Supabase client SDK's default secure storage — no custom plaintext token storage.
- Never log PII (phone, email, address, uploaded documents) to console or crash-reporting breadcrumbs.

---

## 36. Razorpay Integration Boundaries

- Frontend implements: Billing screen UI, invoking the Razorpay Checkout SDK with a server-provided `razorpay_order_id`, handling the SDK's client callback as an *informational* trigger to re-check order status — never as the source of truth.
- Frontend never implements: signature verification, webhook handling, refund logic. These are intern/backend work per `16_Payments_Razorpay.md` §2.

---

## 37. Agora Integration Boundaries

- Frontend implements: joining a channel with a server-issued token, Chat/Voice/Video UI, reporting join/leave events to the backend.
- Frontend never implements: token generation, session-authorization logic. If a task requires server-side Agora logic, create the integration point (typed function call) and stop — leave to interns, per `15_Realtime_Communication_Agora.md` §2.

---

## 38. Knowledge Centre Integration Notes

- Placeholder UI only, per `08_Module_Knowledge_Centre.md`. No redesign of an already-built feature. No GitHub fetch logic, no API calls — static/dummy data only, shaped to match the future content contract in `18_API_Integration_Contracts.md` §4 so no rework is needed later.

---

## 39. LX Coin UI Rules

- **View-only balance display.** No recharge UI, no "Buy Coins" button, no reward/cashback logic anywhere in the app (`12_Module_Profile.md` §4).
- If a reference design or wireframe shows a recharge flow, do not build it — omit entirely rather than shipping a non-functional button.
- "Doc Vault" naming: follow whichever resolution was confirmed in `12_Module_Profile.md` §9 — do not build encrypted-vault UI unless that decision explicitly says so.

---

## 40. Final AI Checklist Before Generating Code

Before writing a single line of code for any task, confirm:

- [ ] The screen/component is listed in `05_Screen_Inventory.md`
- [ ] The relevant module doc (`06`–`17`) has been read for this specific screen
- [ ] No forbidden feature (§6) is being introduced
- [ ] All applicable states (loading/empty/error/disabled) are planned for
- [ ] No backend logic is being written (§8, §36, §37)
- [ ] Styling uses only centralized design tokens (§17–§18)
- [ ] Component is reusable if the pattern appears elsewhere (§28)
- [ ] Any ambiguity has been flagged, not silently resolved

If any box is unchecked, stop and resolve it before generating code.

---

*This guide governs execution style. Scope and product truth remain owned by `01_Product_Vision.md` through `23_Release_Environment_Strategy.md`.*
