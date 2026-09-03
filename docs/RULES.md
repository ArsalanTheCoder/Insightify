# Insightify — Project Rules & Best Practices

> **Document:** `docs/RULES.md`  
> **Scope:** Entire Insightify mobile application  
> **Platform:** React Native CLI  
> **Language:** JavaScript  
> **Backend:** External Python/FastAPI REST API  
> **Primary Themes:** Light Mode + Dark Mode  
> **Architecture:** Feature-oriented, API-driven, component-based frontend  
> **Status:** Production-oriented engineering baseline

---

## 1. Purpose

This document defines the detailed, non-negotiable engineering, UI, architecture, performance, security, accessibility, documentation, and quality rules for the Insightify mobile application.

These rules apply to:

- every feature;
- every screen;
- every component;
- every hook;
- every API integration;
- every theme;
- every navigation flow;
- every native integration;
- every refactor;
- every bug fix;
- every production release.

`AGENTS.md` provides the global project context and architectural direction.

`docs/RULES.md` defines the detailed engineering rules used to implement that direction.

Feature-specific requirements, contracts, flows, and decisions belong in `docs/RFC/`.

---

# 2. Non-Negotiable Principles

The following principles apply to the complete codebase.

## 2.1 Production First

Do not intentionally introduce temporary, fragile, or knowingly incomplete production architecture.

Avoid:

- shortcuts;
- copy-paste implementations;
- magic values;
- hidden global dependencies;
- fake API behavior presented as real functionality;
- dead code;
- commented-out abandoned implementations;
- arbitrary delays;
- silent error swallowing;
- duplicated systems;
- feature-specific hacks that should belong in shared infrastructure.

When a temporary workaround is genuinely unavoidable, document:

1. why it is required;
2. what limitation it addresses;
3. what the intended permanent solution is.

## 2.2 Root Cause First

When a bug appears:

1. reproduce it;
2. identify the root cause;
3. understand affected boundaries;
4. make the smallest correct fix;
5. validate the fix.

Do not patch symptoms blindly.

## 2.3 Minimal Correct Change

A focused task should produce a focused change.

Do not combine:

- unrelated cleanup;
- unrelated redesign;
- unrelated dependency migration;
- unrelated refactoring;

with a feature task unless explicitly required.

## 2.4 Evidence Before Assumption

Use, in order of importance:

1. current source code;
2. verified backend/API contract;
3. approved RFC;
4. `docs/RULES.md`;
5. `AGENTS.md`.

Do not invent API fields, endpoint behavior, response formats, navigation routes, backend capabilities, or product requirements.

---

# 3. Architecture Rules

## 3.1 Frontend-Only Repository

Insightify is a mobile frontend repository.

The repository must not contain:

- FastAPI server code;
- PostgreSQL access;
- backend database drivers;
- backend AI provider SDKs;
- backend business services;
- backend migrations;
- backend worker code;
- backend server deployment logic.

The frontend communicates with the external backend through REST APIs.

## 3.2 Architectural Boundary

The permitted high-level flow is:

```text
React Native UI
      ↓
Feature Hooks / Actions
      ↓
Feature API Service
      ↓
Central API Client
      ↓
HTTPS / REST
      ↓
External FastAPI Backend
      ↓
Backend Services / Database / AI
```

The mobile application must not bypass this boundary.

## 3.3 No Direct Database Access

Never:

- connect to PostgreSQL;
- import database clients;
- execute SQL;
- access backend database credentials;
- bypass FastAPI.

## 3.4 No Direct AI Provider Access

Never call an external AI provider directly from the mobile app.

Do not place:

- Gemini keys;
- OpenAI keys;
- Anthropic keys;
- other server-side model credentials;

inside JavaScript, native source, bundled configuration, or app assets.

AI analysis is requested through the external backend API.

## 3.5 No Parallel API Architectures

Do not create multiple competing HTTP systems.

Bad:

```text
Screen A → fetch()
Screen B → axios instance
Screen C → another fetch wrapper
Screen D → separate API client
```

Good:

```text
Screen / Hook
      ↓
Feature API
      ↓
Central API Client
      ↓
FastAPI
```

A new API transport architecture requires an RFC.

---

# 4. Repository Structure

The recommended project organization is feature-oriented.

```text
Insightify/
│
├── AGENTS.md
│
├── docs/
│   ├── RULES.md
│   ├── SKILLS.md
│   └── RFC/
│       ├── RFC-001-*.md
│       ├── RFC-002-*.md
│       └── ...
│
├── src/
│   ├── app/
│   │   ├── navigation/
│   │   ├── providers/
│   │   ├── config/
│   │   └── bootstrap/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── feed/
│   │   ├── detection/
│   │   ├── history/
│   │   ├── reports/
│   │   ├── quiz/
│   │   ├── gamification/
│   │   ├── profile/
│   │   ├── notifications/
│   │   └── protection/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── theme/
│   │   ├── constants/
│   │   ├── utils/
│   │   └── validation/
│   │
│   ├── services/
│   │   ├── api/
│   │   ├── storage/
│   │   └── analytics/
│   │
│   └── native/
│       └── accessibility/
│
├── android/
├── ios/
└── package.json
```

The exact structure may evolve through RFCs. Folder names must still communicate responsibility clearly.

---

# 5. Feature Architecture

## 5.1 Feature Isolation

Every major product area should be represented as an isolated feature.

Examples:

```text
auth
onboarding
home
feed
detection
history
reports
quiz
gamification
profile
notifications
protection
```

A feature may own:

- screens;
- feature components;
- hooks;
- API functions;
- state;
- feature utilities;
- feature-specific validation;
- feature-specific transformations.

## 5.2 Feature Independence

Ask:

> “Could this feature be removed without rewriting unrelated features?”

If the answer is no, inspect the dependency boundary.

Avoid tight coupling such as:

```text
feed → quiz internals
quiz → detection screen
profile → feed implementation
```

Prefer:

```text
shared contracts
shared components
shared hooks
server state
well-defined navigation
```

when cross-feature communication is required.

## 5.3 No Giant Screen Files

A screen must not become the place where everything is implemented.

Avoid:

```text
Screen
├── 500 lines of UI
├── API calls
├── validation
├── business rules
├── global state
├── transformations
└── navigation logic
```

Prefer:

```text
Screen
 ↓
Feature Components
 ↓
Hooks / State
 ↓
Feature Services
 ↓
API Client
```

