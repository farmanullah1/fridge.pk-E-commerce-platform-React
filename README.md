# fridge.pk

Pakistan's smart inverter cooling e-commerce platform — React frontend + Express/MongoDB backend.

**Developer:** [Farmanullah Ansari](https://farmanullah1.github.io/My-Portfolio)

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Backend (`Backend/.env`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fridge.pk
JWT_SECRET=fridge.pk_jwt_secret_key_2024_super_secure
NODE_ENV=development
```

### 3. Seed database (optional — API auto-seeds products on first start)

```bash
npm run seed
```

Creates demo users:

- `farman.ansari@fridge.pk` / `fringe123`
- `demo@fridge.pk` / `fringe123` (seller)

### 4. Run development servers

**Both at once (recommended):**

```bash
npm install
npm run install:all
npm run dev
```

Or separately — API on port 5000, frontend on http://localhost:5173 (proxies `/api`).

**Seller demo:** `demo@fridge.pk` / `fringe123`

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Sign up |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Product catalog |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | User orders (auth) |
| GET | `/api/orders/track/:id` | Track order |
| POST | `/api/ai/consult` | AI assistant |

See `save_progress.md` for full development log.
"# fridge.pk-E-commerce-platform-React" 
