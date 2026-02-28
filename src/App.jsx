import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/Services/ServiceDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/User/Profile";
import MyBookings from "./pages/Dashboard/User/MyBookings";
import PaymentHistory from "./pages/Dashboard/User/PaymentHistory";
import ManageServices from "./pages/Dashboard/Admin/ManageServices";
import ManageDecorators from "./pages/Dashboard/Admin/ManageDecorators";
import ManageBookings from "./pages/Dashboard/Admin/ManageBookings";
import AssignDecorator from "./pages/Dashboard/Admin/AssignDecorator";
import Analytics from "./pages/Dashboard/Admin/Analytics";
import MyProjects from "./pages/Dashboard/Decorator/MyProjects";
import TodaySchedule from "./pages/Dashboard/Decorator/TodaySchedule";
import UpdateStatus from "./pages/Dashboard/Decorator/UpdateStatus";
import Earnings from "./pages/Dashboard/Decorator/Earnings";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import DecoratorRoute from "./routes/DecoratorRoute";
import Payment from "./pages/Dashboard/User/Payment"

const router = createBrowserRouter([

  // ─── Public Routes (with Navbar + Footer) ────────────
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/services", element: <Services /> },
      { path: "/services/:id", element: <ServiceDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ─── Dashboard (Private, no Footer) ──────────────────
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { path: "user/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
      { path: "user/bookings", element: <PrivateRoute><MyBookings /></PrivateRoute> },
      { path: "user/payment-history", element: <PrivateRoute><PaymentHistory /></PrivateRoute> },
      { path: "user/payment/:bookingId",element: (<PrivateRoute><Payment /></PrivateRoute>),},
      { path: "admin/manage-services", element: <AdminRoute><ManageServices /></AdminRoute> },
      { path: "admin/manage-decorators", element: <AdminRoute><ManageDecorators /></AdminRoute> },
      { path: "admin/manage-bookings", element: <AdminRoute><ManageBookings /></AdminRoute> },
      { path: "admin/assign-decorator", element: <AdminRoute><AssignDecorator /></AdminRoute> },
      { path: "admin/analytics", element: <AdminRoute><Analytics /></AdminRoute> },
      { path: "decorator/projects", element: <DecoratorRoute><MyProjects /></DecoratorRoute> },
      { path: "decorator/schedule", element: <DecoratorRoute><TodaySchedule /></DecoratorRoute> },
      { path: "decorator/update-status", element: <DecoratorRoute><UpdateStatus /></DecoratorRoute> },
      { path: "decorator/earnings", element: <DecoratorRoute><Earnings /></DecoratorRoute> },
    ],
  },

  // ─── 404 ─────────────────────────────────────────────
  { path: "*", element: <ErrorPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;