---

# 6. JavaScript Rules

Insightify uses JavaScript.

Do not introduce TypeScript migration work unless a dedicated RFC explicitly approves it.

## 6.1 Code Clarity

Because the codebase is JavaScript:

- use clear object shapes;
- keep function inputs predictable;
- validate external data;
- use JSDoc for non-obvious public APIs when useful;
- avoid ambiguous object structures;
- avoid excessively dynamic code;
- avoid unnecessary metaprogramming.

## 6.2 No Unsafe Dynamic Patterns Without Reason

Avoid:

```js
eval()
new Function()
```

and similarly unsafe dynamic execution.

Do not use dynamic imports or runtime module resolution unless required by the architecture.

## 6.3 Descriptive Naming

Good:

```text
DetectionResultCard
useDetectionHistory
submitScamReport
getRiskLabel
```

Avoid:

```text
Data
Thing
temp
foo
doStuff
x
```

---

# 7. State Management

Insightify uses three levels of state.

## 7.1 Server State — TanStack Query

Use TanStack Query for backend-owned state.

Examples:

- current user/profile;
- detection history;
- feed data;
- report status;
- quiz content;
- quiz attempts/results;
- achievements;
- leaderboard;
- notifications;
- other API resources.

Do not duplicate this data into Zustand without a documented reason.

## 7.2 Client/App State — Zustand

Use Zustand for genuinely client-owned state.

Examples may include:

- UI preferences;
- local protection preferences;
- temporary shared UI state;
- selected local modes;
- app-level preferences.

Stores must stay focused.

Do not create one enormous global store.

Bad:

```text
useAppStore
└── users
└── feed
└── scans
└── reports
└── quiz
└── leaderboard
└── notifications
└── every UI flag
```

Prefer small, clearly owned stores.

## 7.3 Local React State

Use `useState` when state is:

- local to one component;
- temporary;
- not needed elsewhere;
- not server state.

Do not globalize local state without reason.

---

# 8. Redux Rule

Redux is not part of the default Insightify state-management architecture.

The default model is:

```text
Server State → TanStack Query
Client State → Zustand
Local State  → React
```

Do not introduce Redux for a single feature to solve a problem that belongs in TanStack Query or Zustand.

A future migration or adoption of Redux requires an RFC with a concrete architectural justification.

---

# 9. API Layer Rules

## 9.1 Central API Client

All HTTP requests must go through one central API client.

The client should own cross-cutting concerns such as:

- base URL;
- default headers;
- serialization;
- authentication/session attachment;
- timeout behavior;
- response parsing;
- common error normalization;
- retry rules where appropriate;
- session expiration handling.

## 9.2 Feature API Modules

Feature API functions should describe backend resources.

Example:

```text
services/api/
├── client.js
├── authApi.js
├── detectionApi.js
├── historyApi.js
├── feedApi.js
├── reportsApi.js
├── quizApi.js
├── profileApi.js
└── leaderboardApi.js
```

Do not place raw HTTP calls inside arbitrary UI components.

## 9.3 API Contract Verification

Before integrating an endpoint:

1. inspect the backend API documentation or OpenAPI contract;
2. verify the endpoint;
3. verify request fields;
4. verify response fields;
5. verify authentication requirements;
6. verify error behavior.

If the API does not exist, do not pretend it does.

## 9.4 No Frontend-Invented Business Rules

Do not implement backend business logic inside the mobile app.

Examples:

- final XP calculations;
- moderation decisions;
- threat authority decisions;
- permission enforcement;
- backend ownership rules;
- server-side risk scoring.

The frontend displays backend results and performs UX validation.

---

# 10. Frontend Validation

Frontend validation is mandatory for user-facing input.

Validate before sending API requests:

- required fields;
- text length;
- email format;
- password requirements defined by the API contract;
- confirm-password matching;
- URL formatting;
- file size;
- file type;
- media constraints;
- report form fields;
- quiz input where applicable.

## 10.1 Validation Boundary

Frontend validation is for:

- user experience;
- immediate feedback;
- reducing avoidable requests.

It is not a security authority.

Never claim client validation replaces backend validation.

## 10.2 Validation UX

Validation errors must:

- identify the field;
- explain the problem;
- be easy to understand;
- preserve user-entered data where possible;
- disappear or update when the problem is corrected.

Avoid generic:

```text
Invalid input
```

when a specific message is possible.

---

# 11. Authentication Rules

Authentication is provided by the external backend.

Insightify must not contain Firebase authentication architecture.

## 11.1 Client Responsibilities

The app handles:

- login UI;
- registration UI;
- forgot-password UI;
- password-reset UI where supported;
- authentication API requests;
- session persistence according to backend requirements;
- logout;
- session restoration;
- expired-session handling.

## 11.2 Secure Session Storage

Authentication material must be stored using an appropriate secure native storage mechanism.

Do not store sensitive authentication credentials in ordinary unprotected storage when a secure mechanism is available.

Never log:

- passwords;
- access tokens;
- refresh tokens;
- session secrets.

## 11.3 Authorization

UI-level role checks are presentation behavior only.

The frontend must never be treated as the final authorization boundary.

---

# 12. Theme Architecture

Insightify supports exactly two visual modes:

- **Light Mode**
- **Dark Mode**

They are two representations of the same product.

Every shared component must work in both modes.

This follows the strongest principle from the supplied mobile rules reference: one unified design system must apply across the entire application rather than maintaining separate feature-specific themes. fileciteturn3file1L5-L19

## 12.1 Central Theme Tokens

All visual tokens must be defined centrally.

Recommended:

```text
src/shared/theme/
├── colors.js
├── typography.js
├── spacing.js
├── radii.js
├── shadows.js
├── gradients.js
└── index.js
```

Components must consume semantic theme tokens rather than raw hex codes.

## 12.2 No Hardcoded Colors

Do not write:

```js
backgroundColor: '#245BFF'
```

inside individual components.

Instead:

```js
backgroundColor: theme.colors.primary
```

Use centralized tokens.

---

# 13. Insightify Fixed Color System

The following palette is the canonical product palette unless an RFC changes it.

## 13.1 Brand Colors

