# AI Agent Implementation Plan: Zion Baptist Church App

## 🤖 Context for AI Agents
You are working on the Zion Baptist Church web application, built with React, Vite, TailwindCSS, and Firebase.
This file serves as a persistent roadmap. Your goal is to help the user complete these pending tasks once they have provided the required client data. Do **not** proceed with a task until the user explicitly provides the required data listed in Phase 1.

---

## 📋 Phase 1: Pending Client Data (DO NOT PROCEED UNTIL PROVIDED)
Before implementing the technical steps, verify if the user has provided:

1. **Branding & Visual Assets**
   - High-Resolution Logo (Light & Dark variants)
   - Exact Hex color codes for the brand.
   - Professional photos of the Pastors and Ministries.

2. **YouTube Integration Data**
   - The official YouTube Channel ID or specific Sermons Playlist URL.
   - A YouTube Data API v3 Key (from Google Cloud Console).

3. **Push Notifications Setup**
   - Confirmation that the Firebase project is upgraded to the **Blaze (Pay-as-you-go) Plan** (required for Cloud Functions).

4. **Domain Setup**
   - The target custom domain name.
   - Access to the domain registrar for DNS configuration.

---

## 🛠️ Phase 2: Technical Execution Plan

### Task 1: Apply Branding & Assets
*Trigger: When user provides brand colors and logos.*
1. Replace placeholder logos in the `public/` directory (e.g., `logo.png`, PWA icons).
2. Edit `tailwind.config.cjs` and `src/index.css` to update primary, secondary, and accent colors to match the exact brand guidelines.
3. Inform the user to upload the new Pastor and Ministry photos via the `/admin` CMS dashboard.

### Task 2: Automate YouTube Sermons Integration
*Trigger: When user provides YouTube Channel ID and API Key.*
1. Add the provided YouTube API Key to `.env` as `VITE_YOUTUBE_API_KEY`.
2. Refactor `src/features/sermons/api/getSermons.ts` (or create a new API utility) to fetch the latest videos from the YouTube Data API instead of Firestore.
3. Update `src/features/sermons/routes/Sermons.tsx` to display the dynamically fetched YouTube videos.
4. Modify `src/features/admin/routes/Admin.tsx` to remove the manual Sermon creation form, and replace it with a UI indicating that sermons are automatically synced from YouTube.

### Task 3: Automate Push Notifications via Cloud Functions
*Trigger: When user confirms Firebase Blaze plan is active.*
1. Initialize Firebase Functions in the project root (`firebase init functions`). Choose Node.js or TypeScript.
2. Write a function triggered by Firestore (`onDocumentCreated` in the `notifications` collection).
3. The function must fetch all FCM tokens from the `fcm_tokens` collection and use the `firebase-admin` SDK to send a multicast message to all tokens.
4. Deploy the function using `firebase deploy --only functions`.

### Task 4: Final Production Deployment
*Trigger: When the app is feature-complete.*
1. Verify the PWA manifest (`vite.config.ts`) and `index.html` metadata are perfectly aligned with Zion Baptist Church.
2. Run `npm run build` to compile the production assets.
3. Deploy to Firebase Hosting (`firebase deploy --only hosting`).
4. Guide the user through adding their custom domain in the Firebase Console and updating their DNS A/TXT records.

---
**Agent Instruction:** When the user shares new information, cross-reference it with this plan and execute the corresponding task step-by-step.
