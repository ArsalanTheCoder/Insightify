<div align="center">

# Insightify – AI Safety & Awareness Initiative 🛡️

[![React Native](https://img.shields.io/badge/React_Native-v0.75.5-blue.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v21.5.0-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android-3ddc84.svg)](https://www.android.com/)

<br />

**Where Awareness Meets Action.** *A cutting-edge mobile application designed to combat the rising tide of AI-generated fraud.*

[View Demo](#) · [Report Bug](https://github.com/your-username/Insightify/issues) · [Request Feature](https://github.com/your-username/Insightify/issues)

</div>

---

## 📖 Table of Contents
- [Executive Summary](#-executive-summary)
- [App Screenshots](#-app-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 🚀 Executive Summary
**Insightify** bridges the gap in digital safety, which isn't just technological—it's educational. We combine advanced detection tools with gamified awareness to provide a single, user-friendly platform.

Our mission is to offer **real-time scam detection**, **community alerts**, and **interactive learning modules** to protect users from modern digital threats.

---

## 📸 App Screenshots

### 🔐 Authentication & Onboarding
| Login Screen | Sign Up | Security Setup |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/a063ce50-f9e2-4b78-bccd-727e0c2609e6" width="250" alt="Login" /> | <img src="https://github.com/user-attachments/assets/e12dffb1-c007-4520-98a8-6ea5e54d5bdf" width="250" alt="SignUp" /> | <img src="https://github.com/user-attachments/assets/0ee75e1c-c66d-489a-95da-19da2ff93e5c" width="250" alt="Security" /> |

### 📊 Dashboard & Navigation
| User Dashboard | Side Drawer Menu | Analytics Graphs |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/04e87734-6a4d-43be-9118-1efd371ddc12" width="250" alt="Dashboard" /> | <img src="https://github.com/user-attachments/assets/be7d192f-098d-43bf-8968-bd5508c782b9" width="250" alt="Drawer" /> | <img src="https://github.com/user-attachments/assets/0124662e-49d4-46d1-820a-9e21c5ffdbed" width="250" alt="Analytics" /> |

### 🛡️ Detection & Features
| Text Analysis | Result Gauge | Community Feed | Profile Settings |
|:---:|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/072f21c0-73ed-4b76-8908-fd572af2f5aa" width="180" alt="Text Analysis" /> | <img src="https://github.com/user-attachments/assets/ca0895b0-d8f6-4055-b508-857ce8485b92" width="180" alt="Gauge" /> | <img src="https://github.com/user-attachments/assets/6bcc4a0c-cb60-470b-b3f0-7f54b718d770" width="180" alt="Feed" /> | <img src="https://github.com/user-attachments/assets/3e723350-fc28-4e92-80c4-89f55babfebb" width="180" alt="Profile" /> |

---

## ✨ Key Features

### ✅ Currently Live (MVP)
* **🔐 Secure Authentication:** Full Login/Signup flow powered by Firebase Auth with email validation, secure error handling, and session management.
* **📊 Interactive Dashboard:** Real-time visual analytics showing global scam trends, vulnerable age groups, and personal safety scores using `react-native-chart-kit`.
* **📂 Smart Navigation:** A custom "LinkedIn-style" Side Drawer coupled with Stack Navigation for a seamless, professional user experience.
* **💬 Text-Based Scam Detection:**
    * Dedicated interface to paste suspicious SMS or Emails.
    * AI-driven risk analysis UI displaying results as **Safe**, **Caution**, or **Critical**.
* **🎨 Modern UI/UX:** Clean, "Insightify Blue" theme with custom reusable components (Cards, Buttons, Inputs) for consistency.

### 🚧 Coming Soon (Roadmap)
- [ ] **Image OCR:** Extract text from screenshots automatically for analysis.
- [ ] **Deepfake Audio:** Voice frequency analysis to detect AI clones.
- [ ] **Video Forensics:** Frame-by-frame deepfake detection.
- [ ] **Gamification:** "Spot the Scam" quizzes and Duel Mode to make safety fun.

---

## 🛠️ Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | React Native (CLI) | 0.75.5 |
| **Language** | JavaScript / React | ES6+ |
| **Backend** | Firebase | v21.5.0 |
| **Navigation** | React Navigation | v6 (Stable Stack) |
| **Charts** | React Native Chart Kit | v6.12.0 |
| **Build Tool** | Gradle | 8.10.2 |
| **Target SDK** | Android 15 | API 35 |

---

## 📂 Project Structure
We follow a **Feature-First modular architecture** to ensure scalability and maintainability.

```text
Insightify/
├── src/
│   ├── components/       # Reusable UI (Buttons, Inputs, Cards)
│   ├── navigation/       # AuthNavigator, DrawerNavigator, Routes
│   ├── screens/
│   │   ├── Auth/         # Login, Signup, OTP Screens
│   │   ├── Dashboard/    # Home, Analytics, Header Logic
│   │   ├── Detection/    # Text Input, Result Screens, Analysis Logic
│   │   └── Profile/      # Settings, User History, Account Mgmt
│   └── utils/            # Helper functions, Constants, Theme
├── android/              # Native Android code
├── ios/                  # Native iOS code
└── App.jsx               # Root Entry Point
