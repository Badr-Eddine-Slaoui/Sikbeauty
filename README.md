# 💄 Sikbeauty

**Sikbeauty** is an international **e-commerce platform** dedicated to cosmetic products.  
It allows users to create accounts as either **simple clients** (retail buyers) or **professional users** (wholesale buyers), with dynamic pricing based on account type.  
The platform is **multilingual (Arabic, French, English)** and supports **multiple payment methods** depending on user location.

---

## 🏗️ Project Structure

```
Sikbeauty/
│
├── frontend/     # React + TailwindCSS
│
└── backend/      # Express + Node.js + TypeScript + PostgreSQL
```

---

## 🌐 Features

### 🧑‍💄 User Roles
- **Simple Client**: Retail buyer, views regular prices.  
- **Professional Account**: Wholesale buyer, views discounted professional prices.  
- **Admin**: Manages all products, categories, and pricing.

### 🛍️ E-commerce Features
- Product browsing and search  
- Product categories  
- Image gallery for each product  
- Retail & wholesale pricing  
- User dashboards for clients and professionals  
- Secure authentication & authorization  

### 🌎 Multilingual Support
- Arabic 🇲🇦  
- French 🇫🇷  
- English 🇬🇧  

### 💳 Payment Methods
- **Inside Morocco:** Cash on delivery (COD)  
- **Outside Morocco:** Stripe payment gateway  

---

## ⚙️ Tech Stack

### Frontend
- **React.js** – Component-based UI  
- **Tailwind CSS** – Utility-first styling  
- **React Router** – Client-side routing  
- **Context API** – Global state management  
- **Axios / Fetch** – API communication

### Backend
- **Node.js + Express.js** – RESTful API  
- **TypeScript** – Type-safe backend logic  
- **PostgreSQL** – Relational database  
- **Prisma ORM (optional)** – Database access layer  
- **Stripe SDK** – Payment integration  
- **JWT Authentication** – Secure access control

---

## 📁 Frontend Structure

```
src/
├── assets/               # Images, fonts, Tailwind config, etc.
├── components/           # Reusable UI components (Buttons, Cards, Forms)
├── pages/                # Route-based page components
│   ├── index/            # Home page
│   │   └── IndexPage.jsx
│   ├── auth/             # Login & signup pages
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── client/           # Simple client pages
│   │   ├── ClientDashboard.jsx
│   │   ├── ProductsPage.jsx
│   │   └── ProductDetailsPage.jsx
│   ├── professional/     # Professional buyer pages
│   │   ├── ProfessionalDashboard.jsx
│   │   ├── ProductsPage.jsx
│   │   └── ProductDetailsPage.jsx
│   ├── admin/            # Admin management pages
│   │   └── AdminDashboard.jsx
├── routes/               # Router configuration & guards
├── services/             # API calls & authentication logic
├── utils/                # Helper functions
├── context/              # React contexts for user/auth/product state
└── App.jsx               # Root app component
```

---

## ⚙️ Backend Structure (Express + TypeScript)

```
backend/
├── src/
│   ├── config/           # Environment config, DB connection
│   ├── controllers/      # Route logic
│   ├── middlewares/      # Auth, validation, error handling
│   ├── models/           # Database models (PostgreSQL)
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.ts          # Server entry point
└── package.json
```

---

## 🧾 API Overview

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | `POST` | Register new user |
| `/api/auth/login` | `POST` | Login user |
| `/api/products` | `GET` | Get all products |
| `/api/products/:id` | `GET` | Get product details |
| `/api/admin/products` | `POST` | Add new product (admin only) |
| `/api/categories` | `GET` | Get all categories |
| `/api/payment/stripe` | `POST` | Handle Stripe payment |
| `/api/payment/cash` | `POST` | Handle cash-on-delivery order |

---

## 🧠 Future Improvements

- 🛒 Shopping cart & wishlist  
- 🧾 Order history tracking  
- 💬 Live chat support  
- 📦 Shipment tracking  
- 🌐 SEO optimization for multilingual pages

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/LatrachDev/Sikbeauty.git
cd Sikbeauty
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# configure PostgreSQL, Stripe keys, etc.
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The frontend should now run on [http://localhost:5173](http://localhost:5173)  
and backend on [http://localhost:3000](http://localhost:3000)

---

## 👨‍💻 Developers

**Mohammed Latrach**  
Full Stack Developer & Graphic Designer  
📷 [Portfolio](https://github.com/LatrachDev) | 💼 [LinkedIn](https://linkedin.com/in/latrachdev)
---

**Marouane ADDOU**  
Software Developer
📷 [Portfolio](https://github.com/marouaneaddou) | 💼 [LinkedIn](https://linkedin.com/in/marouaneaddou/)
---

## 🪪 License

This project is licensed under the **LANDMARK AGENCY**.