| Token | Value | Purpose |
|---|---|---|
| `primary` | `#245BFF` | Main brand/action blue |
| `primaryDark` | `#1748D1` | Darker blue for emphasis/pressed states |
| `deepNavy` | `#071A49` | Brand text and deep security surfaces |
| `teal` | `#12B8B0` | Security/intelligence accent |
| `tealDark` | `#0A8F8A` | Dark teal emphasis |
| `lightBlue` | `#EAF4FF` | Soft blue surfaces/highlights |
| `softPurple` | `#F2EEFF` | AI/supporting accent surface |
| `purple` | `#8B3DFF` | Secondary brand accent |

## 13.2 Primary CTA Gradient

All primary CTA buttons use the canonical blue-purple gradient:

```text
#245BFF → #A63DFF
```

Direction:

**left → right**

The gradient is an accent, not a page background.

## 13.3 Semantic Colors

| Token | Value | Meaning |
|---|---|---|
| `success` | `#20B86B` | Safe/success |
| `successSoft` | `#E9F9F1` | Success background |
| `warning` | `#F59E0B` | Medium/caution |
| `warningSoft` | `#FFF7E6` | Warning background |
| `danger` | `#EF4444` | High-risk/error |
| `dangerSoft` | `#FFF0F1` | Danger background |
| `info` | `#3B82F6` | Informational state |
| `infoSoft` | `#EDF5FF` | Informational background |

Semantic colors must not be replaced by the brand gradient.

---

# 14. Light Mode Colors

These values are fixed unless changed through an approved RFC.

| Token | Value | Usage |
|---|---|---|
| `background` | `#F8FAFF` | Main screen background |
| `surface` | `#FFFFFF` | Cards, sheets, inputs, elevated surfaces |
| `surfaceSecondary` | `#F1F5FB` | Nested surfaces |
| `surfaceTertiary` | `#EAF4FF` | Soft highlighted surfaces |
| `textPrimary` | `#071A49` | Main headings and body text |
| `textSecondary` | `#5B6B84` | Supporting text |
| `textTertiary` | `#8793A7` | Captions and placeholders |
| `textOnBrand` | `#FFFFFF` | Text over primary brand backgrounds |
| `border` | `#DDE6F2` | Inputs, dividers, subtle borders |
| `divider` | `#E7EDF5` | Content separation |
| `overlay` | `rgba(7, 26, 73, 0.45)` | Modal/backdrop overlay |

Light Mode should visually read as:

> **bright, calm, clean, trustworthy**

Do not use pure white for every surface when a subtle hierarchy is useful.

---

# 15. Dark Mode Colors

These values are fixed unless changed through an approved RFC.

| Token | Value | Usage |
|---|---|---|
| `background` | `#061329` | Main screen background |
| `surface` | `#0D1D36` | Cards and primary surfaces |
| `surfaceSecondary` | `#122743` | Nested/elevated surfaces |
| `surfaceTertiary` | `#173253` | Stronger highlighted surfaces |
| `textPrimary` | `#F5F9FF` | Main headings and body text |
| `textSecondary` | `#B8C7DB` | Supporting text |
| `textTertiary` | `#7F90A7` | Captions and placeholders |
| `textOnBrand` | `#FFFFFF` | Text over brand backgrounds |
| `border` | `#213652` | Inputs and separators |
| `divider` | `#1A2D47` | Content separation |
| `overlay` | `rgba(0, 0, 0, 0.60)` | Modal/backdrop overlay |

Dark Mode must feel:

> **deep, premium, secure, calm**

Do not use pure black as the default page background.

---

# 16. Theme Usage Rules

- The same semantic tokens must be used across both themes.
- Do not create a separate auth theme.
- Do not create a separate quiz theme.
- Do not create a separate feed theme.
- Do not create a separate detection theme.
- Do not hardcode different colors inside feature components.
- Test every reusable component in both modes.
- Never rely on color alone to communicate meaning.
- Foreground and background colors must maintain readable contrast.
- Dark surfaces must use light text/icons.
- Light surfaces must use sufficiently dark text/icons.

The supplied reference mobile rules explicitly emphasize unified themes, centralized colors, semantic tokens, and defining all component states for both modes. fileciteturn3file1L93-L141

---

# 17. Typography Rules

Preferred product font:

**Inter**

Use the same font family consistently unless platform limitations require a documented alternative.

## 17.1 Type Scale

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| `display` | 34 | 700 | Splash/hero titles |
| `h1` | 28 | 700 | Major screen titles |
| `h2` | 22 | 700 | Section titles |
| `h3` | 18 | 600 | Card/section headings |
| `bodyLarge` | 16 | 400/500 | Primary body |
| `body` | 15 | 400 | Standard body |
| `bodySmall` | 13 | 400/500 | Supporting text |
| `label` | 12 | 600 | Tags/status/meta |
| `caption` | 11 | 500 | Tiny supporting information |
| `button` | 15 | 600 | CTA text |

Do not make every heading bold.

Visual hierarchy must come from:

- size;
- weight;
- spacing;
- contrast;
- placement.

---

# 18. Spacing System

Use a consistent 4-point-based spacing system.

Preferred values:

```text
4
8
12
16
20
24
32
40
48
56
64
```

Avoid arbitrary spacing values unless a precise visual requirement justifies them.

## 18.1 Standard Screen Padding

Default horizontal screen padding:

**20–24 px**

Adjust only when the screen layout requires it.

## 18.2 Vertical Rhythm

Use consistent spacing between:

- heading and subtitle;
- form fields;
- sections;
- cards;
- actions.

Do not create screens by visually guessing every margin independently.

---

# 19. Radius System

Preferred:

| Token | Value |
|---|---:|
| `small` | 8 |
| `medium` | 12 |
| `large` | 16 |
| `xlarge` | 20 |
| `card` | 18 |
| `pill` | 999 |

Avoid excessive variation.

A screen should not simultaneously use 9, 11, 13, 17, 19, and 23 px radii without a documented reason.

---

# 20. Shadow & Elevation

Shadows must be subtle.

Do not make every component look floating.

Use elevation primarily for:

- modal surfaces;
- floating actions;
- important elevated cards;
- central navigation actions.

Prefer:

- subtle shadow;
- surface contrast;
- border;
- spacing

over heavy drop shadows.

---

# 21. Gradient Rules

The official CTA gradient is:

```text
#245BFF → #A63DFF
```

Use it for:

- primary CTA buttons;
- selected/highlighted states where appropriate;
- key progress/highlight elements;
- branded action surfaces.

Do not use it for:

- entire screens;
- every card;
- every icon background;
- body text;
- semantic success/warning/error states.

Do not invent a new gradient for an individual feature without RFC approval.

