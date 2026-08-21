# TrueStyle – E-Commerce Counterfeit Fashion Detection Platform

TrueStyle is a cybersecurity-driven platform built using React, TypeScript, and Tailwind CSS. It leverages a multi-signal consensus engine to analyze price, seller trust, and platform authenticity before confirming safe shopping indicators.

## 🛡 System Key Features

1. **Konsensus Risk Engine**: Applies a multi-signal voting protocol. An alert warning is triggered if and only if **two or more** signals are flagged as suspicious.
2. **Firebase Dual-Mode**: Operates on live Firebase connections if credentials are provided in `.env`. Otherwise, it falls back to a persistent **Simulated Local State Mode** stored in `localStorage`.
3. **Interactive OTP Email Verification**: Simulates email OTP verifications by generating codes and displaying them securely on the screen in mock mode.
4. **Interactive Registration Captcha**: Employs mathematical captcha sums to block bot registrations.
5. **Interactive User Dashboard**: View scan statistics, doughnut charts, bookmark logs, search/filter history logs, and manage preferences.
6. **Robust Admin Dashboard**: Elevates administrator accounts to modify brand databases, seller databases, moderate support tickets, and view activity logs.
7. **Compliance PDF Exporter**: Builds and downloads formatted PDF scan compliance logs.
8. **Digital Shield AI Chatbot**: Interactive customer support widget with contextual auto-replies.

---

## 🚀 Execution Steps (Running Locally)

Follow these simple steps in your terminal to initialize and run the TrueStyle node:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Access the Port**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Tester Accounts (Local Mode Credentials)

The mock database is pre-seeded with the following testing credentials:

### 1. User Dashboard Profile
- **Email**: `user@truestyle.security`
- **Password**: `UserPassword123!`
- **Includes**: Mock history data for Nike, Gucci, LV, and Adidas scans showing safe and counterfeit resolutions.

### 2. Admin Terminal Profile
- **Email**: `admin@truestyle.security`
- **Password**: `AdminPassword123!`
- **Includes**: Access to official brands registry, seller indexes, moderation tickets, and active activity logs.

---

## 📂 Codebase Architectures

- `src/context/AuthContext.tsx` - Handles registration complexity, captcha checks, and Firebase integration.
- `src/services/scanEngine.ts` - Implements the price, seller, platform, and brand consensus rules.
- `src/services/mockDatabase.ts` - Manages `localStorage` queries, seeds, and mutations.
- `src/utils/pdfGenerator.ts` - Exports dark compliance reports using `jsPDF`.
