import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import useRole from "../../hooks/useRole"
import toast from "react-hot-toast"
import {
    HiX,
    HiHome,
    HiUser,
    HiCalendar,
    HiCreditCard,
    HiCog,
    HiLogout,
    HiChartBar,
    HiUsers,
    HiCollection,
    HiClipboardList,
    HiLocationMarker,
    HiClock,
    HiCurrencyDollar,
} from "react-icons/hi"

const userLinks = [
    { name: "My Profile", path: "/dashboard/user/profile", icon: HiUser },
    { name: "My Bookings", path: "/dashboard/user/bookings", icon: HiCalendar },
    { name: "Payment History", path: "/dashboard/user/payment-history", icon: HiCreditCard },
]

const adminLinks = [
    { name: "Analytics", path: "/dashboard/admin/analytics", icon: HiChartBar },
    { name: "Manage Services", path: "/dashboard/admin/manage-services", icon: HiCollection },
    { name: "Manage Decorators", path: "/dashboard/admin/manage-decorators", icon: HiUsers },
    { name: "Manage Bookings", path: "/dashboard/admin/manage-bookings", icon: HiClipboardList },
    { name: "Assign Decorator", path: "/dashboard/admin/assign-decorator", icon: HiLocationMarker },
]

const decoratorLinks = [
    { name: "My Projects", path: "/dashboard/decorator/projects", icon: HiCollection },
    { name: "Today's Schedule", path: "/dashboard/decorator/schedule", icon: HiClock },
    { name: "Update Status", path: "/dashboard/decorator/update-status", icon: HiCog },
    { name: "Earnings", path: "/dashboard/decorator/earnings", icon: HiCurrencyDollar },
]

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth()
    const [role, roleLoading] = useRole()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully!")
            navigate("/")
        } catch (error) {
            toast.error("Logout failed!")
        }
    }
    const getLinks = () => {
        if (role === "admin") return adminLinks
        if (role === "decorator") return decoratorLinks
        return userLinks
    }

    const getRoleBadgeColor = () => {
        if (role === "admin") return "bg-secondary/10 text-secondary"
        if (role === "decorator") return "bg-primary/10 text-primary"
        return "bg-base-300 text-base-content/60"
    }

    const sidebarContent = (
        <div className="h-full flex flex-col bg-base-100 border-r border-base-300">
            <div className="p-6 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <img src="./logo.png" alt="Logo" className="rounded-lg"/>
                        </div>
                        <span className="font-heading font-bold text-lg text-base-content">
                            Style<span className="text-primary">Decor</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-base-content/50 hover:text-base-content">
                        <HiX size={20} />
                    </button>
                </div>
            </div>
            <div className="p-4 border-b border-base-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200">
                    <img
                        src={
                            user?.photoURL ||
                            `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0D9488&color=fff`}
                        alt="profile"
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-sm text-base-content truncate">
                            {user?.displayName || "User"}
                        </p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-body font-medium capitalize mt-0.5 ${getRoleBadgeColor()}`}>
                            {roleLoading ? "..." : role || "user"}
                        </span>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <p className="font-body text-xs text-base-content/40 uppercase tracking-widest mb-3 px-2">
                    {role === "admin" ? "Admin Panel" : role === "decorator" ? "Decorator Panel" : "My Account"}
                </p>
                <ul className="flex flex-col gap-1">
                    {getLinks().map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"}`}>
                                <link.icon size={18} />
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-base-300 my-4" />
                <ul className="flex flex-col gap-1">
                    <li>
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-all duration-200">
                            <HiHome size={18} />
                            Back to Home
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-base-300">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200">
                    <HiLogout size={18} />
                    Logout
                </button>
            </div>
        </div>
    )

    return (
        <>
            <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-30">
                {sidebarContent}
            </div>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed top-0 left-0 h-full w-64 z-30">
                        {sidebarContent}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Sidebar