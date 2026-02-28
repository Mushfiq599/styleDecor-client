import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import useAuth from "../../../hooks/useAuth"

const statusFlow = [
  { key: "assigned", label: "Assigned", icon: "📌" },
  { key: "planning", label: "Planning Phase", icon: "📝" },
  { key: "materials_prepared", label: "Materials Prepared", icon: "📦" },
  { key: "on_the_way", label: "On The Way", icon: "🚗" },
  { key: "setup_in_progress", label: "Setup In Progress", icon: "🔧" },
  { key: "completed", label: "Completed", icon: "✅" },
]

const UpdateStatus = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings")
      const mine = res.data.filter(
        (b) =>
          b.assignedDecorator === user?.email &&
          b.status !== "completed" &&
          b.status !== "cancelled"
      )
      setProjects(mine)
    } catch (error) {
      toast.error("Failed to load projects!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) fetchProjects()
  }, [user])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdating(bookingId)
    try {
      await axios.patch(
        `http://localhost:5000/bookings/status/${bookingId}`,
        { status: newStatus }
      )
      toast.success("Status updated successfully!")
      fetchProjects()
    } catch (error) {
      toast.error("Failed to update status!")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">
          Update Project Status
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Update the status of your active projects step by step
        </p>
      </div>

      {/* Status Flow Guide */}
      <div className="glass-card p-5 mb-6">
        <p className="font-body text-xs text-base-content/50 uppercase tracking-wider mb-3">
          Status Flow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {statusFlow.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200 font-body text-xs text-base-content/70">
                {step.icon} {step.label}
              </span>
              {i < statusFlow.length - 1 && (
                <span className="text-base-content/30 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <span className="text-6xl block mb-4">✨</span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No active projects
          </h3>
          <p className="font-body text-sm text-base-content/60">
            You have no active projects to update right now.
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => {
            const currentIndex = statusFlow.findIndex(
              (s) => s.key === project.status
            )
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6"
              >
                {/* Project Info */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-300">
                  <img
                    src={project.serviceImage || "https://placehold.co/60"}
                    alt={project.serviceName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-base text-base-content">
                      {project.serviceName}
                    </h3>
                    <p className="font-body text-xs text-base-content/60">
                      👤 {project.userName} · 📅 {project.bookingDate}
                    </p>
                  </div>
                </div>

                {/* Status Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {statusFlow.map((step, stepIndex) => {
                    const isPast = stepIndex < currentIndex
                    const isCurrent = stepIndex === currentIndex
                    const isNext = stepIndex === currentIndex + 1
                    const isFuture = stepIndex > currentIndex + 1

                    return (
                      <button
                        key={step.key}
                        onClick={() =>
                          isNext && handleStatusUpdate(project._id, step.key)
                        }
                        disabled={!isNext || updating === project._id}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200 ${isPast
                            ? "bg-primary/10 text-primary cursor-default"
                            : isCurrent
                              ? "bg-primary text-white shadow-lg shadow-primary/20 cursor-default"
                              : isNext
                                ? "bg-base-200 text-base-content hover:bg-secondary hover:text-white cursor-pointer border-2 border-dashed border-secondary/50"
                                : "bg-base-200/50 text-base-content/30 cursor-default"
                          }`}
                      >
                        <span className="text-xl">{step.icon}</span>
                        <span className="font-body text-xs font-medium text-center leading-tight">
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="font-body text-xs opacity-70">
                            Current
                          </span>
                        )}
                        {isNext && (
                          <span className="font-body text-xs opacity-70">
                            Click to update
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UpdateStatus