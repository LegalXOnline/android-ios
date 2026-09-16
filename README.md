# LegalX — Mobile

The client app for [legalxonline.com](https://legalxonline.com). Indian legal
services: talk to a verified advocate by chat, voice or video, order document
services, and read plain-language explainers on Indian law.

Built with Expo (SDK 57) and React Native. Android and iOS from one codebase.

The advocate and admin portals are on the web. This app is for clients only —
signing in with either of those roles shows a notice rather than a client
dashboard they cannot use.

---

## Running it

Node 22.13 or newer, which is what SDK 57 requires.

```bash
npm install
cp .env.example .env     # fill in the three EXPO_PUBLIC_ values
npx expo start
```

Chat, documents and the knowledge centre run anywhere, including the browser
preview. **Voice and video do not**: Agora is a native module, absent from Expo
Go and from web, so calls need a development or preview build.

```bash
npx eas build --platform android --profile preview
```

### Environment

Three values, all inlined into the bundle at build time — there is no runtime
configuration on the device.

| Variable | |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Publishable key. Safe to ship; RLS decides what it can reach |
| `EXPO_PUBLIC_API_URL` | LegalX backend |

For EAS builds these live in `eas.json` under each profile, because the build
runs from a clean checkout where `.env` is not present.

---

## How it fits together

```
  mobile app  ---+
                 +-->  legalx-backend  -->  Supabase   Postgres, Auth, Storage
  website     ---+        (Express)         Agora      voice and video
                                            Razorpay   payments
                                            Resend     transactional email
```

The app holds no business logic of its own. It authenticates against Supabase,
then sends that token as a Bearer credential to the backend, which owns every
rule worth enforcing: what a consultation costs, whether credit covers it, who
may read a document. The same endpoints serve the website, so a price or a
required document changes in one place.

### Layout

```
src/
  app/          expo-router routes; a file here is a screen
  features/     one folder per area — auth, home, documentation,
                knowledge, lawyer, consultation, billing, profile
  services/     the only place that talks to the network
  shared/       components, hooks and utilities used across features
  theme/        design tokens — Material 3 Expressive over the LegalX palette
```

Screens do not call `fetch`. Everything goes through `services/`, which attaches
the Bearer token and turns a failure into a message worth showing someone.

---

## Things worth knowing before changing them

**Money is decided by the server.** Consultations are paid in LX coins — one
coin is ₹1 — and billed by the minute for time actually used. The app displays
the rate; it never computes a total. The clock comes from `started_at`, stamped
when the advocate accepts, so a client waiting in an unanswered room is charged
nothing and both sides show the same number.

**Safe-area insets are a reservation, not a gap.** The inset is what the system
keeps for its own navigation bar. Bottom controls add their padding *to* it.
Taking whichever is larger puts the control inside that band and under the
system bar on a handset with gesture navigation.

**Native modules break the web bundle.** `react-native-agora` is resolved to
nothing on web in `metro.config.js`, and the call screen says so. Metro resolves
`require` statically, so a runtime platform check is not enough on its own.

**The APK is trimmed deliberately.** `plugins/withAbiFilters.js` keeps one
architecture and drops eleven Agora extensions the app never opts into — lip
sync, spatial audio, virtual background and the rest. That is 106 MB down to 37.
Removing the wrong `.so` breaks calls at runtime, not at build time, so check
the built artifact after changing it.

**Nothing is a fixture.** Every screen reads the API. Where an endpoint does not
exist yet the screen shows an empty state, which is true, rather than invented
rows, which are not.

---

## Known limits

- Payment is in demo mode. An order is recorded and the team notified; no money
  moves. Razorpay is wired on the web and not yet here.
- Scheduling a consultation for later is not supported. An advocate is either
  available now or is not.
- Saved lawyers, saved articles, orders and support tickets have no endpoint
  behind them and show empty states.

## Licence

Proprietary. © LegalXOnline.
