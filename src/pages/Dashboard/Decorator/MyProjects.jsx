import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import useAuth from "../../../hooks/useAuth"
import { HiCalendar, HiLocationMarker, HiUser } from "react-icons/hi"

const statusColors = {
  assigned: "bg-blue-500/10 text-blue-500",
  planning: "bg-purple-500/10 text-purple-500",
  materials_prepared: "bg-indigo-500/10 text-indigo-500",
  on_the_way: "bg-orange-500/10 text-orange-500",
  setup_in_progress: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-500",
}

const statusLabels = {
  assigned: "Assigned",
  planning: "Planning Phase",
  materials_prepared: "Materials Prepared",
  on_the_way: "On The Way",
  setup_in_progress: "Setup In Progress",
  completed: "Completed",
}

const nextStatus = {
  assigned: "planning",
  planning: "materials_prepared",
  materials_prepared: "on_the_way",
  on_the_way: "setup_in_progress",
  setup_in_progress: "completed",
}

const MyProjects = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchProjects = async () => {
    try {
      const res = await axiosSecure.get("/bookings")
      const myProjects = res.data.filter(
        (b) => b.assignedDecorator === user?.email
      )
      setProjects(myProjects)
    } catch (error) {
      toast.error("Failed to load projects!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) fetchProjects()
  }, [user])

  const handleStatusUpdate = async (bookingId, currentStatus) => {
    const next = nextStatus[currentStatus]
    if (!next) return
    setUpdating(bookingId)
    try {
      await axiosSecure.patch(
        `/bookings/status/${bookingId}`,
        { status: next }
      )
      toast.success(`Status updated to ${statusLabels[next]}!`)
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
          My Projects
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          All decoration projects assigned to you
        </p>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <span className="text-6xl block mb-4">🎨</span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No projects assigned yet
          </h3>
          <p className="font-body text-sm text-base-content/60">
            The admin will assign projects to you once customers make payments.
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <img
                  src={project.serviceImage || "https://placehold.co/100"}
                  alt={project.serviceName}
                  className="w-full sm:w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="font-heading font-semibold text-lg text-base-content">
                      {project.serviceName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${statusColors[project.status] || "bg-base-300 text-base-content/60"}`}>
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-1.5 font-body text-sm text-base-content/60">
                      <HiUser size={14} className="text-primary" />
                      {project.userName}
                    </span>
                    <span className="flex items-center gap-1.5 font-body text-sm text-base-content/60">
                      <HiCalendar size={14} className="text-primary" />
                      {project.bookingDate}
                    </span>
                    <span className="flex items-center gap-1.5 font-body text-sm text-base-content/60">
                      <HiLocationMarker size={14} className="text-primary" />
                      {project.location}
                    </span>
                  </div>

                  {/* Progress Steps */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {Object.entries(statusLabels).map(([key, label], index) => {
                        const statuses = Object.keys(statusLabels)
                        const currentIndex = statuses.indexOf(project.status)
                        const stepIndex = statuses.indexOf(key)
                        const isDone = stepIndex <= currentIndex
                        return (
                          <div key={key} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${isDone ? "bg-primary" : "bg-base-300"}`} />
                            <span className={`font-body text-xs ${isDone ? "text-primary" : "text-base-content/40"}`}>
                              {label.split(" ")[0]}
                            </span>
                            {index < Object.keys(statusLabels).length - 1 && (
                              <div className={`w-4 h-px ${isDone ? "bg-primary" : "bg-base-300"}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Update Button */}
                  {nextStatus[project.status] && (
                    <button
                      onClick={() => handleStatusUpdate(project._id, project.status)}
                      disabled={updating === project._id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
                    >
                      {updating === project._id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <>
                          ➡️ Move to {statusLabels[nextStatus[project.status]]}
                        </>
                      )}
                    </button>
                  )}

                  {project.status === "completed" && (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-500 font-body font-medium text-sm rounded-xl">
                      ✅ Project Completed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProjects