import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import PrivateRoute from "./routes/PrivateRoute"
import AdminRoute from "./routes/AdminRoute"
import DecoratorRoute from "./routes/DecoratorRoute"

// Full-page spinner while a lazy chunk loads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <span className="loading loading-spinner loading-lg text-primary" />
  </div>
)

// ── Public pages ──────────────────────────────────────────────
const Home            = lazy(() => import("./pages/Home/Home"))
const Services        = lazy(() => import("./pages/Services/Services"))
const ServiceDetails  = lazy(() => import("./pages/Services/ServiceDetails"))
const Login           = lazy(() => import("./pages/Auth/Login"))
const Register        = lazy(() => import("./pages/Auth/Register"))
const About           = lazy(() => import("./pages/About"))
const Contact         = lazy(() => import("./pages/Contact"))
const Blog            = lazy(() => import("./pages/Blog"))
const ErrorPage       = lazy(() => import("./pages/ErrorPage"))

// ── Dashboard shell ───────────────────────────────────────────
const Dashboard           = lazy(() => import("./pages/Dashboard/Dashboard"))
const DashboardOverview   = lazy(() => import("./pages/Dashboard/DashboardOverview"))

// ── User dashboard ────────────────────────────────────────────
const Profile        = lazy(() => import("./pages/Dashboard/User/Profile"))
const MyBookings     = lazy(() => import("./pages/Dashboard/User/MyBookings"))
const PaymentHistory = lazy(() => import("./pages/Dashboard/User/PaymentHistory"))
const Payment        = lazy(() => import("./pages/Dashboard/User/Payment"))

// ── Admin dashboard ───────────────────────────────────────────
const Analytics       = lazy(() => import("./pages/Dashboard/Admin/Analytics"))
const ManageServices  = lazy(() => import("./pages/Dashboard/Admin/ManageServices"))
const ManageDecorators= lazy(() => import("./pages/Dashboard/Admin/ManageDecorators"))
const ManageUsers     = lazy(() => import("./pages/Dashboard/Admin/ManageUsers"))
const ManageBookings  = lazy(() => import("./pages/Dashboard/Admin/ManageBookings"))
const AssignDecorator = lazy(() => import("./pages/Dashboard/Admin/AssignDecorator"))

// ── Decorator dashboard ───────────────────────────────────────
const MyProjects     = lazy(() => import("./pages/Dashboard/Decorator/MyProjects"))
const TodaySchedule  = lazy(() => import("./pages/Dashboard/Decorator/TodaySchedule"))
const UpdateStatus   = lazy(() => import("./pages/Dashboard/Decorator/UpdateStatus"))
const Earnings       = lazy(() => import("./pages/Dashboard/Decorator/Earnings"))

const router = createBrowserRouter([
  // ── Public layout ──
  {
    element: <MainLayout />,
    children: [
      { path: "/",               element: <Home /> },
      { path: "/services",       element: <Services /> },
      { path: "/services/:id",   element: <ServiceDetails /> },
      { path: "/login",          element: <Login /> },
      { path: "/register",       element: <Register /> },
      { path: "/about",          element: <About /> },
      { path: "/contact",        element: <Contact /> },
      { path: "/blog",           element: <Blog /> },
    ],
  },

  // ── Dashboard layout ──
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      // Default landing
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardOverview />
          </PrivateRoute>
        ),
      },

      // User
      { path: "user/profile",         element: <PrivateRoute><Profile /></PrivateRoute> },
      { path: "user/bookings",         element: <PrivateRoute><MyBookings /></PrivateRoute> },
      { path: "user/payment-history",  element: <PrivateRoute><PaymentHistory /></PrivateRoute> },
      { path: "user/payment/:bookingId", element: <PrivateRoute><Payment /></PrivateRoute> },

      // Admin
      { path: "admin/analytics",        element: <AdminRoute><Analytics /></AdminRoute> },
      { path: "admin/manage-services",  element: <AdminRoute><ManageServices /></AdminRoute> },
      { path: "admin/manage-decorators",element: <AdminRoute><ManageDecorators /></AdminRoute> },
      { path: "admin/manage-users",     element: <AdminRoute><ManageUsers /></AdminRoute> },
      { path: "admin/manage-bookings",  element: <AdminRoute><ManageBookings /></AdminRoute> },
      { path: "admin/assign-decorator", element: <AdminRoute><AssignDecorator /></AdminRoute> },

      // Decorator
      { path: "decorator/projects",      element: <DecoratorRoute><MyProjects /></DecoratorRoute> },
      { path: "decorator/schedule",      element: <DecoratorRoute><TodaySchedule /></DecoratorRoute> },
      { path: "decorator/update-status", element: <DecoratorRoute><UpdateStatus /></DecoratorRoute> },
      { path: "decorator/earnings",      element: <DecoratorRoute><Earnings /></DecoratorRoute> },
    ],
  },

  // ── 404 ──
  { path: "*", element: <ErrorPage /> },
])

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
)

export default App