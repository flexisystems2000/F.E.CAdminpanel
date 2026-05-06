# Flexi Educational Consult | Admin Dashboard

The central management interface for the Flexi Educational Consult ecosystem. This dashboard is a high-performance, web-native application designed to manage student profiles, CBT (Computer Based Test) records, and institutional financial oversight.

## 🏛️ Project Overview
This repository contains the administrative core of Flexi Educational Consult. Built with a mobile-first philosophy, it integrates 12 specialized HTML5 modules into a unified dashboard that can be deployed as desktop software for office use or a mobile app for on-the-go management.

## 🔑 Key Administrative Modules
* **Student Management:** Comprehensive profiles and performance tracking.
* **CBT Engine Control:** Backend integration for JAMB/WAEC prep cycles.
* **Financial Oversight:** Real-time billing and institutional receipt generation (Chief Bursar access).
* **Leaderboard Analytics:** Dynamic ranking logic and student performance statistics.
* **Bot Automation:** Integration hooks for automated community management.

## 🚀 Deployment Strategy
This dashboard is architected to run as a **Native Desktop/Mobile App** via Tauri or as an **Enterprise PWA**.

### Cloud Build (Mobile-Only Workflow)
1. **Repository Hub:** Managed via GitHub.
2. **Environment:** Import this repo into **Project IDX** for cloud-based native compilation.
3. **Hosting:** Connected to **Vercel/Netlify** for live administrative access.

## 📁 Repository Structure
```text
├── index.html           # Admin Authentication & Login
├── dashboard.html       # Primary Control Panel
├── modules/             # The 12 specialized HTML management files
├── assets/              # Institutional branding (Logos/Graphics)
├── js/                  # Firebase/Firestore integration logic
└── README.md            # System Documentation
