# 🎨 SI-K-Beauty — Next.js 16 Frontend Web Application

The frontend client of Sikbeauty is built with React 19 and Next.js 16 (App Router), engineered to deliver a luxury user interface with fast performance, smooth micro-animations, and complete responsiveness across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack & Key Libraries

* **Framework:** Next.js 16 (App Router, Turbopack enabled)
* **Core Runtime:** React 19 (Server & Client Components)
* **Styling System:** Vanilla CSS + Tailwind CSS (using fluid luxury spacing and custom themes)
* **State Management:** React Context API (custom contexts for `AuthContext` and `CartContext`)
* **API Connection:** Axios Client with dynamic port configuration and withCredentials enabled
* **Phone Validation:** `libphonenumber-js` (providing live real-time country code formatting & validity validation)
* **Design Elements:** Lucide React icons, Swiper.js premium sliders, and Recharts statistics

---

## 📂 Frontend Directory Structure

The application separates routing from views to keep pages clean and highly maintainable:

```
app/
├── public/              # Static assets, fonts, local video files
├── src/
│   ├── app/             # Next.js App Router entry points & error boundaries
│   │   ├── page.tsx     # Home Page Router delegate
│   │   ├── layout.tsx   # Global HTML Shell, Root Layout, Google Fonts
│   │   └── error.tsx    # App Router central error boundaries
│   ├── assets/          # Static logos, background visuals, fallback placeholders
│   ├── components/      # Shared components (Navbars, loaders, indicators)
│   ├── config/          # Axios API central endpoints config
│   ├── contexts/        # Auth (Authentication state) & Cart (E-commerce cart)
│   ├── utils/           # Shared utility tools & country phone code assets
│   └── views/           # Modular view templates mapped from the App Router
│       ├── admin/       # Admin views (Users dashboard, product tables, orders)
│       ├── auth/        # Authentication views (Login & registration forms)
│       ├── checkout/    # Checkout, shipment addresses, Stripe callbacks
│       ├── client/      # Simple Client retail view pages & details
│       ├── user/        # Personal customer dashboards, orders, and favorites
│       └── landing/     # Landing pages, FAQs, policies, contact forms
├── next.config.ts       # Central Next.js custom configurations
├── package.json         # Dependencies & dev scripts
└── tsconfig.json        # TypeScript options
```

---

## 🌟 Premium Features Implemented

### 📱 Live Country Code Selector & Real-Time Validator
Both `SignupPage.jsx` and `CheckoutPage.jsx` feature a highly interactive, validated phone input system:
1. **Dynamic Dropdown:** Includes a precompiled database of **54 global country codes** loaded dynamically inside a custom styled dropdown.
2. **Visual Border States:** As users input their phone number, the field dynamically calculates formatting validity:
   * **Valid Format:** The input border highlights in **emerald green** showing `✓ Numéro de téléphone valide`.
   * **Invalid Format:** The input border transitions to **rose red** showing `✗ Numéro de téléphone invalide pour ce pays`.
3. **Form Gatekeeping:** The checkout "Payer" button dynamically locks when the phone input is invalid, ensuring correct data captures before submission.

### 🖼️ Seamless Next/Image Local Uploads Integration
To serve images dynamically uploaded to the backend server (on `http://localhost:3000/uploads/...`) without experiencing isolated Docker container proxying errors (400 Bad Request), the application next configuration operates with `unoptimized: true` inside [next.config.ts](file:///home/badr-eddine-slaoui/Documents/transform/sikbeauty-next/next.config.ts). This makes Next.js generate standard, compliant HTML image tags pointing directly to port 3000, allowing all visitor, client, and admin dashboards to load product imagery perfectly.

---

## 🚀 Independent Local Development

If you wish to boot up the Next.js application in isolation outside of Docker:

### 1️⃣ Ensure Env Variables are Configured
Create or modify the `app/.env` file:
```ini
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2️⃣ Install Dependencies
Ensure you are inside the `app/` folder:
```bash
npm install
```

### 3️⃣ Launch the Dev Server
```bash
npm run dev
```
The dev server launches on [http://localhost:4000](http://localhost:4000) using **Turbopack** for near-instantaneous hot-reloading!

---

## 👨‍💻 Primary Authors
* **Mohammed Latrach** — *Lead Designer & Frontend Engineer*
* **Marouane ADDOU** — *Software Engineer*