---

# 22. Button Rules

## 22.1 Primary Button

Default:

- height: 50–56 px;
- radius: 14–16 px;
- background: canonical blue-purple gradient;
- text: white;
- weight: 600;
- clear pressed state;
- clear loading state;
- disabled state with reduced emphasis.

## 22.2 Secondary Button

Use:

- surface background;
- theme border;
- primary or primary-text color;
- consistent radius;
- clear pressed state.

## 22.3 Destructive Button

Use semantic danger color only when an action is genuinely destructive.

Do not use red merely because the action is important.

## 22.4 Text Button

Use for low-emphasis navigation:

- Back;
- Cancel;
- View all;
- Skip;
- secondary links.

## 22.5 Button States

Every reusable button must support:

```text
default
pressed
disabled
loading
```

where applicable.

The supplied mobile reference also treats loading/disabled states as required component behavior. fileciteturn3file1L177-L205

---

# 23. Input Rules

Default input:

- height: 52–56 px;
- radius: 12–14 px;
- background: theme surface;
- border: theme border;
- horizontal padding: 14–16 px;
- placeholder: text tertiary;
- entered text: text primary.

States:

```text
default
focused
filled
error
disabled
success
```

Do not rely on border color alone for errors.

Use:

- error icon where useful;
- error message;
- clear visual state.

---

# 24. Card Rules

Cards should group related information.

Do not turn every UI element into a card.

Avoid:

> **card soup**

Use cards when they provide meaningful grouping.

For simple rows, prefer:

- spacing;
- dividers;
- surface separation;
- typography hierarchy.

The supplied mobile rules specifically recommend avoiding excessive card nesting and preserving hierarchy without unnecessary containers. fileciteturn3file1L315-L331

---

# 25. Navigation Rules

The authenticated application uses a stable primary navigation structure defined by the product design.

Current intended product sections include:

- Home;
- Feed;
- Detect;
- Learn/Quiz;
- Profile.

The exact route structure must be implemented centrally in the navigation layer.

Do not create independent navigation logic inside feature screens.

## 25.1 Navigation Responsibilities

Navigation owns:

- route definitions;
- stack/tab presentation;
- auth gating;
- deep-link entry where applicable;
- route parameters;
- reset behavior;
- back behavior.

Screens should not duplicate route registration logic.

## 25.2 Back Navigation

Normal back navigation should use platform-appropriate navigation behavior.

Do not add arbitrary timeout-based navigation fixes.

If a navigation race exists, identify the lifecycle cause.

---

# 26. Home Screen Rules

Home is the user's safety overview.

The screen should prioritize:

1. current protection status;
2. meaningful security summary;
3. quick scan access;
4. recent detection activity;
5. useful threat/community information;
6. learning opportunity.

Avoid turning Home into a generic dashboard filled with statistics.

Important content should answer:

> **“Am I safe, and what should I do next?”**

---

# 27. Feed Rules

The Feed is a **threat-intelligence experience**, not a generic social network.

Feed should prioritize:

- threat severity;
- title;
- concise explanation;
- affected platform/source;
- report/community signal;
- time;
- relevant media;
- safe action.

Feed items should remain scan-friendly.

## 27.1 Feed Detail

Clicking an alert/news item should open a dedicated detail screen.

If the alert contains an image/media asset:

- display it in the detail experience;
- preserve aspect ratio;
- provide appropriate loading/failure states;
- keep the threat explanation readable around the media.

## 27.2 Feed Risk States

At minimum support:

```text
Low Risk
Medium Risk
High Risk
Critical
```

Risk state must be expressed with:

- semantic color;
- explicit text;
- iconography.

Never use color alone.

---

# 28. Detection Rules

Detection is one of the primary product experiences.

Supported conceptual input types include:

- text;
- link/URL;
- email;
- image/screenshot;
- audio;
- video;
- supported files/media.

## 28.1 Detection Screen

The screen should make it immediately clear:

> **What do you want to analyze?**

Provide simple, discoverable input choices.

Avoid overwhelming users with technical terminology.

## 28.2 Detection Submission

Before submission:

- validate input;
- check file constraints;
- show clear progress for expensive operations;
- prevent accidental duplicate submissions where appropriate.

## 28.3 Detection Result

A detection result should explain:

```text
Risk
Category
Confidence
Why it was flagged
Detected indicators
What not to do
What to do next
```

Never reduce the experience to only:

```text
87% Scam
```

The goal is informed action.

---

# 29. Detection Risk Colors

Use semantic risk colors consistently.

## Safe / Low Risk

Primary semantic:

`#20B86B`

Soft background:

`#E9F9F1`

## Medium Risk

Primary semantic:

`#F59E0B`

Soft background:

`#FFF7E6`

## High Risk

Primary semantic:

`#EF4444`

Soft background:

`#FFF0F1`

## Critical

Use a stronger danger treatment based on the same danger family.

Do not introduce a new arbitrary red for every screen.

---

# 30. Detection History Rules

History represents server-owned detection records.

Use TanStack Query.

Support:

- loading state;
- empty state;
- error state;
- pagination/infinite loading where supported;
- filters;
- refresh;
- detail navigation.

History items should expose enough information to distinguish:

- what was checked;
- when;
- risk;
- input type.

Do not store or display more sensitive content than necessary.

---

# 31. Reports Rules

Reporting allows users to submit potential scams.

The frontend owns:

- report UI;
- input validation;
- evidence selection;
- request submission;
- submission state;
- result messaging.

The backend owns:

- persistence;
- moderation state;
- final acceptance;
- admin review;
- public publication decision.

## 31.1 Report Status

The frontend should correctly represent statuses supplied by the backend, such as:

```text
Pending
Under Review
Approved
Rejected
```

Do not derive moderation status locally.

## 31.2 Report UX

A report form should explain:

> **Your report can help protect other users.**

Avoid intimidating legalistic language.

---

# 32. Quiz Rules

The quiz experience is a learning product, not merely a points screen.

Quiz UI should support:

- categories;
- daily challenges;
- questions;
- answer selection;
- answer state;
- explanation;
- progress;
- results;
- XP feedback;
- repeat learning.

## 32.1 Scenario-Based Learning

Where supported by the RFC, use realistic scam scenarios rather than only abstract multiple-choice questions.

## 32.2 Result Explanation

After an answer, explain:

- whether the choice was correct;
- the red flags;
- why the correct choice is safer.

---

