# 20. Non-Functional Requirements

> **Depends on:** all prior docs — this consolidates cross-cutting constraints referenced throughout (`13`, `14`, `15`, `16`, `17`)
> **Feeds into:** `22_QA_Test_Plan.md`, `23_Release_Environment_Strategy.md`

---

## 1. Performance

| Requirement | Target | Notes |
|---|---|---|
| App cold start | Under 3 seconds to interactive Home screen | Android-first target device range should skew mid-range, not flagship — test on representative hardware, not just a dev's own phone |
| Service detail page load | Under 1 second (content is static/template-driven per `07`, no reason for slow loads) | |
| Lawyer listing load | Under 2 seconds for first page of results | Paginate rather than loading the full roster at once as the lawyer count grows |
| Search debounce | 300ms (per `06_Module_Home.md` §3.2) | Avoid firing a query per keystroke |
| Agora session join | Under 3 seconds from tap to connected | Flag with Agora's own SLA docs — this is a third-party dependency, not something LegalX controls end-to-end |

---

## 2. Security

| Area | Requirement |
|---|---|
| Data in transit | TLS everywhere (Supabase, Razorpay, Agora all enforce this by default — verify no custom endpoint bypasses it) |
| RLS enforcement | Every table's RLS policy from `13_Data_Model_Supabase_Schema.md` §3 must be tested, not just written — a policy that exists but wasn't verified is not a security control |
| Payment data | LegalX never stores raw card/payment credentials — Razorpay handles PCI-DSS scope entirely; LegalX only stores `payments` records with Razorpay-issued references (`13` §2.10) |
| Auth tokens | Handled by Supabase client SDK; no custom token storage in plain text (use platform-secure storage — Keychain/Keystore via the SDK's default behavior) |
| Lawyer enrollment integrity | The compliance-critical RLS rule from `13` §3 (`is_enrolled_advocate = true` enforced at query level) needs a periodic audit process, not just a one-time policy write — flag for ops, not just engineering |

---

## 3. Compliance — DPDP Act (India)

LegalX collects personal data (identity documents, contact info, address, financial/payment data) as core to its business — DPDP Act compliance isn't optional.

| Requirement | Application |
|---|---|
| Consent | Explicit consent at signup for data processing purposes (document drafting, consultation facilitation) — a clear consent checkpoint, not buried in generic ToS acceptance |
| Purpose limitation | Documents uploaded for one service (e.g. GST checklist uploads) should not be repurposed for another without fresh consent — relevant if any future feature considers reusing uploaded KYC docs across services |
| Data minimization | Only collect what each specific service's checklist requires (`19` §1) — do not add speculative "nice to have" profile fields |
| Right to erasure | Account deletion request (routed through Support per `14_Auth_and_Roles.md` §6) must have a real backend deletion process, not just a "deactivated" flag — legal/financial record retention requirements (e.g. transaction records) may create tension with full erasure; this needs a policy decision with legal counsel, not an engineering default |
| Data localization | Supabase project region should be confirmed as India-appropriate for data residency — this was already a stated reason for choosing Supabase over alternatives; verify the actual configured region matches that intent |
| Breach notification | Have a documented process (even a simple one) for what happens if a data exposure occurs — required under DPDP, worth having before launch even if never triggered |

---

## 4. Reliability

| Requirement | Notes |
|---|---|
| Payment idempotency | Webhook handler (`16` §2) must be idempotent — a duplicate webhook delivery (Razorpay may retry) must not double-charge or double-create records |
| Graceful degradation | If Knowledge Centre placeholder content fails to load, it must not block navigation to Documentation or Talk to Lawyer — no single module's failure should cascade |
| Offline behavior | Minimum viable: clear "You're offline" messaging rather than silent failures or infinite spinners — full offline-first architecture is not required for V1 |

---

## 5. Accessibility

Covered in detail in `04_Design_System.md` §7 — referenced here as a formal NFR so it's tracked in QA (`22`), not just design intent.

---

## 6. Localization

- V1 is **English only** per all source material (content doc, wireframes) — no multi-language UI in V1, despite lawyers themselves supporting multiple languages (that's a lawyer-attribute field, `13` §2.4, not an app-localization requirement).
- Do not build a translation/i18n framework speculatively for V1 — flag as a V2 consideration if regional-language UI becomes a priority, but don't add the engineering overhead now for a requirement that isn't in scope.

---

## 7. Explicitly Out of Scope for This Document

- Load testing / scale targets beyond "works well for a launch-scale user base" — formal capacity planning is premature before real usage data exists.
- Formal penetration testing schedule — recommend one before launch, but scheduling/vendor selection is an ops decision, not a spec item here.

---

*Next: `21_Analytics_Events.md` — consolidating the event taxonomy referenced throughout modules 06–17 into one canonical list, pending your approval to proceed.*
