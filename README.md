# FlameHouse 🔥

FlameHouse is a premium fast food ordering application featuring a stunning liquid-glassmorphism (jelly glass) UI design. Built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, it showcases a fully functional shopping cart, persistent simulated authentication, dynamic menu filtering/sorting, a protected chef admin panel, order logs tracking, and visual analytics dashboards.

---

## ⚡ Tech Stack

*   **Frontend:** Next.js 16 (App Router) + React 19
*   **Styling:** Tailwind CSS v4 (configured with fluid glass filters, custom scrollbars, and jelly active-scale animations)
*   **Animations:** Framer Motion (respecting `prefers-reduced-motion` for accessibility)
*   **Charts:** Recharts (displaying active catalog analytics)
*   **Data Persistence:** Simulated Database via React Context (`AuthContext` & `CartContext`) persisted across sessions using `localStorage`.

---

## 🔑 Demo Credentials

To check out the protected dashboards and shopping cart tracking, click the **Demo Login** buttons on the Login page or use the credentials below:

| Account Role | Demo Email | Demo Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Chef / Admin** | `admin@flamehouse.com` | `admin123` | Create recipes, delete dishes, view analytics dashboard, place orders |
| **Customer** | `user@flamehouse.com` | `password123` | Order foods, apply coupons, track order status in history, add dishes |

---

## 🚀 Setup & Installation

Get the application running locally in less than a minute:

1.  **Clone / Download the project files** to your local system workspace.
2.  **Install dependencies** using your terminal:
    ```bash
    npm install
    ```
3.  **Launch the development server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**: Navigate to `http://localhost:3000`.

---

## 📂 Project Architecture

```yaml
├── app/
│   ├── about/            # Brand story and pillars
│   ├── cart/             # Shopping cart, coupon discounts, tax totals, checkout triggers
│   ├── contact/          # Support forms, physical address parameters, interactive maps
│   ├── items/
│   │   ├── add/          # (Protected) Add custom menu dishes with spec validation
│   │   └── manage/       # (Protected) Recipes listing table + Recharts analytics
│   ├── login/            # Sign in page + Demo filler buttons
│   ├── menu/             # Explore page (Search, Categories, Price slider, Spice, Sort, Pagination)
│   │   └── [id]/         # Detail page (Multi-image selector gallery, specs, ingredients, reviews, related items)
│   ├── my-orders/        # Receipt logs showing order tracker progress
│   ├── register/         # Form to register accounts
│   ├── globals.css       # Glass panels, Jelly buttons, theme colors, and scroll scrollbar styles
│   └── layout.tsx        # SEO headers, Geist typography, and global Providers wrap
├── components/
│   ├── Navbar.tsx        # Responsive navigation with cart badge count
│   ├── Footer.tsx        # Links, coordinates, and social SVGs
│   └── MenuCard.tsx      # Standard cards displaying prices, ratings, and spice flames
├── context/
│   ├── AuthContext.tsx   # Persists logins, registrations, custom recipes additions and deletions
│   └── CartContext.tsx   # Controls cart items, quantities, totals, and receipts history
└── lib/
    ├── data.ts           # 10 initial dishes across 5 categories + review helper
    └── types.ts          # Simple TypeScript structures for items, users, and receipts
```

---

## ☁️ Production Firebase Setup (Walkthrough)

If you decide to deploy this with a real backend instead of the local storage database fallback:

1.  **Create Firebase Project:** Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Firestore & Auth:**
    *   Navigate to **Build > Authentication** and enable the *Email/Password* provider.
    *   Navigate to **Build > Firestore Database** and create a database in production mode.
3.  **Install SDK:** Run `npm install firebase`.
4.  **Wire Auth Context:**
    *   Initialize Firebase config inside `lib/firebase.ts`.
    *   In `context/AuthContext.tsx`, import `getAuth` and replace `login` and `register` functions with Firebase's `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
5.  **Wire Database:**
    *   In `context/AuthContext.tsx` and detail pages, replace the local state helpers with Firestore document calls using `collection(db, 'menu')` and standard methods (`addDoc`, `deleteDoc`, `onSnapshot`).
