# ⚙️ SI-K-Beauty — TypeScript & Express API Backend

The backend of Sikbeauty is an enterprise-grade Express.js RESTful API written in TypeScript, using PostgreSQL for relational persistence, Prisma ORM for schema management, and secured via secure HTTP-Only cookie-based authentication.

---

## 🛠️ Tech Stack & Architecture

* **Runtime:** Node.js + Express.js
* **Language:** TypeScript (rigid type check validations)
* **ORM:** Prisma ORM (relational data models, migrations, seeds)
* **Database:** PostgreSQL (structured persistence)
* **Authentication:** JWT (JSON Web Tokens) set in HTTP-Only Cookies
* **Validation:** Zod Schema validation (pre-request sanitization & custom constraints)
* **Payment Processing:** Stripe API integration
* **Security:** CORS, Helmet, bcryptjs (hashing), cookie-parser

---

## 📂 Backend Directory Structure

The backend features a modern layered design separation of concerns:

```
server/
├── prisma/              # Database Schema & Seeding Logic
│   ├── schema.prisma    # PostgreSQL Relational Tables Definition
│   └── seed.ts          # Comprehensive Database Seeder (Products, Admins, Users)
├── src/
│   ├── controllers/     # Incoming request routers & payload extractors
│   ├── config/          # Environment bindings, CORS origins setup
│   ├── docs/            # Swagger API documentation
│   ├── middlewares/     # Auth checks, global express error handlers
│   ├── routes/          # RESTful endpoint declarations
│   ├── schemas/         # Zod schemas for input validation & preprocessing
│   ├── services/        # Relational query orchestration & business logic
│   ├── types/           # Core TypeScript type overrides
│   ├── utils/           # Helper scripts (tokens, upload directory creators)
│   └── index.ts         # Main Server entry point
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript configuration compiler rules
```

---

## 🔒 Security & Authentication Architecture

Sikbeauty uses secure cookie authentication rather than standard browser `localStorage` variables:
1. **HTTP-Only Cookies:** Tokens are assigned to active sessions via the `cookie-parser` middleware. The cookie is configured as `HttpOnly`, preventing third-party script extraction.
2. **Dynamic CORS configuration:** Fully accepts cross-domain sessions from `http://localhost:4000` (Next.js client) with `credentials: true` enabled.
3. **Password Salting:** Leverages standard `bcryptjs` hashing to ensure passwords are encrypted prior to being stored.

---

## 📞 Smart Preprocessing & Validation
To keep validation highly robust while keeping user entry friendly, all schemas utilizing phone numbers ([auth.schema.ts](file:///home/badr-eddine-slaoui/Documents/transform/sikbeauty-next/server/src/schemas/auth.schema.ts) & [user.address.schema.ts](file:///home/badr-eddine-slaoui/Documents/transform/sikbeauty-next/server/src/schemas/user.address.schema.ts)) operate with Zod preprocessing steps:
* **Cleaning Visual separators:** Replaces spaces, dashes, or parentheses on the fly (e.g. `(555) 123-4567` becomes `5551234567` dynamically before validation checks).
* **Precise validation:** Validates dialing code configurations utilizing `libphonenumber-js`.
* **Database Cleanliness:** Normalized pure digit entries are then successfully saved to the PostgreSQL database, ready for shipping notifications or SMS gateways.

---

## 🧾 Core API Endpoint Catalog

| Group | Route | Method | Description | Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/signup` | `POST` | Create client accounts | Public |
| **Auth** | `/api/auth/login` | `POST` | Authenticate & set Cookies | Public |
| **Auth** | `/api/auth/logout` | `POST` | Clear active cookies | Public |
| **Products** | `/api/products` | `GET` | Fetch catalog (dynamic role prices) | Public |
| **Products** | `/api/products/:id` | `GET` | Get item details | Public |
| **Admin** | `/api/admin/products` | `POST` | Create products with image | Admin |
| **User** | `/api/user/profile` | `GET` | Fetch profile & address | User |
| **Order** | `/api/orders/create` | `POST` | Create order (COD or Stripe) | User |

---

## 🚀 Independent Local Development

To run the TypeScript Express server locally outside of Docker:

### 1️⃣ Configure Env
Create a `server/.env` file:
```ini
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
NODE_ENV=development
FRONTEND_URL="http://localhost:4000"
JWT_SECRET="generate_a_secure_jwt_secret"
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
VITE_API_URL="http://localhost:4000"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY_DAYS="30"
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Synchronize Database Migrations & Seeds
```bash
# Generate Prisma Client & execute migrations
npx prisma migrate dev --name init

# Populate database seeds
npm run seed
```

### 4️⃣ Launch Dev Server
```bash
npm run dev
```
The Server boots on [http://localhost:3000](http://localhost:3000) with hot-reloading enabled!

---

## 👨‍💻 Primary Authors
* **Mohammed Latrach** — *Lead Backend Architect*
* **Marouane ADDOU** — *Database & API Engineer*
