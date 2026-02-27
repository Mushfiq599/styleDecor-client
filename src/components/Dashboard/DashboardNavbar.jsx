import { HiMenuAlt2, HiBell } from "react-icons/hi"
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"
import { useTheme } from "../../context/ThemeContext"
import useAuth from "../../hooks/useAuth"

const DashboardNavbar = ({ setSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-10 bg-base-100 border-b border-base-300 px-6 py-4">
            <div className="flex items-center justify-between">

                {/* Left — Mobile menu toggle + Page title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content hover:bg-base-300 transition-colors"
                    >
                        <HiMenuAlt2 size={20} />
                    </button>
                    <div>
                        <h1 className="font-heading font-bold text-lg text-base-content">
                            Dashboard
                        </h1>
                        <p className="font-body text-xs text-base-content/50">
                            Welcome back, {user?.displayName?.split(" ")[0] || "User"} 👋
                        </p>
                    </div>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-2">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-base-200 hover:bg-primary hover:text-white transition-all duration-300 text-base-content"
                    >
                        {theme === "dark"
                            ? <MdOutlineLightMode size={18} />
                            : <MdOutlineDarkMode size={18} />
                        }
                    </button>

                    {/* Notification Bell */}
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-base-200 hover:bg-base-300 transition-colors relative text-base-content">
                        <HiBell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full" />
                    </button>

                    {/* Avatar */}
                    <img
                        src={
                            user?.photoURL ||
                            `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0D9488&color=fff`
                        }
                        alt="profile"
                        className="w-9 h-9 rounded-xl object-cover border-2 border-primary/20"
                    />
                </div>

            </div>
        </header>
    )
}

export default DashboardNavbar