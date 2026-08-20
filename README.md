# simunyeBulk

# 🇿🇦 Simunye App

> **"We are one"** — A minimalist community matchmaking platform built to maximize collective buying power.

Simunye App connects neighbors in the same location who want to buy the same bulk groceries from wholesalers. By grouping shopping intent, communities can unlock wholesale prices together and coordinate their purchases offline.

---

## 🎯 Project Scope & MVP Boundaries

To launch fast and stay lean, this project deliberately strips away operational complexities:
*   **NO Integrated Payments:** Financial transactions are handled strictly in cash/EFT offline by the users themselves.
*   **NO In-App Chat:** Once a group is complete, users are given contact details to coordinate via WhatsApp.
*   **NO Delivery Logistics:** Users arrange central community collection points or handle pick-ups independently.

---

## 🏗️ Tech Stack

*   **Frontend:** React (Vite) + TypeScript + Styled-components
*   **Backend:** Node.js + Express.js + TypeScript
*   **Database:** MongoDB + Mongoose
*   **Authentication:** Clerk (Phone Number OTP)

---

## 🗺️ Core User Flow

1.  **Authenticate:** User logs in securely via their mobile number (OTP).
2.  **Locate:** User sets their standardized suburb via Google Places autocomplete.
3.  **Browse & Join:** User joins an active group for a specific bulk grocery item (e.g., 10kg Rice).
4.  **Connect:** When the group target is met (e.g., 10/10 members), the app unlocks member phone numbers so they can create a WhatsApp group offline.

---

## 📂 Project Structure

```text
simunye-app/
├── server/       # Express.js API (TypeScript)
└── client/      # React Client (TypeScript)
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ or latest LTS)
* MongoDB database instance

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
