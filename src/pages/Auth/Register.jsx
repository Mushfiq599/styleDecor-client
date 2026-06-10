import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import axios from "axios"
import { API_URL } from "../../utils/apiUrl"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff, HiArrowRight, HiPhotograph, HiCheck } from "react-icons/hi"

const IMAGEBB_API_KEY = import.meta.env.VITE_IMAGEBB_API_KEY

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 6)              score++
  if (pw.length >= 10)             score++
  if (/[A-Z]/.test(pw))           score++
  if (/[0-9]/.test(pw))           score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500",    text: "text-red-500" }
  if (score <= 2) return { score, label: "Fair",   color: "bg-yellow-500", text: "text-yellow-500" }
  if (score <= 3) return { score, label: "Good",   color: "bg-blue-500",   text: "text-blue-500" }
  return          { score, label: "Strong", color: "bg-green-500",  text: "text-green-500" }
}

const Register = () => {
  const { register, googleLogin, updateUserProfile } = useAuth()
  const navigate  = useNavigate()
  const fileInputRef = useRef(null)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", photoURL: "",
  })
  const [errors, setErrors] = useState({})

  const strength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
    setImageUploading(true)
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`,
        fd
      )
      setFormData((prev) => ({ ...prev, photoURL: res.data.data.url }))
      toast.success("Photo uploaded!")
    } catch {
      toast.error("Image upload failed.")
      setImagePreview(null)
    } finally {
      setImageUploading(false)
    }
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim())              e.name     = "Full name is required"
    if (!formData.email)                    e.email    = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email"
    if (!formData.password)                 e.password = "Password is required"
    else if (formData.password.length < 6)  e.password = "Minimum 6 characters"
    else if (!/[A-Z]/.test(formData.password)) e.password = "Must include an uppercase letter"
    else if (!/[0-9]/.test(formData.password)) e.password = "Must include a number"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const saveUserToDB = async (email, name, photo) => {
    await axios.post(`${API_URL}/users`, { email, name, photo })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (imageUploading) return toast.error("Please wait for the image to finish uploading!")
    setLoading(true)
    try {
      const result = await register(formData.email, formData.password)
      await updateUserProfile(formData.name, formData.photoURL)
      await saveUserToDB(formData.email, formData.name, formData.photoURL)
      toast.success("Account created successfully! 🎉")
      navigate("/")
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use!")
        setErrors({ email: "This email is already registered" })
      } else {
        toast.error("Registration failed. Try again!")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    try {
      const result = await googleLogin()
      const { email, displayName, photoURL } = result.user
      try { await saveUserToDB(email, displayName, photoURL) } catch { /* silent */ }
      toast.success("Account created! 🎉")
      navigate("/")
    } catch {
      toast.error("Google sign-up failed!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
          alt="decoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-secondary/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img src="./logo.png" alt="Logo" className="rounded-lg" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">StyleDecor</span>
            </Link>
            <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
              Join StyleDecor<br />Today
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed mb-8">
              Create your account and start exploring premium decoration services for every occasion.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Access all decoration services",
                "Track your booking status in real-time",
                "Communicate with your assigned decorator",
                "Manage payments securely",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <HiCheck size={12} className="text-white" />
                  </div>
                  <span className="font-body text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-base-100 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-base-content">
                Style<span className="text-primary">Decor</span>
              </span>
            </Link>
            <h1 className="font-heading text-3xl font-bold text-base-content mb-2">Create Account</h1>
            <p className="font-body text-base-content/60 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-base-300 hover:border-primary hover:bg-primary/5 font-body font-medium text-sm text-base-content transition-all duration-300 mb-5"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-base-300" />
            <span className="font-body text-xs text-base-content/40">or register with email</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">

            {/* Avatar upload */}
            <div className="flex items-center gap-4">
              <div
                className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-dashed border-base-300 hover:border-primary cursor-pointer flex-shrink-0 transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-base-200">
                    <HiPhotograph size={20} className="text-base-content/30" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-base-content mb-1">Profile Photo</p>
                <p className="font-body text-xs text-base-content/50">
                  {imageUploading
                    ? "Uploading..."
                    : formData.photoURL
                    ? "✓ Photo ready"
                    : "Click avatar to upload (optional)"}
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.name ? "border-red-500" : "border-transparent focus:border-primary"}`}
              />
              {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.email ? "border-red-500" : "border-transparent focus:border-primary"}`}
              />
              {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars, uppercase & number"
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.password ? "border-red-500" : "border-transparent focus:border-primary"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="font-body text-xs text-red-500 mt-1">{errors.password}</p>}

              {/* Strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`font-body text-xs font-medium ${strength.text}`}>
                      {strength.label}
                    </p>
                    <p className="font-body text-xs text-base-content/40">
                      {strength.score < 3 ? "Add uppercase, numbers & symbols" : "Password looks good!"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || imageUploading}
              className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  Create Account
                  <HiArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

            <p className="font-body text-xs text-center text-base-content/40 mt-1">
              By creating an account, you agree to our{" "}
              <Link to="/blog" className="text-primary hover:underline">Terms</Link>{" "}
              and{" "}
              <Link to="/blog" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Register