# 33. Gamification Rules

Gamification exists to encourage healthy security-learning behavior.

Include:

- XP;
- levels;
- streaks;
- achievements;
- badges;
- leaderboard experiences.

Do not make gamification visually overpower:

- safety;
- detection;
- learning;
- clarity.

## 33.1 XP Authority

The backend is authoritative for server-owned XP.

Do not calculate authoritative XP totals solely on the client.

The client displays backend results and may provide immediate optimistic feedback only where the API contract supports it.

---

# 34. Profile Rules

Profile should communicate the user's safety journey.

Possible server-owned information:

- scans;
- threats found/prevented;
- quizzes completed;
- reports;
- XP;
- level;
- achievements;
- rank.

Avoid presenting unsupported claims as factual security metrics.

A metric must come from:

- a documented backend field;
- or a clearly defined local product metric.

---

# 35. Notifications Rules

Notification UI must support:

```text
unread
read
empty
loading
error
```

Do not claim real-time protection is active unless the actual protection state is known.

Permission prompts should:

- explain why permission is useful;
- avoid misleading urgency;
- respect user choice.

---

# 36. Accessibility / Protection Rules

Accessibility-based protection is a native Android capability.

It must remain isolated from normal React screens.

Recommended boundary:

```text
React Native
      ↓
Native Bridge
      ↓
Android Accessibility Service
      ↓
Protection / Pre-filter
      ↓
Backend API when permitted by product design
```

Do not implement native accessibility behavior as ordinary screen code.

Because accessibility can expose highly sensitive on-screen content, privacy and permission behavior require RFC-level design.

---

# 37. Privacy Rules

Insightify may handle:

- messages;
- emails;
- screenshots;
- voice;
- video;
- links;
- potentially sensitive identifiers.

Therefore:

- do not log raw user-submitted content by default;
- do not log passwords;
- do not log tokens;
- do not log unnecessary PII;
- do not store sensitive media locally longer than required;
- do not send data to undocumented external services;
- follow backend/API privacy contracts.

If redaction/sanitization is defined by the backend contract, the frontend must comply.

---

# 38. Image Rules

Remote images must:

- preserve aspect ratio;
- show loading state where appropriate;
- show failure/fallback state;
- avoid layout jumps where practical;
- be rendered at sensible dimensions.

Do not:

- embed large base64 images in source;
- stretch images arbitrarily;
- download remote media manually without a real requirement;
- expose broken image states as empty whitespace.

For profile images, provide an intentional fallback.

For feed media, maintain consistent aspect ratios according to the design system.

---

# 39. Performance Rules

## 39.1 Lists

Use `FlatList` or an approved virtualized list solution for dynamic/large lists.

Do not render an unbounded feed/history/leaderboard using a large `ScrollView`.

## 39.2 Rendering

Avoid unnecessary re-renders.

Use memoization where it solves a measured or clearly identified problem.

Do not add `React.memo`, `useMemo`, or `useCallback` everywhere without reason.

## 39.3 Images

Optimize:

- dimensions;
- loading;
- caching where supported;
- number of simultaneous large assets.

## 39.4 API Data

Use TanStack Query caching rather than custom ad-hoc caches unless a specific requirement justifies one.

## 39.5 Heavy Work

Do not perform expensive processing synchronously during render.

---

# 40. Loading States

Every asynchronous feature must define a loading experience.

Possible patterns:

- skeleton;
- spinner;
- progress indicator;
- disabled action;
- staged progress for long analysis.

Do not show a blank screen during normal loading.

Buttons that trigger requests should prevent accidental repeated submissions while the request is in progress.

---

# 41. Empty States

Every list/grid/resource-driven screen must have a meaningful empty state.

Examples:

```text
No scan history yet
No saved alerts yet
No notifications yet
No reports submitted yet
No leaderboard data available
```

An empty state should explain:

1. what is empty;
2. why the user might care;
3. what action can be taken next, when applicable.

---

# 42. Error States

All API-driven features must handle failure.

Error UI should:

- be understandable;
- avoid technical stack traces;
- preserve recoverable input;
- provide retry where appropriate;
- avoid blaming the user.

Never silently swallow an error.

The supplied mobile reference explicitly requires graceful error handling and preserving user-entered data when recoverable. fileciteturn3file1L391-L401

---

# 43. Accessibility / Inclusive UX

All interactive controls should have an adequate touch target.

Target:

**minimum approximately 44 × 44 px**

Interactive elements should have meaningful accessibility labels when an icon alone does not communicate the action.

Do not communicate state using color alone.

Examples:

Bad:

```text
red = dangerous
green = safe
```

Better:

```text
HIGH RISK + danger icon + red
SAFE + check icon + green
```

Respect supported system font settings.

Do not design layouts that collapse when text becomes larger.

---

# 44. Motion Rules

Motion should reinforce understanding.

Use animation for:

- screen transitions;
- successful actions;
- scan progress;
- subtle threat-state changes;
- interactive feedback.

Avoid:

- constant animation;
- distracting glowing effects;
- unnecessary bounce;
- excessive parallax;
- animations that slow critical actions.

Security-related states should remain readable even when animation is disabled or interrupted.

---

# 45. Illustration Rules

Insightify illustrations should share one visual family.

Primary illustration language:

- teal;
- blue;
- light blue;
- subtle purple;
- soft glow;
- clean 3D/vector hybrid appearance.

Do not mix unrelated illustration styles within the same flow.

Do not randomly change the illustration style on one authentication/onboarding screen.

---

# 46. Iconography Rules

Use one coherent icon family.

Icons should:

- have consistent stroke/shape language;
- use semantic colors;
- remain readable at small sizes;
- include accessible labels where needed.

Avoid mixing:

- filled icons;
- thin outlined icons;
- unrelated icon libraries;

without a design-system decision.

---

# 47. Component Architecture

## 47.1 Shared Components

Place reusable design-system primitives in:

```text
src/shared/components/
```

Examples:

```text
Button
TextInput
PasswordInput
Card
Badge
Modal
Sheet
Avatar
Loader
Skeleton
EmptyState
ErrorState
StatusPill
SectionHeader
```

## 47.2 Feature Components

Place feature-specific components under their feature:

```text
src/features/detection/components/
src/features/feed/components/
src/features/quiz/components/
```

## 47.3 Reuse Rule

If two unrelated features require the same stable UI pattern, extract it to shared components.

Do not copy-paste.

