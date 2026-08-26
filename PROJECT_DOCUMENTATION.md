# Insightify — Complete Project Architecture, Product & UI Documentation

> **Version:** 1.0.0 (MVP)  
> **Platform:** React Native (Android / iOS)  
> **Backend:** Node.js / Express + Google Gemini AI  
> **Document Purpose:** Comprehensive architectural and functional blueprint for developers, designers, and AI agents collaborating on Insightify.

---

## 1. Executive Summary & Project Overview

**Insightify** is an intelligent, real-time cybersecurity companion mobile application built to protect everyday users from modern social-engineering scams, financial fraud, phishing attacks, deepfake voice impersonation, and digital deception.

Unlike traditional antivirus tools that focus on file signatures and malware executables, **Insightify focuses on human-targeted deception** across communications channels (WhatsApp, Telegram, SMS, Email, Instagram, and Web browsing). It pairs an automated **Multimodal AI Scam Detection Engine** with **Gamified Cyber Awareness Training** and a **Community Threat Intelligence Feed**.

```
                           ┌──────────────────────────────────────────────────────────┐
                           │                     INSIGHTIFY APP                       │
                           └────────────────────────────┬─────────────────────────────┘
                                                        │
         ┌───────────────────────┬──────────────────────┼───────────────────────┬──────────────────────┐
         ▼                       ▼                      ▼                       ▼                      ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  DETECT ENGINE   │   │  QUIZ & GAMES    │   │  COMMUNITY FEED  │   │   REPORT SCAM    │   │ PROFILE & REWARD │
│ Multimodal AI,   │   │ Gamified Cyber   │   │ Real-time Scam   │   │ User Incident    │   │ XP, Badges,      │
│ OCR, Audio, URL, │   │ Training, XP,    │   │ Warnings, Votes, │   │ Submission, AI   │   │ Leaderboard,     │
│ History Audit    │   │ Lifelines        │   │ Search & Alerts  │   │ Classification   │   │ Achievements     │
└──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
         │                       │                      │                       │                      │
         └───────────────────────┴──────────────────────┼───────────────────────┴──────────────────────┘
                                                        │
                                   ┌────────────────────▼────────────────────┐
                                   │       BACKGROUND MONITORING SERVICE     │
                                   │  Android Accessibility API + Overlays   │
                                   │  Instant Heads-Up Threat Interception   │
                                   └─────────────────────────────────────────┘
```

---

## 2. Problem Statement (Why Insightify Exists)

### The Threat Reality
1. **Proliferation of Social Engineering:** Scams have evolved from obvious spam emails to hyper-personalized spear-phishing, spoofed bank SMS messages, fake parcel delivery alerts, crypto giveaways, and AI voice clone scams.
2. **Failure of Traditional Antivirus:** Antivirus programs scan binary files and operating system memory. They cannot protect a user who voluntarily sends money or enters credentials into an authentic-looking fraudulent website or responds to a fake family emergency message.
3. **Lack of In-the-Moment Protection:** When a victim receives a deceptive message on WhatsApp or SMS, there is no automated safety layer validating the text or sender before the user acts on impulse.
4. **Boring & Ineffective Awareness Training:** Conventional cyber training consists of lengthy PDFs and compliance videos. Non-technical users lack an engaging, interactive method to train their instincts against deceptive patterns.

---

## 3. The Solution: What Insightify Delivers

Insightify solves this crisis through a **4-pillar defense framework**:

1. **Active Multimodal AI Scanner:** Users can paste any suspicious text, URL, email body, screenshot/image (processed via OCR), audio voice note, or video file into Insightify for an immediate threat breakdown powered by Google Gemini AI with heuristic fallbacks.
2. **Real-Time On-Device Background Protection:** Utilizing the Android Accessibility Service, Insightify monitors incoming communication text on supported apps (WhatsApp, Telegram, Instagram, SMS). If a scam pattern is identified, a non-intrusive **Heads-Up Alert Overlay** pops up immediately over the screen with a direct shortcut to analyze the threat.
3. **Gamified Cyber Awareness (Learn-by-Playing):** A dynamic Quiz and Gamification engine allows users to practice spotting real scam scenarios across categories like Phishing, Voice Clones, Crypto Frauds, and Identity Theft. Users earn XP points, level up, use lifelines (50/50, Audience Poll, Time Bonus, Skip), and climb global leaderboards.
4. **Crowdsourced Scam Intelligence & Reporting:** A community feed where verified scam alerts are published, upvoted, and analyzed. Users can report new scams directly with metadata (source, category, severity), protecting other citizens across the network.

---

## 4. Comprehensive Feature & Module Breakdown

### 4.1. Navigation Architecture (`TabNavigator.jsx`, `CustomTabBar.jsx`)
Insightify uses a custom-built **Floating Glass Pill Tab Bar** featuring:
- **Floating Elevated Pill Container:** Elevated above the screen bottom (`borderRadius: 28`, soft ambient shadow `elevation: 20`).
- **Elevated Hero Center Action Button ("Detect"):** The central **Detect** tab is styled as an elevated circular button (`56x56` gradient `#0056D2 → #0284C7`) with an animated **pulse glow ring** when active.
- **Vector Ionicons & Active Indicators:** Crisp vector icons (`home`, `game-controller`, `shield-checkmark`, `megaphone`, `person`) paired with animated spring transitions and active indicator dots.

```
       ┌──────────────────────────────────────────────────────────┐
       │   📰        🎮         🛡️ (Raised)        📢        👤    │
       │  Feed      Quiz          Detect         Report   Profile │
       │   ·                         ·                            │
       └──────────────────────────────────────────────────────────┘
```

---

### 4.2. Detect Module (`src/screens/Detect/`)
* **`DetectScreen.jsx`**:
  - **Hero Banner:** Gradient card with icon, title, and summary description.
  - **Real-Time Protection Status Banner:** Prompts users to enable Android accessibility service.
  - **Quick Scan Chips:** 5 interactive buttons for instant input modes:
    - 📝 **Text:** Direct focus to multiline input.
    - 📧 **Email:** Document picker for `.txt` or `.pdf` email files.
    - 🖼️ **Image:** Native photo library picker for screenshots and poster scans.
    - 🎥 **Video:** Video gallery picker for deepfake video analysis.
    - 🎙️ **Audio:** Audio file picker for voice clone inspection.
  - **Central Multi-Line Input Box:** Large, prominent card-style text area (`minHeight: 140px`) with dynamic character counter and one-tap clear button.
  - **Media Preview Card:** Displays selected photo/media thumbnail or document icon with removal action before running analysis.
  - **Analyze Now Button:** Full-width `#0056D2` blue gradient trigger that sends payloads to the AI detection API.
- **`ResultScreen.jsx`**:
  - Displays risk severity score (0–100%), Threat Category, Safety Status (`Safe`, `Suspicious`, `High Risk`), Detailed AI Reasoning, and Step-by-Step Security Actions.
- **`DetectionHistoryScreen.jsx`**:
  - Top navigation bar with Back and Clear History actions.
  - Hero audit banner and 3 color-coded summary cards (**Total Scans**, **Suspicious ⚠️**, **Safe ✅**).
  - Filter chips (**All**, **⚠️ Suspicious**, **✅ Safe**, **🔖 Saved**).
  - List cards with risk percentage badges, channel icon, timestamp, threat classification, and interactive bookmark toggle.
  - **Detailed Analysis Bottom Modal:** Full message inspection with mitigation steps.

---

### 4.3. Games & Cyber Quiz Module (`src/screens/Games/`)
* **`QuizHomeScreen.jsx`**:
  - **Profile Ribbon:** Displays user avatar, Level Badge, and glowing orange XP pill.
  - **Daily Challenge Banner:** Blue gradient card highlighting daily challenge progress (e.g. `3/5 Completed`).
  - **Category Cards Grid:** 5 distinct cybersecurity categories:
    1. *Phishing Links* (Email & SMS spoofing)
    2. *Crypto Frauds* (Fake giveaways, wallet drainers)
    3. *AI Voice Clones* (Impersonation, fake emergency calls)
    4. *Identity Theft* (Credential harvesting, fake KYC)
    5. *Fake Shopping* (Counterfeit stores, payment escrow fraud)
  - **Featured Game Modes:** Timed Speedrun, Boss Challenge, Daily Streak.
- **`QuizPlayScreen.jsx`**:
  - Real-time countdown timer with progress ring.
  - Interactive Lifelines:
    - 🎯 **50:50:** Eliminates two wrong answers.
    - 📊 **Audience Poll:** Displays percentage breakdown of community guesses.
    - ⏳ **+15s:** Adds extra time to the clock.
    - ⏭️ **Skip:** Passes the question without score penalty.
  - Visual Option Feedback: Smooth green `#059669` highlight for correct choices, red `#DC2626` for mistakes, accompanied by instant educational explanations.
- **`QuizResultScreen.jsx`**:
  - Hero Blue Gradient Trophy Card with circular Accuracy Score Medallion and Grade rating (`S`, `A`, `B`, `C`).
  - Stats Breakdown Cards (Correct, Wrong, XP Earned).
  - Action buttons to Replay Quiz or Explore New Categories.
