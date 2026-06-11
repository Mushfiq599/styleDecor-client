import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import useRole from "../../hooks/useRole"
import toast from "react-hot-toast"
import { HiMenuAlt3, HiX, HiMoon, HiSun, HiChevronDown } from "react-icons/hi"
import { MdDashboard } from "react-icons/md"
import { HiArrowRightOnRectangle } from "react-icons/hi2"
import { useTheme } from "../../context/ThemeContext"

const navLinks = [
  { to: "/",        label: "Home"     },
  { to: "/services",label: "Explore" },
  { to: "/about",   label: "About"    },
  { to: "/blog",    label: "Blog"     },
  { to: "/contact", label: "Contact"  },
]

const Navbar = () => {
  const { user, logout }    = useAuth()
  const [role]              = useRole()
  const { theme, toggleTheme } = useTheme()
  const navigate            = useNavigate()

  const [menuOpen, setMenuOpen]       = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return
    const handler = (e) => {
      if (!e.target.closest("#profile-menu")) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [profileOpen])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out!")
      navigate("/")
      setProfileOpen(false)
      setMenuOpen(false)
    } catch {
      toast.error("Logout failed!")
    }
  }

  const displayPhoto =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D9488&color=fff&size=100`

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-300 transition-all duration-300`}>
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="StyleDecor Logo" className="w-8 h-8" />
            <span className="font-heading font-bold text-lg text-base-content">
              Style<span className="text-primary">Decor</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content/70 hover:text-base-content transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>

            {user ? (
              /* Profile dropdown */
              <div id="profile-menu" className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-base-200 transition-all duration-200"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={displayPhoto}
                    alt="profile"
                    className="w-8 h-8 rounded-xl object-cover border-2 border-primary/20 flex-shrink-0"
                  />
                  <span className="hidden sm:block font-body text-sm font-medium text-base-content max-w-[100px] truncate">
                    {user.displayName?.split(" ")[0]}
                  </span>
                  <HiChevronDown
                    size={14}
                    className={`text-base-content/50 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-base-300 bg-base-200/50">
                        <p className="font-body font-semibold text-sm text-base-content truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="font-body text-xs text-base-content/50 truncate">{user.email}</p>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body font-medium capitalize">
                          {role || "user"}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors"
                        >
                          <MdDashboard size={16} className="text-primary" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/user/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors"
                        >
                          <img src={displayPhoto} alt="" className="w-4 h-4 rounded-full" />
                          My Profile
                        </Link>
                        <div className="border-t border-base-300 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <HiArrowRightOnRectangle size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl font-body text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content transition-all duration-200"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-base-100/95 backdrop-blur-xl border-t border-base-300"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="border-t border-base-300 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      <MdDashboard size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <HiArrowRightOnRectangle size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-base-300 font-body text-sm font-medium text-base-content hover:border-primary transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar