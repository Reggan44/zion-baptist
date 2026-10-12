# AI Agent Implementation Plan: Zion Baptist Church App

## 🤖 Context for AI Agents
You are working on the Zion Baptist Church web application, built with React, Vite, TailwindCSS, and Firebase.
This file serves as a persistent roadmap. Your goal is to help the user complete these pending tasks.

---

## 🟢 Current Status (October 9, 2026)
* **What we achieved so far:** 
  - Completed the Offline-First IndexedDB Bible integration.
  - Successfully connected the YouTube Data API to automatically fetch the latest sermons.
  - Cleaned up the `/admin` dashboard to remove the manual sermon form.
  - Performed a thorough security audit using the "Vibe Coder Security Prompts".
* **What is on deck for right now:**
  1. Build a highly secure Admin Login system (`/login`).
  2. Protect the `/admin` route with Firebase Authentication so unauthorized users are kicked out.
  3. Ensure the login UI is incredibly polished with animations (inspired by Motion Primitives).

---

## ⏸️ Paused Tasks
* **Automated Push Notifications via Cloud Functions:** Paused until the church provides a billing card to unlock the Firebase "Blaze Pay-as-you-go" plan (required for Google Cloud Functions).

---

## 🛠️ Technical Execution Plan

### Task 1: Admin Security & Authentication
*Trigger: When user creates the first Firebase Auth user in the console.*
1. **The State:** Create `src/lib/AuthContext.tsx` to listen to Firebase Auth state changes and provide the current user to the app.
2. **The Guard:** Create `src/components/ProtectedRoute.tsx` that checks the Auth Context. If no user exists, redirect to `/login`.
3. **The Lock:** Wrap the `<Admin />` route in `App.tsx` with the `<ProtectedRoute>`.
4. **The Front Door:** Build a premium, animated `src/features/auth/routes/Login.tsx` page using TailwindCSS and Framer Motion. Secure it against credential stuffing and enumeration based on Vibe Coder security rules.
5. **The Logout:** Add a secure logout button inside the Admin dashboard.

### Task 2: Apply Branding & Assets (✅ COMPLETED)
*Trigger: When user provides brand colors and logos.*
1. ✅ Replace placeholder logos in the `public/` directory (e.g., `logo.png`, PWA icons).
2. ✅ Edit `tailwind.config.cjs` and `src/index.css` to update primary, secondary, and accent colors to match the exact brand guidelines.
3. ✅ Inform the user to upload the new Pastor and Ministry photos via the `/admin` CMS dashboard.

### Task 3: Final Production Deployment (✅ COMPLETED)
*Trigger: When the app is feature-complete.*
1. ✅ Verify the PWA manifest (`vite.config.ts`) and `index.html` metadata are perfectly aligned with Zion Baptist Church.
2. ✅ Run `npm run build` to compile the production assets.
3. ✅ Deploy to Firebase Hosting (`firebase deploy --only hosting`).
4. Guide the user through adding their custom domain in the Firebase Console and updating their DNS A/TXT records.

---
**Agent Instruction:** When the user shares new information, cross-reference it with this plan and execute the corresponding task step-by-step.
