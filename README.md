# StyleDecor - Client

A modern **Smart Home & Ceremony Decoration Booking System** built with React, Firebase, and Stripe. Users can browse decoration services, book them, and pay online. Admins manage services and assign decorators. Decorators track and update their project status.

## 🔗 Live Site

[https://style-decor-client-five.vercel.app](https://style-decor-client-five.vercel.app)

---

## ✨ Features

### Public
- Animated hero section with fullscreen image slider
- Browse all decoration services with search & filter by category and budget
- Service details page with booking modal
- Service coverage map (React Leaflet)
- About and Contact pages
- Light / Dark theme toggle

### User
- Register and login with Email/Password or Google
- Book decoration services
- Pay securely via Stripe
- View booking history and payment history
- Update profile

### Admin
- Analytics dashboard
- Manage services (Create, Read, Update, Delete)
- Manage decorators (assign/remove decorator role)
- Manage all bookings
- Assign decorators to bookings# StyleDecor — Smart Home & Ceremony Decoration Booking System

## Purpose

StyleDecor is a modern appointment management system for a local decoration company. Users can explore decoration packages, check decorator availability, select a date and time, make payments, and track their service status in real time. It solves the common problems of walk-in crowds, lack of online booking, and difficulty managing multiple decorators and on-site services.

## Live URL

🌐 [https://style-decor-client-five.vercel.app](https://style-decor-client-five.vercel.app)

## Key Features

- Browse decoration services with search, category filter, and budget range filter
- Animated hero section with Framer Motion
- Service details page with Book Now modal (pre-filled user info)
- Stripe payment integration with payment receipt
- Role-based dashboard: User, Admin, Decorator
- **User Dashboard:** My Profile, My Bookings (cancel/pay), Payment History
- **Admin Dashboard:** Manage Services, Manage Decorators, Manage Bookings, Assign Decorator, Revenue & Analytics Charts
- **Decorator Dashboard:** My Projects, Today's Schedule, Update Project Status, Earnings Summary
- JWT authentication on all protected routes
- Firebase email/password and social login
- Service Coverage Map using React Leaflet
- Top Decorators section with ratings and specialties
- Mobile responsive layout with DaisyUI
- Toast notifications and loading spinners throughout

## NPM Packages Used

### Dependencies
| Package | Purpose |
|---|---|
| `react` | Core UI library |
| `react-dom` | DOM rendering |
| `react-router-dom` | Client-side routing |
| `firebase` | Authentication (email/password, Google) |
| `axios` | HTTP requests to the server |
| `framer-motion` | Animations and transitions |
| `@stripe/react-stripe-js` | Stripe payment UI components |
| `@stripe/stripe-js` | Stripe JS SDK |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon library |
| `react-leaflet` | Interactive service coverage map |
| `leaflet` | Map engine (peer dependency) |
| `recharts` | Analytics charts in admin dashboard |
| `sweetalert2` | Confirmation dialogs (e.g. cancel booking) |
| `swiper` | Hero section image slider |
| `@number-flow/react` | Animated number counters |

### Dev Dependencies
| Package | Purpose |
|---|---|
| `vite` | Build tool and dev server |
| `@vitejs/plugin-react` | React support for Vite |
| `tailwindcss` | Utility-first CSS framework |
| `daisyui` | Tailwind component library |
| `postcss` | CSS processing |
| `autoprefixer` | CSS vendor prefixes |
| `eslint` | Code linting |

## Environment Variables

Create a `.env.local` file in the root with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_API_URL=
```

## Admin Credentials

- **Email:** vtimely46@gmail.com
- **Password:** victor@555

### Decorator
- View assigned projects
- Today's schedule
- Update project status (Assigned → Planning → Materials Prepared → On the Way → Setup in Progress → Completed)
- View earnings

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS + DaisyUI | Styling and UI components |
| Framer Motion | Animations |
| Firebase Auth | Authentication (Email + Google) |
| Axios | API calls |
| React Router DOM | Client-side routing |
| Stripe.js | Payment processing |
| React Leaflet | Service coverage map |
| Swiper.js | Hero image slider |
| React Icons | Icon library |
| React Hot Toast | Notifications |
| SweetAlert2 | Popup modals |