But do not create abstractions for a pattern that only exists once and has no meaningful reuse.

---

# 48. Hook Rules

Hooks should encapsulate meaningful behavior.

Examples:

```text
useAuth
useDetection
useDetectionHistory
useFeed
useQuiz
useProfile
useLeaderboard
```

Avoid hooks that only rename one line of code without providing real abstraction.

Hooks should:

- have focused responsibilities;
- handle cleanup;
- avoid hidden global side effects;
- expose predictable inputs/outputs.

---

# 49. Utility Rules

Utilities should remain small and technical.

Good examples:

- formatting;
- parsing;
- normalization;
- pure calculations;
- display helpers.

Do not turn `utils/` into a dumping ground for business logic.

Business logic belongs to the appropriate feature/service boundary.

---

# 50. Side-Effect Rules

Side effects include:

- API calls;
- subscriptions;
- timers;
- listeners;
- native events;
- analytics;
- storage writes.

Keep side effects explicit.

Clean up:

- timers;
- listeners;
- subscriptions;
- native callbacks;

when their owning component/lifecycle ends.

The supplied mobile reference explicitly calls for cleanup of timers, subscriptions, listeners, and async side effects. fileciteturn3file1L299-L315

---

# 51. Data Transformation Rules

Transform backend data at a clear boundary.

Do not scatter:

```js
response.data.data.data
```

and ad-hoc mapping throughout screen render code.

Prefer:

```text
API response
   ↓
Feature transformation
   ↓
UI model
   ↓
Component
```

Keep transformations predictable.

---

# 52. Server State Cache Rules

TanStack Query should be used consistently.

Do not manually maintain:

```text
isLoading
isFetching
data
error
lastFetched
```

inside a global Zustand store for the same server resource unless there is an architectural reason.

Use:

- query keys;
- mutation handling;
- invalidation;
- stale configuration;
- pagination/infinite query patterns;

according to the resource behavior.

---

# 53. Forms

Use local state for simple forms.

For complex forms, an approved form library may be used when justified.

Forms must:

- validate inputs;
- preserve user data during recoverable errors;
- show field-level errors;
- disable duplicate submissions;
- clearly indicate loading;
- avoid clearing fields unnecessarily on failed requests.

---

# 54. Security-Sensitive UI

Security warnings must be accurate and understandable.

Never exaggerate:

```text
Your phone is hacked!
```

unless the backend/product logic actually supports that claim.

Prefer:

```text
High risk detected
This content contains several scam indicators.
```

The app should avoid presenting probabilistic AI results as absolute certainty.

---

# 55. Risk Communication

A high-risk result should make three things obvious:

```text
What happened?
Why is it risky?
What should I do now?
```

Example structure:

```text
HIGH RISK

Threat detected.

Why we flagged this:
• Urgency
• Impersonation
• Suspicious link
• Sensitive-information request

What you should do:
• Do not click
• Do not share OTP
• Verify through an official channel
```

Do not bury recommended actions under unnecessary metadata.

---

# 56. Feed Moderation Presentation

The frontend may display moderation states supplied by the backend.

Do not independently decide that a community report is verified.

Use backend-provided states such as:

```text
pending
under_review
approved
rejected
verified
```

only when they are actually defined by the API contract.

---

# 57. Content Safety

User-generated content must be rendered safely.

Never inject arbitrary HTML into native UI.

Treat remote text as untrusted data.

Media URLs must be handled through approved rendering components.

---

# 58. Environment Configuration

Environment-specific configuration must not be hardcoded throughout the source.

Centralize values such as:

- API base URL;
- environment flags;
- feature flags where supported.

Do not hardcode production endpoints in multiple files.

Do not commit secrets.

The external backend remains responsible for secrets that belong server-side.

---

# 59. Logging Rules

Production logs must be intentional.

Never log:

- passwords;
- authentication tokens;
- private message contents;
- complete screenshots;
- raw voice/video content;
- unnecessary PII.

During debugging:

- log only what is necessary;
- redact sensitive values;
- remove temporary debug logging before completion.

Do not leave `console.log()` spam in production code.

---

# 60. Dependency Rules

Do not add a dependency without a real reason.

Before adding a package:

1. check existing project capabilities;
2. check React Native CLI compatibility;
3. check native Android/iOS implications;
4. check maintenance quality;
5. consider bundle size;
6. consider whether the dependency creates architectural coupling.

Do not use a new library simply because it offers a shorter implementation.

A significant architectural dependency should be documented through an RFC when appropriate.

---

# 61. Native Module Rules

Native Android/iOS code must be isolated from normal UI code.

Native integrations should have:

- a clear bridge boundary;
- predictable APIs;
- lifecycle cleanup;
- permission handling;
- platform checks where required.

Do not spread platform-specific conditions throughout unrelated components.

---

# 62. Accessibility Service Safety

The Android accessibility service must be treated as a privileged and privacy-sensitive subsystem.

Do not:

- silently collect content without approved behavior;
- forward every observed screen to the backend;
- expose captured content in logs;
- bypass platform permission mechanisms;
- implement the service without RFC-defined privacy boundaries.

Any change to the accessibility architecture requires review of its privacy and platform implications.

---

# 63. Testing Rules

Every feature change must be validated at the appropriate level.

Validation should cover:

- happy path;
- invalid input;
- API failure;
- empty state;
- loading state;
- retry behavior;
- navigation;
- Light Mode;
- Dark Mode;
- small/large supported screens where practical.

## 63.1 UI Validation

For UI changes, verify:

- spacing;
- typography;
- colors;
- contrast;
- focus/pressed states;
- error states;
- loading states;
- disabled states;
- image loading/failure;
- navigation behavior.

The reference mobile rules similarly require theme-state testing, interaction-state testing, and device-size checks. fileciteturn3file1L525-L559

## 63.2 Regression Rule

Do not mark a task complete if the affected feature is known to be broken.

---

# 64. Linting & Formatting

Use the repository's configured linting and formatting tools.

Do not:

- disable lint rules casually;
- introduce formatting exceptions;
- commit code that fails configured checks.

If a task changes code quality tooling, that should be deliberate and documented.

---

# 65. Git Rules

Keep commits and changes focused.

Avoid combining unrelated changes into a single task.

Do not commit:

- secrets;
- local environment files;
- generated temporary files;
- debug artifacts;
- unnecessary build output.

Before pushing, verify the working tree does not contain accidental changes.

---

# 66. Refactoring Rules

Refactors must preserve behavior unless behavior change is explicitly requested.

Before a refactor:

1. inspect the existing implementation;
2. identify consumers;
3. identify navigation dependencies;
4. identify API dependencies;
5. identify shared component dependencies;
6. refactor;
7. validate affected flows.

Do not delete existing functionality merely because a new architecture is preferred unless the requirement explicitly calls for its removal.

---

# 67. Rename / Move Rules

When moving or renaming files:

- update every import;
- update navigation references;
- update tests;
- update documentation where appropriate;
- ensure no duplicate implementation remains.

Do not leave an old and new implementation both active accidentally.

---

# 68. Feature Flags

Feature flags may be used when genuinely required for controlled rollout.

Keep flags:

- centralized;
- clearly named;
- documented;
- easy to remove when no longer needed.

Do not leave permanent dead feature flags.

---

# 69. Analytics Rules

Analytics must not collect unnecessary sensitive content.

Never send:

- passwords;
- tokens;
- full private messages;
- raw screenshots;
- raw audio/video;
- unnecessary PII.

Analytics events should describe product behavior rather than private user content.

Good:

```text
scan_started
scan_completed
quiz_completed
report_submitted
```

Avoid events containing entire user messages or suspicious content.

---

# 70. Notifications & Permission UX

Permission requests should explain:

- why the permission is needed;
- what value it provides;
- what happens if the user declines.

Do not repeatedly pressure users after denial.

Use platform-native permission behavior.

---

# 71. Offline & Network Failure Behavior

Where network-dependent functionality is unavailable:

- explain the problem;
- preserve user input when possible;
- allow retry;
- avoid presenting stale data as fresh without indication when freshness matters.

Do not invent successful results when an API request fails.

---

# 72. Design Consistency Rules

Every screen must feel like Insightify.

Do not introduce:

- a different button language;
- different corner radii;
- unrelated colors;
- unrelated iconography;
- a different type scale;
- a different illustration style;
- a feature-specific design system.

The design system is global.

---

# 73. Light/Dark Design Completion Rule

A reusable UI change is not complete until both Light Mode and Dark Mode are considered.

At minimum verify:

- background;
- surface;
- text;
- border;
- icon;
- selected state;
- disabled state;
- error;
- success;
- warning;
- loading.

The mobile reference emphasizes that both themes must be defined before a shared component is considered complete. fileciteturn3file1L413-L441

---

# 74. No Hardcoded Theme Tokens

The following are prohibited inside feature components:

```js
'#FFFFFF'
'#071A49'
'#245BFF'
'#A63DFF'
'#12B8B0'
'#EF4444'
```

when the value represents a semantic design token.

Use:

```js
theme.colors.background
theme.colors.surface
theme.colors.primary
theme.colors.gradient
theme.colors.teal
theme.colors.danger
```

instead.

---

# 75. Design Token Change Rules

If a design token changes:

1. update the centralized token;
2. verify affected components;
3. verify Light Mode;
4. verify Dark Mode;
5. verify semantic states;
6. check for duplicate hardcoded values.

Do not create local replacements.

---

# 76. Component State Completeness

Reusable components should account for their realistic states.

Examples:

### Button

```text
default
pressed
disabled
loading
```

### Input

```text
default
focused
filled
error
disabled
success
```

### Card/List item

```text
default
pressed
loading
empty
error
```

### API screen

```text
loading
success
empty
error
refreshing
```

---

# 77. No Fake Production Data

Do not present fabricated data as real backend information.

During development:

- use fixtures only in explicitly defined development/test contexts;
- clearly label demo/mock data where necessary;
- do not accidentally ship development fixtures as production content.

If an API is unavailable, do not silently pretend the request succeeded.

---

# 78. API Error Mapping

Backend errors should be converted into useful frontend states.

Examples:

```text
401 → authentication/session flow
403 → permission/availability message
404 → resource not found
422 → validation feedback
429 → rate-limit guidance
5xx → retry/service-unavailable state
network failure → connectivity guidance
```

The exact mapping must follow the real API contract.

Do not invent backend error codes.

---

# 79. Mutation Rules

For mutations:

- show progress;
- prevent accidental duplicate submissions;
- show success feedback where useful;
- handle failure;
- invalidate/refetch affected server-state queries where necessary.

Do not manually mutate multiple copies of the same server resource across global stores.

Prefer TanStack Query invalidation and server refresh.

---

# 80. Optimistic Updates

Optimistic UI may be used only when:

- the action is reversible or predictable;
- rollback behavior is defined;
- the API semantics are known.

Do not use optimistic updates for high-risk or irreversible actions merely to make the UI feel faster.

---

# 81. Security Copy Rules

Security copy must be:

- concise;
- accurate;
- actionable;
- calm.

Avoid fear-driven messaging unless the risk genuinely warrants urgent warning.

Prefer:

> “High risk detected. Do not open this link.”

over:

> “YOUR DEVICE IS UNDER ATTACK!!!”

---

# 82. Accessibility Copy Rules

Avoid jargon when simpler language communicates the same meaning.

Example:

Avoid:

> “Probabilistic adversarial social-engineering classifier confidence.”

Prefer:

> “We found several signs commonly used in scams.”

Technical details may be provided in an expandable explanation where useful.

---

# 83. Feed Media Rules

When a feed alert contains media:

- media should support the threat story;
- preserve aspect ratio;
- avoid unnecessary autoplay;
- provide accessible descriptions where appropriate;
- provide error/fallback treatment;
- open media in a dedicated viewer when the interaction requires it.

The feed should remain readable even if media fails to load.

---

# 84. Home Data Prioritization

Home should not attempt to display every available metric.

Prioritize:

```text
Protection status
↓
Quick scan
↓
Meaningful recent threats/activity
↓
Learning
```

Statistics are secondary to action.

---

# 85. Detection UI Consistency

The detection flow must maintain consistent:

- input selector;
- text entry;
- upload controls;
- analysis CTA;
- progress;
- result card;
- risk state;
- safety action.

The visual language must remain identical across:

```text
text
link
email
image
audio
video
file
```

Only the necessary input-specific control should change.

---

# 86. Result Screen Consistency

High-risk, medium-risk, low-risk, safe, and error results must use the same structural hierarchy.

The state changes:

- semantic color;
- icon;
- wording;
- recommendation;

but the component architecture remains consistent.

Do not create an entirely new result design for every risk level.

