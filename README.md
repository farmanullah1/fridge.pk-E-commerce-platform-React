# 🧊 fridge.pk - Smart Cooling Marketplace

**fridge.pk** is Pakistan's premier specialized e-commerce platform for cooling appliances. Built with a modern **MERN stack** (MongoDB, Express, React, Node.js), it integrates cutting-edge **AI Consultation** and **AR Visualization** to help users find the perfect refrigerator, air conditioner, or deep freezer for their home.

[![Developer: Farmanullah Ansari](https://img.shields.io/badge/Developer-Farmanullah%20Ansari-0A3D62?style=for-the-badge)](https://farmanullah1.github.io/My-Portfolio)
![Tech: React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)
![Tech: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Tech: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tech: Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)

---

## ✨ Key Features

### 🤖 AI-Powered Consultation
Integrated with **Google Gemini 1.5 Flash**, the platform offers a "Consultation Assist" chatbot that guides users based on room dimensions, family size, and local voltage conditions.

### 📐 3D AR Visualizer
A virtual room planner that allows users to simulate how different appliances will fit in their space before purchase, complete with virtual spacing guidelines.

### ⚡ Energy & Bill Calculator
Specialized calculator for Pakistan's energy market. It compares digital inverter efficiency, estimates solar offsets, and predicts monthly bill savings.

### 🎙️ Advanced Search & Discovery
- **Voice Search:** Speech-to-text integration with an active glowing microphone interface.
- **Smart Autocomplete:** Real-time suggestions matching live appliance catalogs with pricing and images.
- **Appliance Matcher Quiz:** A gamified experience to find the best-fit cooling solution.

### 🛒 E-commerce Core
- **Flash Sales:** Time-limited discounts with real-time countdown timers.
- **Order Tracking:** Comprehensive tracking system for delivery updates.
- **Wishlist & Compare:** Side-by-side comparison of appliance specifications.
- **Seller Dashboard:** Specialized workbench for merchants to manage cooling appliance inventories and analytics.

### 🌓 Modern UI/UX
- **Dark Mode:** Fully stateful theme synchronization with `localStorage`.
- **Responsive Design:** Optimized for all screen sizes using **Tailwind CSS 4**.
- **Smooth Animations:** Powered by **Motion** (Framer Motion) for a fluid feel.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (TypeScript)
- **Bundler:** Vite
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide-React
- **Animations:** Motion
- **AI Integration:** `@google/genai` (Client-side lazy initialization)

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs
- **Environment:** TSX for development, TypeScript for production

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Google Gemini API Key (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/farmanullah1/fridge.pk.git
   cd fridge.pk
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   - Create `Backend/.env` (see `.env.example` in Backend folder)
   - Create `Frontend/.env` (for Gemini API key if used client-side)

4. **Seed the database (Optional):**
   ```bash
   npm run seed
   ```

5. **Run Development Servers:**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
fridge.pk/
├── Backend/                # Express & Node.js Server
│   ├── src/
│   │   ├── models/        # Mongoose Schemas (User, Order, Product, etc.)
│   │   ├── routes/        # API Endpoints
│   │   ├── middleware/    # Auth & Error handling
│   │   └── index.ts       # Server Entry Point
├── Frontend/               # React & Vite Application
│   ├── src/
│   │   ├── components/    # UI Views (Home, AI, AR, Calculator, etc.)
│   │   ├── lib/           # API clients
│   │   └── types.ts       # TypeScript definitions
└── package.json           # Root scripts for mono-repo management
```

---

## 📜 License
This project is for demonstration and portfolio purposes. All rights reserved.

**Developed by Farmanullah Ansari** - [Portfolio](https://farmanullah1.github.io/My-Portfolio)
