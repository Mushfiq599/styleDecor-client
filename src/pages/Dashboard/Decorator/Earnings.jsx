import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import useAuth from "../../../hooks/useAuth"
import { HiCalendar, HiLocationMarker } from "react-icons/hi"

const Earnings = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bookings")
        const mine = res.data.filter(
          (b) => b.assignedDecorator === user?.email
        )
        setProjects(mine)
      } catch (error) {
        console.error("Failed to load earnings")
      } finally {
        setLoading(false)
      }
    }
    if (user?.email) fetchEarnings()
  }, [user])

  const completedProjects = projects.filter(p => p.status === "completed")
  const activeProjects = projects.filter(
    p => p.status !== "completed" && p.status !== "cancelled"
  )

  // Decorator earns 30% of service cost
  const COMMISSION = 0.30
  const totalEarned = completedProjects.reduce(
    (sum, p) => sum + (p.serviceCost * COMMISSION), 0
  )
  const pendingEarnings = activeProjects.reduce(
    (sum, p) => sum + (p.serviceCost * COMMISSION), 0
  )

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
          Earnings Summary
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Your earnings from completed decoration projects
        </p>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Earned",
            value: `৳${totalEarned.toLocaleString()}`,
            icon: "💰",
            color: "text-primary",
            bg: "bg-primary/5 border-primary/10",
          },
          {
            label: "Pending Earnings",
            value: `৳${pendingEarnings.toLocaleString()}`,
            icon: "⏳",
            color: "text-yellow-500",
            bg: "bg-yellow-500/5 border-yellow-500/10",
          },
          {
            label: "Projects Done",
            value: completedProjects.length,
            icon: "🏆",
            color: "text-green-500",
            bg: "bg-green-500/5 border-green-500/10",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 text-center border ${stat.bg}`}
          >
            <span className="text-4xl block mb-3">{stat.icon}</span>
            <p className={`font-heading font-bold text-3xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="font-body text-sm text-base-content/60 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Commission Info */}
      <div className="glass-card p-4 mb-6 flex items-center gap-3 border-l-4 border-primary">
        <span className="text-2xl">💡</span>
        <p className="font-body text-sm text-base-content/70">
          Your commission rate is <strong>30%</strong> of each project's service cost.
          Earnings are calculated upon project completion.
        </p>
      </div>

      {/* Project History */}
      <div>
        <h3 className="font-heading font-semibold text-lg text-base-content mb-4">
          Project History
        </h3>

        {projects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <span className="text-5xl block mb-3">📊</span>
            <p className="font-body text-base-content/60">
              No projects assigned yet
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                      Service Cost
                    </th>
                    <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                      Your Earnings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, i) => (
                    <motion.tr
                      key={project._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.serviceImage || "https://placehold.co/48"}
                            alt={project.serviceName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-body font-medium text-sm text-base-content">
                              {project.serviceName}
                            </p>
                            <p className="flex items-center gap-1 font-body text-xs text-base-content/50">
                              <HiLocationMarker size={10} />
                              {project.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 font-body text-sm text-base-content/60">
                          <HiCalendar size={14} />
                          {project.bookingDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${project.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : project.status === "cancelled"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-primary/10 text-primary"
                          }`}>
                          {project.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-heading font-bold text-base-content">
                        ৳{project.serviceCost?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-heading font-bold text-lg ${project.status === "completed"
                            ? "text-primary"
                            : "text-base-content/40"
                          }`}>
                          {project.status === "completed"
                            ? `৳${(project.serviceCost * COMMISSION).toLocaleString()}`
                            : "Pending"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const COMMISSION = 0.30
export default Earnings