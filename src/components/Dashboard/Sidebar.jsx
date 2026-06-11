import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import useRole from "../../hooks/useRole"
import toast from "react-hot-toast"
import { HiX, HiHome, HiLogout } from "react-icons/hi"
import { MdSpaceDashboard } from "react-icons/md"
import { CgNotes, CgProfile } from "react-icons/cg"
import { TbBrandCashapp } from "react-icons/tb"
import { RiAdminLine } from "react-icons/ri"
import {
  HiUsers, HiCollection, HiChartBar, HiCog,
} from "react-icons/hi"
import { BsCalendarCheck } from "react-icons/bs"
import { FaPeopleCarry, FaTasks } from "react-icons/fa"
import { IoAnalytics } from "react-icons/io5"

/* ── nav item ────────────────────────────────────────────────── */
const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    end={to.endsWith("/dashboard")}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-primary text-white shadow-lg shadow-primary/20"
          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
      }`
    }
  >
    <span className="flex-shrink-0 text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

/* ── section label ───────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="font-body text-xs font-semibold text-base-content/30 uppercase tracking-widest px-4 pt-4 pb-1">
    {children}
  </p>
)

/* ── main ────────────────────────────────────────────────────── */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const [role]           = useRole()
  const navigate         = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out!")
      navigate("/")
    } catch {
      toast.error("Logout failed!")
    }
  }

  const close = () => onClose?.()

  /* ── menus per role ── */
  const adminMenu = [
    { to: "/dashboard",                         icon: <MdSpaceDashboard />, label: "Overview" },
    { to: "/dashboard/admin/analytics",         icon: <IoAnalytics />,      label: "Analytics" },
    { to: "/dashboard/admin/manage-services",   icon: <HiCollection />,     label: "Manage Services" },
    { to: "/dashboard/admin/manage-decorators", icon: <FaPeopleCarry />,    label: "Manage Decorators" },
    { to: "/dashboard/admin/manage-users",      icon: <HiUsers />,          label: "Manage Users" },
    { to: "/dashboard/admin/manage-bookings",   icon: <CgNotes />,          label: "Manage Bookings" },
    { to: "/dashboard/admin/assign-decorator",  icon: <RiAdminLine />,      label: "Assign Decorator" },
  ]

  const userMenu = [
    { to: "/dashboard",                        icon: <MdSpaceDashboard />, label: "Overview" },
    { to: "/dashboard/user/bookings",          icon: <CgNotes />,          label: "My Bookings" },
    { to: "/dashboard/user/payment-history",   icon: <TbBrandCashapp />,   label: "Payment History" },
    { to: "/dashboard/user/profile",           icon: <CgProfile />,        label: "Profile" },
  ]

  const decoratorMenu = [
    { to: "/dashboard",                         icon: <MdSpaceDashboard />, label: "Overview" },
    { to: "/dashboard/decorator/projects",      icon: <FaTasks />,          label: "My Projects" },
    { to: "/dashboard/decorator/schedule",      icon: <BsCalendarCheck />,  label: "Today's Schedule" },
    { to: "/dashboard/decorator/update-status", icon: <HiChartBar />,       label: "Update Status" },
    { to: "/dashboard/decorator/earnings",      icon: <TbBrandCashapp />,   label: "My Earnings" },
  ]

  const menu =
    role === "admin"     ? adminMenu
    : role === "decorator" ? decoratorMenu
    : userMenu

  const roleLabel =
    role === "admin"     ? "Admin Panel"
    : role === "decorator" ? "Decorator Panel"
    : "User Panel"

  /* ── sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-base-300">
        <NavLink to="/" className="flex items-center gap-2" onClick={close}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <img src="/logo.png" alt="StyleDecor Logo" className="w-8 h-8" />
          </div>
          <span className="font-heading font-bold text-lg text-base-content">
            Style<span className="text-primary">Decor</span>
          </span>
        </NavLink>
        <button
          onClick={close}
          className="lg:hidden w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-base-300 transition-colors"
        >
          <HiX size={16} />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D9488&color=fff`
            }
            alt="avatar"
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2 border-primary/20"
          />
          <div className="min-w-0">
            <p className="font-body font-semibold text-sm text-base-content truncate">
              {user?.displayName || "User"}
            </p>
            {/* FIX: show a neutral badge while role is still loading (null),
                instead of displaying "user" which was misleading for
                admin and decorator accounts. */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body font-medium capitalize">
              {role ?? "…"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <SectionLabel>{roleLabel}</SectionLabel>
        <div className="flex flex-col gap-1 mt-1">
          {menu.map((item) => (
            <NavItem key={item.to} {...item} onClick={close} />
          ))}
        </div>

        {/* Back to site */}
        <SectionLabel>Navigation</SectionLabel>
        <div className="flex flex-col gap-1 mt-1">
          <NavItem to="/"         icon={<HiHome />}       label="Back to Home"   onClick={close} />
          <NavItem to="/services" icon={<HiCollection />} label="Browse Services" onClick={close} />
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200"
        >
          <HiLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-base-100 border-r border-base-300 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-base-100 z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar