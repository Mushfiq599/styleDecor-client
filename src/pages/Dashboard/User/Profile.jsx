import { useState, useRef } from "react"
import { motion } from "framer-motion"
import useAuth from "../../../hooks/useAuth"
import axios from "axios"
import toast from "react-hot-toast"
import { HiPencil, HiCheck, HiX, HiPhotograph, HiEye, HiEyeOff } from "react-icons/hi"
import { FaCheck } from "react-icons/fa"
import { MdDone } from "react-icons/md"
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { auth } from "../../../firebase.config"

const IMAGEBB_API_KEY = import.meta.env.VITE_IMAGEBB_API_KEY

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [editing, setEditing]             = useState(false)
  const [loading, setLoading]             = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview]   = useState(null)
  const [formData, setFormData] = useState({
    name:     user?.displayName || "",
    photoURL: user?.photoURL || "",
  })

  // Password section
  const [pwSection, setPwSection] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [pwData, setPwData] = useState({ current: "", newPw: "", confirm: "" })
  const [pwErrors, setPwErrors] = useState({})

  /* ── Image upload ── */
  const handleImageChange = async (e) => {
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
      setFormData((prev) => ({ ...prev, photoURL: user?.photoURL || "" }))
    } finally {
      setImageUploading(false)
    }
  }

  /* ── Profile update ── */
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (imageUploading) return toast.error("Please wait for image upload to finish!")
    setLoading(true)
    try {
      await updateUserProfile(formData.name, formData.photoURL)
      toast.success("Profile updated successfully!")
      setEditing(false)
      setImagePreview(null)
    } catch {
      toast.error("Failed to update profile!")
    } finally {
      setLoading(false)
    }
  }

  /* ── Password validation ── */
  const validatePw = () => {
    const e = {}
    if (!pwData.current) e.current = "Current password is required"
    if (pwData.newPw.length < 6) e.newPw = "Password must be at least 6 characters"
    if (!/[A-Z]/.test(pwData.newPw)) e.newPw = "Must include at least one uppercase letter"
    if (pwData.newPw !== pwData.confirm) e.confirm = "Passwords do not match"
    setPwErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Password change ── */
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!validatePw()) return
    setPwLoading(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, pwData.current)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, pwData.newPw)
      toast.success("Password updated successfully!")
      setPwSection(false)
      setPwData({ current: "", newPw: "", confirm: "" })
      setPwErrors({})
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect!")
      } else {
        toast.error("Failed to update password!")
      }
    } finally {
      setPwLoading(false)
    }
  }

  const displayPhoto =
    imagePreview ||
    formData.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D9488&color=fff&size=200`

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-base-content">My Profile</h2>
          <p className="font-body text-sm text-base-content/60 mt-1">Manage your personal information</p>
        </div>

        {/* ── Profile card ── */}
        <div className="glass-card p-8 mb-6">
          {/* Avatar + info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-base-300">
            <div className="relative flex-shrink-0">
              <img
                src={displayPhoto}
                alt="profile"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/20"
              />
              {editing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  title="Change photo"
                >
                  <HiPhotograph size={14} />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {!editing && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-2 border-base-100 flex items-center justify-center">
                  <MdDone className="text-white" size={14} />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-heading font-bold text-xl text-base-content">
                {user?.displayName || "User"}
              </h3>
              <p className="font-body text-sm text-base-content/60 mt-1">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium">
                Verified Account <MdDone size={14} />
              </span>
              {imageUploading && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="loading loading-spinner loading-xs text-primary" />
                  <span className="font-body text-xs text-base-content/60">Uploading photo...</span>
                </div>
              )}
            </div>
          </div>

          {/* View / Edit */}
          {!editing ? (
            <div className="flex flex-col gap-4">
              {[
                { label: "Full Name",       value: user?.displayName || "Not set" },
                { label: "Email Address",   value: user?.email },
                {
                  label: "Account Created",
                  value: user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : "N/A",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label className="font-body text-xs text-base-content/50 uppercase tracking-wider">{f.label}</label>
                  <p className="font-body text-base text-base-content font-medium mt-0.5">{f.value}</p>
                </div>
              ))}
              <button
                onClick={() => setEditing(true)}
                className="mt-4 self-start flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                <HiPencil size={16} />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="profile-name" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                  Profile Photo
                  {imagePreview && formData.photoURL && !imageUploading && (
                    <span className="ml-2 text-green-500 text-xs font-normal inline-flex items-center gap-1">
                      <FaCheck size={10} /> Uploaded
                    </span>
                  )}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200 border-2 border-dashed border-base-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-300"
                >
                  <HiPhotograph size={20} className="text-base-content/40" />
                  <span className="font-body text-sm text-base-content/40">
                    {imageUploading ? "Uploading..." : "Click to change photo"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? <span className="loading loading-spinner loading-xs" /> : <HiCheck size={16} />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setImagePreview(null) }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-base-200 text-base-content font-body font-medium text-sm rounded-xl hover:bg-base-300 transition-all duration-300"
                >
                  <HiX size={16} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Password Change ── */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-base-content">Change Password</h3>
              <p className="font-body text-xs text-base-content/50 mt-0.5">Update your account password</p>
            </div>
            <button
              onClick={() => { setPwSection(!pwSection); setPwErrors({}) }}
              className="flex items-center gap-1 px-4 py-2 text-sm font-body font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/10 transition-all duration-200"
            >
              <HiPencil size={14} />
              {pwSection ? "Cancel" : "Change"}
            </button>
          </div>

          {pwSection && (
            <form onSubmit={handlePasswordChange} noValidate className="flex flex-col gap-4">
              {/* Current */}
              <div>
                <label htmlFor="pw-current" className="font-body text-sm font-medium text-base-content mb-1.5 block">Current Password</label>
                <div className="relative">
                  <input
                    id="pw-current"
                    type={showCurrent ? "text" : "password"}
                    value={pwData.current}
                    onChange={(e) => setPwData({ ...pwData, current: e.target.value })}
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content transition-all duration-300 ${pwErrors.current ? "border-red-500" : "border-transparent focus:border-primary"}`}
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary">
                    {showCurrent ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
                {pwErrors.current && <p className="font-body text-xs text-red-500 mt-1">{pwErrors.current}</p>}
              </div>

              {/* New */}
              <div>
                <label htmlFor="pw-new" className="font-body text-sm font-medium text-base-content mb-1.5 block">New Password</label>
                <div className="relative">
                  <input
                    id="pw-new"
                    type={showNew ? "text" : "password"}
                    value={pwData.newPw}
                    onChange={(e) => setPwData({ ...pwData, newPw: e.target.value })}
                    placeholder="Min 6 chars, one uppercase"
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content transition-all duration-300 ${pwErrors.newPw ? "border-red-500" : "border-transparent focus:border-primary"}`}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary">
                    {showNew ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
                {pwErrors.newPw && <p className="font-body text-xs text-red-500 mt-1">{pwErrors.newPw}</p>}
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="pw-confirm" className="font-body text-sm font-medium text-base-content mb-1.5 block">Confirm New Password</label>
                <input
                  id="pw-confirm"
                  type="password"
                  value={pwData.confirm}
                  onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content transition-all duration-300 ${pwErrors.confirm ? "border-red-500" : "border-transparent focus:border-primary"}`}
                />
                {pwErrors.confirm && <p className="font-body text-xs text-red-500 mt-1">{pwErrors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="self-start flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-60"
              >
                {pwLoading ? <span className="loading loading-spinner loading-xs" /> : <HiCheck size={16} />}
                Update Password
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile