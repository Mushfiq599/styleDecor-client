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
- Assign decorators to bookings

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

