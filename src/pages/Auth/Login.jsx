import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import axios from "axios"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff, HiArrowRight } from "react-icons/hi"

const Login = () => {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // If user was redirected from a private route, send them back there after login
  const from = location.state?.from?.pathname || "/"

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const saveUserToDB = async (email, name, photo) => {
    await axios.post("http://localhost:5000/users", { email, name, photo })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = formData

    setLoading(true)
    try {
      await login(email, password)
      toast.success("Welcome back! 👋")
      navigate(from, { replace: true })
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password!")
      } else {
        toast.error("Login failed. Try again!")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
  setLoading(true)
  try {
    const result = await googleLogin()
    const { email, displayName, photoURL } = result.user

    // Save to DB separately — even if this fails, login still works
    try {
      await saveUserToDB(email, displayName, photoURL)
    } catch (dbError) {
      console.error("DB save error:", dbError)
    }

    toast.success("Welcome back! 👋")
    navigate(from, { replace: true })
  } catch (error) {
    console.error(error)
    toast.error("Google login failed!")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex">

      {/* ── Left Side — Decorative Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
          alt="decoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-primary/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">S</span>
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                StyleDecor
              </span>
            </Link>
            <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
              Welcome Back
              <br />
              To StyleDecor
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed">
              Sign in to manage your bookings, track your decoration projects and connect with our expert team.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Happy Clients" },
                { value: "1200+", label: "Projects Done" },
                { value: "50+", label: "Expert Decorators" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <p className="font-heading font-bold text-2xl text-white">
                    {stat.value}
                  </p>
                  <p className="font-body text-white/60 text-xs mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Side — Login Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-base-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-base-content">
                Style<span className="text-primary">Decor</span>
              </span>
            </Link>
            <h1 className="font-heading text-3xl font-bold text-base-content mb-2">
              Sign In
            </h1>
            <p className="font-body text-base-content/60 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-base-300 hover:border-primary hover:bg-primary/5 font-body font-medium text-sm text-base-content transition-all duration-300 mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-base-300" />
            <span className="font-body text-xs text-base-content/40">or sign in with email</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-sm font-medium text-base-content">
                  Password
                </label>
                <a href="#" className="font-body text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  Sign In
                  <HiArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  )
}

export default Login