---

# 87. Report Flow Consistency

Report submission should feel connected to detection and feed.

A user should be able to report from:

- a detection result;
- a feed alert;
- a dedicated report entry point;

where supported.

The report UI must use the same theme, form fields, buttons, and status components as the rest of the application.

---

# 88. Quiz & Gamification Consistency

The quiz can be more playful than detection, but must still use:

- the same typography;
- same semantic colors;
- same CTA system;
- same spacing system;
- same design tokens.

Gamification may add:

- badges;
- celebrations;
- XP;
- progress;

without creating a separate visual identity.

---

# 89. Profile Consistency

Profile can emphasize the user's progress but must remain part of Insightify's security product.

Avoid making Profile look like:

- a social network;
- a generic gaming profile;
- a financial dashboard.

The user's security journey remains central.

---

# 90. Admin Boundary

There may be backend/admin functionality in the wider product ecosystem, but the mobile app does not become the admin system unless explicitly defined by an RFC.

The mobile client may display backend moderation results to normal users.

Do not build privileged admin workflows into the normal user experience without approval.

---

# 91. Backend Coordination Rules

The frontend team/agent must coordinate API changes through documented contracts.

When a frontend feature depends on a missing backend endpoint:

1. identify the missing contract;
2. document the dependency;
3. avoid fake production behavior;
4. update/create the relevant RFC;
5. implement the frontend once the API contract is defined.

Do not silently alter backend assumptions.

---

# 92. RFC Rules

A significant change requires an RFC before implementation.

Examples:

- state-management migration;
- authentication architecture change;
- API architecture change;
- accessibility service architecture;
- navigation architecture change;
- new cross-feature data model;
- new analytics architecture;
- privacy architecture;
- major theme-system change.

An RFC should include:

- problem;
- goals;
- non-goals;
- proposal;
- alternatives;
- user flow;
- API contract;
- data requirements;
- privacy/security;
- acceptance criteria.

---

# 93. Documentation Update Rules

Update documentation when:

- architecture changes;
- a permanent engineering rule changes;
- API contract changes materially;
- a new cross-feature convention is established;
- a significant native integration is introduced.

Do not duplicate detailed feature requirements between `RULES.md` and RFCs.

---

# 94. Agent Change Workflow

Before changing code:

1. Read `AGENTS.md`.
2. Read `docs/RULES.md`.
3. Read the relevant RFC.
4. Inspect the current implementation.
5. Inspect the backend/API contract when applicable.
6. Identify affected feature boundaries.
7. Plan the smallest correct change.
8. Implement.
9. Validate.
10. Review for duplication, security, accessibility, theme consistency, and unintended side effects.
11. Report what changed and what was validated.

---

# 95. Code Review Checklist

Before considering a task complete:

### Architecture

- [ ] Correct feature owns the change.
- [ ] API communication uses the central API architecture.
- [ ] No backend code was added.
- [ ] No direct database access was added.
- [ ] No direct AI provider integration was added.
- [ ] No parallel state-management architecture was introduced.

### Code Quality

- [ ] No meaningful duplicated logic.
- [ ] Functions/components remain focused.
- [ ] Naming is clear.
- [ ] No dead code.
- [ ] No temporary debug logging.
- [ ] No unnecessary abstraction.

### State

- [ ] Server state uses TanStack Query where appropriate.
- [ ] Zustand is used only for genuine client state.
- [ ] Local component state is used for local concerns.
- [ ] No duplicated server-state stores were introduced.

### UI

- [ ] Light Mode verified.
- [ ] Dark Mode verified.
- [ ] Theme tokens used instead of hardcoded semantic colors.
- [ ] Buttons have appropriate states.
- [ ] Inputs have appropriate states.
- [ ] Loading state exists.
- [ ] Empty state exists where applicable.
- [ ] Error state exists.
- [ ] Accessibility labels/touch targets considered.

### API

- [ ] Backend contract verified.
- [ ] Request payload matches contract.
- [ ] Response shape matches contract.
- [ ] API errors are handled.
- [ ] Authentication/session behavior is correct.

### Security

- [ ] No secrets committed.
- [ ] No tokens/passwords logged.
- [ ] No unnecessary PII logged or stored.
- [ ] No insecure client-side authorization assumptions.

### Validation

- [ ] Relevant tests/checks run.
- [ ] Navigation verified.
- [ ] Existing functionality remains intact.

---

# 96. Definition of Done

A task is done only when:

1. The requested behavior works.
2. The relevant UI states work.
3. The implementation follows project architecture.
4. Theme behavior works in Light and Dark Mode.
5. No meaningful duplication was introduced.
6. API behavior matches the actual backend contract.
7. Security/privacy implications were considered.
8. Relevant validation was performed.
9. No known critical issue remains in the affected feature.
10. Documentation/RFCs were updated when required.

---

# 97. Explicit Prohibitions

The following are prohibited unless an RFC explicitly changes the rule:

- Firebase authentication architecture;
- Redux as the primary state architecture;
- direct database access;
- direct AI-provider calls;
- backend/business logic inside frontend screens;
- hardcoded semantic theme colors;
- feature-specific theme systems;
- giant monolithic screen components;
- copy-pasted feature implementations;
- arbitrary dependency additions;
- fake production API behavior;
- unverified API contracts;
- secrets in source code;
- sensitive data in logs;
- silent error swallowing;
- arbitrary navigation delays;
- unrelated changes during focused tasks.

---

# 98. Final Engineering Philosophy

Insightify should be built as a serious production mobile application.

The target is not:

> “make it work somehow.”

The target is:

> **“make it understandable, maintainable, testable, secure, consistent, performant, and easy to evolve.”**

The core rules are therefore:

```text
Read Before Changing
        ↓
Understand the Boundary
        ↓
Follow the Existing Architecture
        ↓
Implement the Smallest Correct Change
        ↓
Reuse Meaningfully
        ↓
Avoid Duplication
        ↓
Validate Thoroughly
        ↓
Document Significant Decisions
```

## When in Doubt

When you have any doubt, ambiguity, missing information, uncertainty, or conflicting requirements:

> **Stop and ask the user a clear question before making any changes or taking any implementation decision.**

Do not guess, assume, invent requirements, or proceed based on an uncertain interpretation.

When in doubt:

> **Prefer the clearest solution that preserves the architecture, avoids duplication, respects the API boundary, and remains correct in both Light and Dark Mode.**