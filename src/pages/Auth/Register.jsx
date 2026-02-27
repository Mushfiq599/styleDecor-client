import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import axios from "axios"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff, HiArrowRight } from "react-icons/hi"

const Register = () => {
  const { register, googleLogin, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Save user to our MongoDB after Firebase registration
  const saveUserToDB = async (email, name, photo) => {
    await axios.post("http://localhost:5000/users", { email, name, photo })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { name, email, password, photoURL } = formData

    // Basic validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters!")
    }
    if (!/[A-Z]/.test(password)) {
      return toast.error("Password must contain at least one uppercase letter!")
    }

    setLoading(true)
    try {
      // 1. Create user in Firebase
      await register(email, password)

      // 2. Update display name and photo in Firebase
      await updateUserProfile(name, photoURL)

      // 3. Save user to our MongoDB database
      await saveUserToDB(email, name, photoURL)

      toast.success("Account created successfully! 🎉")
      navigate("/")
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use!")
      } else {
        toast.error("Registration failed. Try again!")
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

      // Save to MongoDB (if already exists it just returns existing user)
      await saveUserToDB(email, displayName, photoURL)

      toast.success("Welcome to StyleDecor! 🎉")
      navigate("/")
    } catch (error) {
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
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80"
          alt="decoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-black/60" />
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
              Join Our Decoration
              <br />
              Community Today
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed">
              Book expert decorators, track your projects, and transform your space with just a few clicks.
            </p>

            {/* Feature list */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Browse 50+ decoration services",
                "Book & pay securely online",
                "Track your project in real time",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-body text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Side — Register Form ── */}
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
              Create Account
            </h1>
            <p className="font-body text-base-content/60 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
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
            <span className="font-body text-xs text-base-content/40">or register with email</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
            </div>

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

            {/* Photo URL */}
            <div>
              <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Photo URL{" "}
                <span className="text-base-content/40 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars, one uppercase"
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
                  Create Account
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

export default Register