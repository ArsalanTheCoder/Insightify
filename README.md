Insightify – AI Safety & Awareness Initiative 🛡️

<div align="center">

</div>

🚀 Executive Summary

Insightify is a cutting-edge mobile application designed to combat the rising tide of AI-generated fraud. By combining advanced detection tools with gamified awareness, we provide a single, user-friendly platform where awareness meets action.

The gap in digital safety isn't just technological—it's educational. Insightify bridges this gap by offering real-time scam detection, community alerts, and interactive learning modules.

📸 App Screenshots

Authentication & Onboarding

Login Screen

Sign Up

Security Setup

<img src="./screenshots/1.jpeg" width="250" />

<img src="./screenshots/2.jpeg" width="250" />

<img src="./screenshots/3.jpeg" width="250" />

Dashboard & Navigation

User Dashboard

Side Drawer Menu

Analytics Graphs

<img src="./screenshots/4.jpeg" width="250" />

<img src="./screenshots/5.jpeg" width="250" />

<img src="./screenshots/6.jpeg" width="250" />

Detection & Features

Text Analysis

Result Gauge

Community Feed

Profile Settings

<img src="./screenshots/7.jpeg" width="180" />

<img src="./screenshots/8.jpeg" width="180" />

<img src="./screenshots/9.jpeg" width="180" />

<img src="./screenshots/10.jpeg" width="180" />

✨ Key Features

✅ Currently Live (MVP)

🔐 Secure Authentication: Full Login/Signup flow powered by Firebase Auth with email validation and error handling.

📊 Interactive Dashboard: Real-time visual analytics showing global scam trends, vulnerable age groups, and personal safety scores using react-native-chart-kit.

📂 Smart Navigation: A custom "LinkedIn-style" Side Drawer coupled with Stack Navigation for a seamless user experience.

💬 Text-Based Scam Detection: - Dedicated interface to paste suspicious SMS/Emails.

AI-driven risk analysis UI (Safe / Caution / Critical).

🎨 Modern UI/UX: Clean, "Insightify Blue" theme with custom reusable components (Cards, Buttons, Inputs).

🚧 Coming Soon (Roadmap)

[ ] Image OCR: Extract text from screenshots for analysis.

[ ] Deepfake Audio: Voice frequency analysis to detect AI clones.

[ ] Video Forensics: Frame-by-frame deepfake detection.

[ ] Gamification: "Spot the Scam" quizzes and Duel Mode.

🛠️ Tech Stack

Category

Technology

Version

Framework

React Native (CLI)

0.75.5

Language

JavaScript / React

ES6+

Backend

Firebase

v21.5.0

Navigation

React Navigation

v6 (Stable Stack)

Charts

React Native Chart Kit

v6.12.0

Build Tool

Gradle

8.10.2

Target SDK

Android 15

API 35

📂 Project Structure

We follow a Feature-First modular architecture for scalability.

Insightify/
├── src/
│   ├── components/       # Reusable UI (Buttons, Inputs, Cards)
│   ├── navigation/       # AuthNavigator, DrawerNavigator
│   ├── screens/
│   │   ├── Auth/         # Login, Signup, OTP
│   │   ├── Dashboard/    # Home, Analytics, Header
│   │   ├── Detection/    # Text Input, Result Screens
│   │   └── Profile/      # Settings, User History
│   └── utils/            # Helper functions
├── android/              # Native Android code
└── App.jsx               # Root Entry Point


⚡ Getting Started

Prerequisites

Node.js > 18

JDK 17

Android Studio (SDK 35)

Installation

Clone the repository

git clone [https://github.com/your-username/Insightify.git](https://github.com/your-username/Insightify.git)
cd Insightify


Install Dependencies

npm install


Start the Metro Server

npm start


Run on Android

npx react-native run-android


🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📞 Contact

Muhammad Maaz - Project Lead

📧 Email: [Your Email Here]

🔗 LinkedIn: [Your LinkedIn Profile]

<div align="center">
<sub>Built with 💙 by the Insightify Team</sub>
</div>