- **`RewardsScreen.jsx`**:
  - Redemption store for awareness badges, app themes, and security champion ranks.

---

### 4.4. Community Threat Feed Module (`src/screens/Feed/`)
* **`FeedScreen.jsx` & `FeedCard.jsx`**:
  - **Community Alert Cards:** Real scam incidents reported by users or ingested via threat feeds.
  - **Threat Metadata:** Scam category tags (Phishing, Job Scam, Banking, Romance Scam), platform origin tags (SMS, WhatsApp, Instagram, Telegram), timestamp, and risk severity indicator.
  - **Engagement Features:** Live upvoting / downvoting for verification, bookmarking, and native share.
  - **Live Search & Category Filtering:** Instant text search across post titles and bodies, plus quick category pills.
  - *(Note: Post submission is intentionally restricted to the dedicated Report module to maintain verification quality).*

---

### 4.5. Report Scam Module (`src/screens/Report/`)
* **`ReportHomeScreen.js`**:
  - Educational introduction on how community reports protect others.
  - Overview of recent user submissions and report status tracking.
- **`ReportFormScreen.js`**:
  - Structured multi-attribute reporting form:
    - **Scam Source:** SMS, Call, Email, WhatsApp, Social Media, Website.
    - **Category:** Phishing, Financial Fraud, Job Scam, Impersonation, Crypto, Other.
    - **Severity Level:** Low, Medium, High, Critical.
    - **Message / Evidence Input:** Multi-line text field for suspicious copy, phone numbers, or links.
- **`ReportSuccessScreen.js`**:
  - AI confidence assessment summary, submission confirmation ID, and awarded community XP points.

---

### 4.6. Profile, Achievements & Leaderboard (`src/screens/Profile/`)
* **`ProfileScreen.jsx`**:
  - User identity, avatar selection, rank badge (e.g. *"AI Awareness Champion"*), level bar, and cumulative XP counter.
  - Quick stats grid (Scans performed, Scams detected, Quizzes mastered, Community reports).
  - Recent activity timeline and shortcut links to Achievements, Leaderboard, and Settings.
* **`AchievementsScreen.jsx`**:
  - Visual badge showcase: *First Scan, Scam Hunter, Quiz Master, Guardian, Fraud Buster, Security Legend*.
* **`LeaderboardScreen.jsx`**:
  - Global and Weekly ranking tables showcasing top community cyber protectors.
* **`EditProfileScreen.jsx` & `SettingsScreen.jsx`**:
  - User customization, notifications toggle, privacy settings, and sign-out.

---

### 4.7. Real-Time Protection & Android Accessibility Engine
* **`App.jsx`, `accessibilityService.js`, `ScamAlertOverlay.jsx`, `AccessibilitySetupBanner.jsx`**:
  - **Accessibility Event Listening:** Intercepts on-screen window text changes across target chat apps (`com.whatsapp`, `org.telegram.messenger`, `com.instagram.android`, `com.google.android.apps.messaging`).
  - **On-Device Heuristic Pre-Filter:** Evaluates text against regular expressions for suspicious URL shorteners (`bit.ly`, `tinyurl`, `.info`), high-pressure urgency keywords (`urgent`, `verify now`, `suspended`, `last chance`), and banking terms (`otp`, `pin`, `cnic`, `account locked`).
  - **Heads-Up Alert Overlay (`ScamAlertOverlay.jsx`):** If a threat threshold is crossed, a system alert banner is rendered over the app with immediate action buttons (*"View Analysis"*, *"Dismiss"*), deep-linking straight into `DetectScreen`.

---

### 4.8. Authentication & Onboarding
* **`OnboardingStack.jsx` & `src/screens/Onboarding/`**:
  - 3-step interactive walkthrough detailing Multimodal Detection, Real-time Alerts, and Gamified Training.
* **`AuthStack.jsx` & `src/screens/Auth/`**:
  - `LoginScreen.jsx`, `RegisterScreen.jsx`, `FogotPasswordScreen.jsx`, `OTPScreen.jsx`.
  - Managed via `AuthContext.js` and `@react-native-firebase/auth` with local AsyncStorage session caching.

---

## 5. Design System, Theme Tokens & UI Guidelines

Insightify follows a **Light Slate & Royal Blue** design system.

### 5.1. Color Palette

