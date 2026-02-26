import { Link, NavLink } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { HiMenuAlt3, HiX } from "react-icons/hi"
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"

const Navbar = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    // Detect scroll to add background to navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (err) {
            console.error(err)
        }
    }

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "glass-card shadow-lg py-2"
                    : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-heading font-bold text-lg">S</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-heading font-bold text-xl text-base-content">
                                Style<span className="text-primary">Decor</span>
                            </span>
                            <span className="text-xs text-base-content/50 font-body tracking-widest uppercase">
                                Decoration Co.
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `relative px-4 py-2 font-body font-medium text-sm transition-all duration-300 rounded-lg group ${isActive
                                        ? "text-primary"
                                        : "text-base-content/70 hover:text-primary"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        {/* Animated underline */}
                                        <span
                                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${isActive ? "w-4" : "w-0 group-hover:w-4"
                                                }`}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* ── Right Side ── */}
                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-base-200 hover:bg-primary hover:text-white transition-all duration-300 text-base-content"
                            title="Toggle Theme"
                        >
                            {theme === "dark"
                                ? <MdOutlineLightMode size={18} />
                                : <MdOutlineDarkMode size={18} />
                            }
                        </button>

                        {/* Auth Section */}
                        {user ? (
                            // Profile Dropdown
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary cursor-pointer hover:scale-110 transition-transform duration-300"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=0D9488&color=fff`}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content glass-card mt-3 z-50 p-2 shadow-xl w-52 flex flex-col gap-1"
                                >
                                    {/* User Info */}
                                    <li className="px-3 py-2 border-b border-base-300">
                                        <p className="font-body font-semibold text-sm text-base-content truncate">
                                            {user.displayName || "User"}
                                        </p>
                                        <p className="font-body text-xs text-base-content/50 truncate">
                                            {user.email}
                                        </p>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-base-content hover:bg-primary hover:text-white transition-all duration-200"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-secondary hover:bg-secondary hover:text-white transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            // Login Button
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-5 py-2 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-base-200 text-base-content"
                        >
                            {menuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="glass-card p-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg font-body font-medium text-sm transition-all duration-200 ${isActive
                                        ? "bg-primary text-white"
                                        : "text-base-content hover:bg-base-200"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {!user && (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 px-4 py-3 bg-primary text-white rounded-lg font-body font-medium text-sm text-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar