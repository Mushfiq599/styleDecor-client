import { useState } from "react"
import { motion } from "framer-motion"
import useAuth from "../../../hooks/useAuth"
import toast from "react-hot-toast"
import { HiPencil, HiCheck, HiX } from "react-icons/hi"
import { MdDone } from "react-icons/md";

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  })

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserProfile(formData.name, formData.photoURL)
      toast.success("Profile updated successfully!")
      setEditing(false)
    } catch (error) {
      toast.error("Failed to update profile!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-base-content">
            My Profile
          </h2>
          <p className="font-body text-sm text-base-content/60 mt-1">
            Manage your personal information
          </p>
        </div>
        <div className="glass-card p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-base-300">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0D9488&color=fff&size=200`
                }
                alt="profile"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/20"/>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-2 border-base-100 flex items-center justify-center">
                <span className="text-white text-xs"><MdDone /></span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-heading font-bold text-xl text-base-content">
                {user?.displayName || "User"}
              </h3>
              <p className="font-body text-sm text-base-content/60 mt-1">
                {user?.email}
              </p>
              <span className=" flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium">
                Verified Account <MdDone size={18}/>
              </span>
            </div>
          </div>
          {!editing ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs text-base-content/50 uppercase tracking-wider">
                  Full Name
                </label>
                <p className="font-body text-base text-base-content font-medium">
                  {user?.displayName || "Not set"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs text-base-content/50 uppercase tracking-wider">
                  Email Address
                </label>
                <p className="font-body text-base text-base-content font-medium">
                  {user?.email}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs text-base-content/50 uppercase tracking-wider">
                  Account Created
                </label>
                <p className="font-body text-base text-base-content font-medium">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "N/A"}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-4 self-start flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
                <HiPencil size={16} />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"/>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"/>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-60">
                  {loading
                    ? <span className="loading loading-spinner loading-xs" />
                    : <HiCheck size={16} />
                  }
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-base-200 text-base-content font-body font-medium text-sm rounded-xl hover:bg-base-300 transition-all duration-300">
                  <HiX size={16} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile