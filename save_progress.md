# fridge.pk — Backend Development Progress

**Developer:** Farmanullah Ansari | Full Stack Software Engineer  
**Portfolio:** https://farmanullah1.github.io/My-Portfolio  
**LinkedIn:** https://www.linkedin.com/in/farmanullah-ansari/  
**GitHub:** https://github.com/farmanullah1

---

## Phase: MongoDB Backend Integration

### Step 1 — Frontend analysis (completed)

Analyzed `Frontend/` React + Vite application:

| Feature | Before | After |
|---------|--------|-------|
| Products | `mockData.ts` + localStorage | MongoDB via `GET /api/products` |
| Auth | Mock JWT in browser | `POST /api/auth/register`, `/login` + bcrypt + JWT |
| Orders | localStorage only | `POST /api/orders` + `GET /api/orders` (authenticated) |
| Addresses | localStorage | `GET/POST/PATCH/DELETE /api/addresses` |
| Wishlist | localStorage | Synced with `/api/wishlist` when logged in |
| Reviews | Local state only | `POST /api/products/:id/reviews` |
| AI assistant | `server.ts` file API | `POST /api/ai/consult` (Gemini + rule fallback) |
| Seller catalog | localStorage | `POST/DELETE /api/products` |

### Step 2 — Backend scaffold (completed)

Created `Backend/` with:

```
Backend/
├── src/
│   ├── index.ts           # Express app entry
│   ├── seed.ts            # DB seed script
│   ├── config/            # env + MongoDB connection
│   ├── models/            # User, Product, Order, Address, Wishlist
│   ├── middleware/        # JWT auth (requireAuth, optionalAuth)
│   ├── routes/            # auth, products, orders, addresses, wishlist, ai
│   ├── utils/             # Response mappers
│   └── data/seedProducts.ts
├── package.json
├── tsconfig.json
└── .env
```

**Stack:** Express 4, Mongoose 8, bcryptjs, jsonwebtoken, cors, TypeScript.

### Step 3 — API routes implemented (completed)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login (email or phone) |
| GET | `/api/auth/me` | JWT | Current user |
| PUT | `/api/auth/profile` | JWT | Update profile |
| PUT | `/api/auth/change-password` | JWT | Change password |
| POST | `/api/auth/forgot-password` | — | Send OTP (dev OTP in response) |
| POST | `/api/auth/verify-otp` | — | Verify OTP |
| POST | `/api/auth/reset-password` | — | Reset password |
| GET | `/api/products` | — | List all products |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | JWT | Seller add product |
| DELETE | `/api/products/:id` | JWT | Remove product |
| POST | `/api/products/:id/reviews` | JWT | Add review |
| GET | `/api/orders` | JWT | User order history |
| POST | `/api/orders` | optional JWT | Place order |
| GET | `/api/orders/track/:orderId` | — | Public order tracking |
| PATCH | `/api/orders/:orderId/cancel` | JWT | Cancel order |
| GET | `/api/addresses` | JWT | Address book |
| POST | `/api/addresses` | JWT | Add address |
| PATCH | `/api/addresses/:id/default` | JWT | Set default |
| DELETE | `/api/addresses/:id` | JWT | Delete address |
| GET | `/api/wishlist` | JWT | Get wishlist |
| POST | `/api/wishlist/:productId` | JWT | Add item |
| DELETE | `/api/wishlist/:productId` | JWT | Remove item |
| PUT | `/api/wishlist/sync` | JWT | Bulk sync |
| POST | `/api/ai/consult` | — | AI cooling assistant |

### Step 4 — Database seed (completed)

- Seeded **10 products** from frontend catalog (`seedProducts.ts`)
- Demo users:
  - `farman.ansari@fridge.pk` / `fringe123` (customer)
  - `demo@fridge.pk` / `fringe123` (seller)
- Auto-seed on server start if product collection is empty

**MongoDB URI note:** User config specified `fridge.pk` as database name, but MongoDB **does not allow `.` in database names**. Updated to `mongodb://localhost:27017/fridge_pk`.

### Step 5 — Frontend integration (completed)

| File | Changes |
|------|---------|
| `Frontend/src/lib/api.ts` | Central API client with JWT headers |
| `Frontend/vite.config.ts` | Proxy `/api` → `http://localhost:5000` |
| `Frontend/package.json` | `dev` script uses Vite (not legacy `server.ts`) |
| `Frontend/src/App.tsx` | Fetch products, API wishlist, seller CRUD |
| `LoginView.tsx` | Real login API |
| `SignUpView.tsx` | Real register API |
| `ForgotPasswordView.tsx` | OTP flow API |
| `CheckoutView.tsx` | `POST /api/orders` |
| `DashboardView.tsx` | Orders, addresses, profile, password APIs |
| `OrderTrackingView.tsx` | `GET /api/orders/track/:id` |
| `ProductDetailView.tsx` | Review submission API |

### Step 6 — Root project files (completed)

- `README.md` — setup instructions
- `package.json` — `install:all`, `dev:backend`, `dev:frontend`, `seed` scripts

### Environment variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fridge_pk
JWT_SECRET=fridge.pk_jwt_secret_key_2024_super_secure
NODE_ENV=development
GEMINI_API_KEY=          # optional, for live Gemini AI responses
```

### How to run

```bash
# Terminal 1 — ensure MongoDB is running, then:
cd Backend
npm install
npm run seed          # optional (auto-seeds on first API start)
npm run dev           # http://localhost:5000

# Terminal 2
cd Frontend
npm install
npm run dev           # http://localhost:5173 (proxies /api to backend)
```

**Port conflict:** If port 5000 is used by another app (e.g. MindBook API), stop that service or set `PORT=5001` in `Backend/.env` and `VITE_API_PROXY_TARGET=http://localhost:5001` when starting the frontend.

### Verification (completed on port 5001)

- `GET /api/health` → `{ status: "ok", service: "fridge.pk-api" }`
- `POST /api/auth/login` with demo credentials → JWT returned
- MongoDB seed → 10 products, 2 users

---

---

## Phase: Site improvements (continued)

### Step 7 — Backend enhancements (completed)

- **Product filters:** `GET /api/products?category=&search=&brand=&sort=&minPrice=&maxPrice=&inStock=`
- **Categories API:** `GET /api/categories`
- **Seller API:** `/api/seller/products`, `/orders`, `/stats`, `PATCH .../status` (seller role required)
- **Stock management:** Validates stock on checkout, decrements on order, restores on cancel
- **Seller-only** product create/delete/update routes
- **Global error handler** and 404 handler

### Step 8 — Frontend polish (completed)

- **Loading states** on home catalog and seller dashboard
- **API offline banner** when backend is unreachable
- **Branding:** Replaced remaining "Fringe.pk" copy with **fridge.pk**
- **Auth gates:** Seller dashboard and account require login; seller role enforced
- **Seller dashboard:** Loads real listings, orders, and stats from MongoDB
- **Product detail:** Refreshes product + reviews from API on open
- **Navigation:** `navigateToView()` centralizes protected routes
- **Dev script:** `npm run dev` runs backend + frontend via `concurrently`

### Step 9 — Run both servers

```bash
npm install          # root (installs concurrently)
npm run install:all
npm run dev          # API :5000 + Vite :5173
```

---

*Last updated: Site improvement phase complete.*
