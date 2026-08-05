# 23. Release & Environment Strategy

> **Depends on:** `14_Auth_and_Roles.md` (§6 iOS Apple Sign-In flag), `16_Payments_Razorpay.md`, `20_Non_Functional_Requirements.md`
> **Feeds into:** `22_QA_Test_Plan.md` (where each environment gets tested)

---

## 1. Environment Tiers

| Environment | Purpose | Supabase project | Razorpay mode | Agora |
|---|---|---|---|---|
| **Dev** | Active development, local testing | Separate dev Supabase project | Razorpay test mode | Agora test/sandbox app ID |
| **Staging** | Pre-release verification, internal team + advocate pilot testing | Separate staging Supabase project, seeded with realistic dummy data | Razorpay test mode | Same as prod Agora project (test channel names) |
| **Production** | Live app | Production Supabase project (India-region confirmed per `20` §3) | Razorpay live mode | Production Agora app ID |

**Hard rule:** Dev and Staging must never point at the Production Supabase project or Razorpay live keys — this is the single most common way a pre-launch app accidentally processes real payments or exposes real user data during testing. Enforce via separate `.env` configs per environment, not a single config with manually-swapped values.

---

## 2. Build Strategy — Expo / EAS

- **Android-first**, per the platform decision already made — EAS builds should default to producing an Android APK/AAB for the majority of testing and initial rollout, with iOS builds following once App Store review requirements (`14_Auth_and_Roles.md` §6 — Apple Sign-In parity) are accounted for.
- Use **EAS Build profiles** matching the three environment tiers above (e.g. `development`, `preview`/staging, `production`), each pointing at the corresponding `.env` config — this mirrors the same pattern already in use for other projects, just applied consistently here.
- Internal distribution (staging APKs to team/advocate pilot testers) should use EAS's internal distribution channel, not a public app-store beta track, to keep pre-launch builds contained.

---

## 3. Release Gates

Before promoting a build from Staging to Production:

- [ ] All P0 items from `22_QA_Test_Plan.md` §2 pass
- [ ] Core funnels (`22` §3) verified end-to-end on Staging with real (test-mode) Razorpay and Agora calls, not mocked
- [ ] RLS policies verified against the Production Supabase project directly, not assumed to match Staging (config drift between environments is a real risk — verify, don't assume)
- [ ] DPDP consent flow (`20` §3) reviewed and live in the build being promoted
- [ ] Rollback plan confirmed — know how to pull a bad build/disable a broken payment path quickly if something's wrong post-launch

---

## 4. Versioning & Rollout

- Semantic versioning for the app itself (e.g. `1.0.0` at launch).
- Staged rollout recommended for the Android production release (e.g. 10% → 50% → 100% over the first days) rather than a 100% instant release, given this is a payments-and-legal-services app where a broken build has real financial/trust consequences, not just a UX inconvenience.
- Feature flags are not required for V1's scope (it's a fixed, small feature set) — don't add a feature-flagging system speculatively; it's overhead without a clear V1 use case.

---

## 5. Monitoring Post-Launch

- Payment failure rate and webhook error rate (`16`) should be the first dashboard built, before general app analytics — these are the metrics where a silent failure directly costs money or trust.
- Crash reporting (standard RN crash reporting tool of choice) wired into all three environments, with Production alerts routed somewhere actually monitored at launch (not a channel nobody watches).

---

## 6. Explicitly Out of Scope for This Document

- CI/CD pipeline tooling choice (GitHub Actions vs. EAS-native workflows, etc.) — an implementation detail, not fixed here.
- App Store / Play Store listing copy and assets — a launch-marketing task, not an engineering doc concern.

---

## 7. This Closes the Core Documentation Set (01–23)

Remaining in the roadmap: `24_Future_Roadmap_Parking_Lot.md` — the consolidated list of every V2 item flagged across this entire doc set (AI Assistant, Document Modification, Order Tracking, Case Prediction, AI Chat, Wallet Rewards, Vault/Escrow, Referral system, and a few smaller open questions like Rent Agreement subtype and consultation overage billing). Worth generating as a clean single reference so nothing gets lost between now and whenever V2 planning starts.

*Ready to generate `24_Future_Roadmap_Parking_Lot.md` on your go-ahead — or, if you'd rather, we can stop here since 01–23 is the complete V1 build spec.*