```
┌──────────────────────────┬──────────────┬──────────────────────────────────────────┐
│ Token Name               │ Hex Value    │ Usage                                    │
├──────────────────────────┼──────────────┼──────────────────────────────────────────┤
│ Primary Blue             │ #0056D2      │ Brand primary, main buttons, active tabs │
│ Accent Light Blue        │ #0284C7      │ Secondary gradients, active highlights   │
│ Light Sky Blue           │ #EFF6FF      │ Icon background containers, tint pills   │
│ Background Canvas        │ #F8FAFC      │ App background across all main screens   │
│ Card Surface             │ #FFFFFF      │ Elevated cards, lists, modals            │
│ Border & Dividers        │ #E2E8F0      │ Subtle card borders, section separators  │
│ Text Primary             │ #0F172A      │ Headlines, card titles, hero text        │
│ Text Secondary           │ #334155      │ Body text, messages, readable copy       │
│ Text Muted / Subtitle    │ #64748B      │ Labels, timestamps, hints                │
│ Text Placeholder         │ #94A3B8      │ Form placeholders, inactive icons        │
│ Threat Danger (Red)      │ #DC2626      │ Scam warnings, high risk score, errors   │
│ Threat Danger Light (BG) │ #FEF2F2      │ Red pill backgrounds, warning highlights │
│ Safe Success (Green)     │ #059669      │ Legitimate message badge, correct answer │
│ Safe Success Light (BG)  │ #ECFDF5      │ Green pill backgrounds, success states   │
│ Warning / Alert (Amber)  │ #F59E0B      │ Moderate risk indicators, caution pills  │
│ Warning Light (BG)       │ #FFFBEB      │ Amber badge backgrounds                  │
└──────────────────────────┴──────────────┴──────────────────────────────────────────┘
```

### 5.2. Typography
- **Primary Headers:** Bold / Black (`fontWeight: '800' - '900'`), high-contrast dark slate (`#0F172A`).
- **Body & Message Text:** Medium (`fontWeight: '500' - '600'`), dark slate (`#334155`), line height 18–22.
- **Labels & Badges:** Heavy (`fontWeight: '700' - '800'`), letter spacing 0.2, sizes 10–13.

### 5.3. Layout & Elevation Rules
- **Corner Radii:** Cards: `16px – 22px`, Buttons & Inputs: `14px – 18px`, Floating Tab Bar: `28px`, Badges: `8px – 12px`.
- **Shadows & Elevation:** Subtle ambient shadows on Android (`elevation: 1–4`), soft iOS shadows (`shadowColor: '#0F172A'`, `shadowOpacity: 0.04–0.15`, `shadowRadius: 4–12`).
- **Bottom Navigation Offset:** Every scrollable screen must include a `bottomSpacer` (min `80px – 100px`) to prevent content from being obscured by the custom floating tab bar.

---

## 6. Technical Architecture & Technology Stack

### 6.1. Frontend Architecture (Mobile Client)
- **Core:** React Native `0.75.5` + React `18.3.1`.
- **Navigation:** `@react-navigation/native` `^6.1.18` with Native Stack and Bottom Tabs.
- **Styling:** Vanilla React Native `StyleSheet.create` with `react-native-linear-gradient` and `react-native-vector-icons/Ionicons`.
- **File Management & Media:** `react-native-document-picker`, `react-native-image-picker`, `react-native-fs` (Base64 file encoding with a strict 4MB max upload constraint).
- **State Management:** React Context (`AuthContext`, `OnboardingContext`) + Local state hooks (`useState`, `useRef`, `useMemo`, `useCallback`).
- **Native Android Services:** Native Android Accessibility Bridge + Notification Module.

---

### 6.2. Backend Architecture (`scam-backend/`)
- **Runtime & Server:** Node.js + Express (`scam-backend/index.js`).
- **AI Model Engine:** Google Gemini API (`@google/generative-ai` with `gemini-2.5-flash`).
- **Caching Layer:** In-memory TTL key-value cache (1-hour expiration) keyed by message text hash to minimize redundant LLM calls.
- **Rate Limiting:** Sliding-window rate limiter (10 calls/min) preventing quota exhaustion.
- **Heuristic Rule-Based Fallback:** Instant local scoring engine if Gemini API is unreachable or rate-limited:
  - Scans URL patterns: `/(https?:\/\/|www\.|bit\.ly|tinyurl|\.com|\.net|\.info)/i` (+0.4)
  - Scans Urgency terms: `urgent, verify, immediately, suspended, blocked, last chance` (+0.3)
  - Scans Sensitive terms: `bank, account, password, pin, otp, card, cnic, ssn` (+0.3)
- **API Endpoints:**
  - `POST /api/v1/score`: Batch scoring endpoint for feed items and notification messages.
  - `POST /api/v1/analyze`: Multimodal analysis endpoint receiving text and base64 media payloads (`image`, `audio`, `video`, `document`).

---

## 7. Project Directory Map

```
Insightify/
├── App.jsx                       # Root application entry: Accessibility + Notifications + RootNav
├── package.json                  # Dependencies & React Native configuration
├── scam-backend/                 # Node.js backend server
│   ├── index.js                  # Express API, Gemini AI integration, cache & heuristic engine
│   ├── package.json              # Backend dependencies (@google/generative-ai, express, cors)
│   └── .env                      # GEMINI_API_KEY, PORT configuration
└── src/
    ├── components/
    │   ├── AccessibilitySetupBanner.jsx   # Banner prompting real-time protection enablement
    │   ├── ScamAlertOverlay.jsx           # Heads-up floating overlay for incoming threats
    │   ├── layout/                        # Screen container and safe-area wrappers
    │   ├── navigation/
    │   │   └── CustomTabBar.jsx           # Custom Floating Glass Pill Tab Bar
    │   ├── common/                        # Reusable Card, Button, ProgressBar, SectionTitle
    │   └── profile/ / quiz/ / report/     # Domain-specific UI components
    ├── config/
    │   └── api.js                         # API base URLs and endpoint constants
    ├── context/
    │   ├── AuthContext.js                 # Authentication state & Firebase user provider
    │   └── OnboardingContext.js           # First-time onboarding completion provider
    ├── navigation/
    │   ├── RootNavigator.jsx              # Root stack router (Onboarding vs Auth vs App)
    │   ├── AppStack.jsx                   # Main application stack wrapper
    │   ├── TabNavigator.jsx               # Bottom 5-tab router integrating CustomTabBar
    │   ├── DetectStack.jsx                # DetectScreen -> ResultScreen -> HistoryScreen
    │   ├── GamesStack.jsx                 # QuizHomeScreen -> QuizPlayScreen -> QuizResultScreen -> Rewards
    │   ├── FeedStack.jsx                  # FeedScreen router
    │   ├── ReportStack.jsx                # ReportHomeScreen -> ReportFormScreen -> ReportSuccessScreen
    │   ├── ProfileStack.jsx               # ProfileScreen -> Achievements -> Leaderboard -> EditProfile
    │   └── navigationRef.js               # Imperative navigation reference for background deep-links
    ├── screens/
    │   ├── Auth/                          # Login, Register, ForgotPassword, OTP screens
    │   ├── Detect/                        # DetectScreen, ResultScreen, DetectionHistoryScreen
    │   ├── Feed/                          # FeedScreen and FeedCard components
    │   ├── Games/                         # QuizHomeScreen, QuizPlayScreen, QuizResultScreen, Rewards
    │   ├── Onboarding/                    # 3-step introduction carousel screens
    │   ├── Profile/                       # Profile, Achievements, Leaderboard, Settings, EditProfile
    │   ├── Report/                        # ReportHomeScreen, ReportFormScreen, ReportSuccessScreen
    │   └── Splash/                        # SplashScreen component
    ├── services/
    │   ├── accessibilityService.js        # Android accessibility bridge & event subscriptions
    │   ├── scamApi.js                     # Client-side API fetchers (scoreMessages, analyzeText)
    │   ├── authService.js                 # Firebase Auth helpers
    │   └── storage.js                     # AsyncStorage helper utilities
    └── utils/
        └── avatars.js                     # Local avatar asset mappings and constants
```

---

## 8. Strategic Improvement Avenues (For AI Agents & Collaborators)

When sharing this project with another agent or developer to iterate on architecture, UI, and features, consider focusing on these high-impact areas:

1. **State Management & Offline Intelligence:**
   - Migrate to a global store (e.g., **Zustand** or **Redux Toolkit**) for centralized caching of Quiz progress, Feed posts, and Scans.
   - Explore on-device offline scam classification (e.g. **TensorFlow Lite / ONNX mobile models**) to analyze SMS and WhatsApp messages without requiring an active internet connection.
2. **UI & Micro-Animations:**
   - Integrate **React Native Reanimated v3** for spring layout transitions on the Feed cards, Question cards, and Scan results.
   - Add a curated **Dark Mode** toggle with deep midnight slate (`#0A0F1E`) tokens, keeping the royal blue accents.
3. **Real-Time Phishing Intelligence Heatmap:**
   - Expand the Feed into an interactive map showing live trending scam types by geographic region or communication platform.
4. **End-to-End Encryption & Privacy:**
   - Implement zero-knowledge sanitization to strip personally identifiable information (PII) like private names, credit card numbers, or addresses before dispatching text to AI analysis backends.

---
*End of Documentation. Generated for Insightify.*
