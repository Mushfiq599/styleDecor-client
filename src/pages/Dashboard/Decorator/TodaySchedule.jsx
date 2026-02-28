import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import useAuth from "../../../hooks/useAuth"
import { HiLocationMarker, HiClock, HiUser } from "react-icons/hi"

const TodaySchedule = () => {
  const { user } = useAuth()
  const [todayProjects, setTodayProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bookings")
        const today = new Date().toISOString().split("T")[0]
        const myToday = res.data.filter(
          (b) =>
            b.assignedDecorator === user?.email &&
            b.bookingDate === today &&
            b.status !== "completed" &&
            b.status !== "cancelled"
        )
        setTodayProjects(myToday)
      } catch (error) {
        console.error("Failed to load schedule")
      } finally {
        setLoading(false)
      }
    }
    if (user?.email) fetchSchedule()
  }, [user])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
          Today's Schedule
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          {today}
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Today's Jobs", value: todayProjects.length, icon: "📋", color: "text-primary" },
          { label: "In Progress", value: todayProjects.filter(p => p.status === "setup_in_progress").length, icon: "🔧", color: "text-orange-500" },
          { label: "On The Way", value: todayProjects.filter(p => p.status === "on_the_way").length, icon: "🚗", color: "text-blue-500" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 text-center"
          >
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className={`font-heading font-bold text-2xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="font-body text-xs text-base-content/60 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {todayProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <span className="text-6xl block mb-4">🎉</span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No jobs today!
          </h3>
          <p className="font-body text-sm text-base-content/60">
            You have no decoration projects scheduled for today. Enjoy your day!
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {todayProjects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 flex gap-4 items-center"
            >
              <img
                src={project.serviceImage || "https://placehold.co/80"}
                alt={project.serviceName}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-base text-base-content mb-1">
                  {project.serviceName}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiUser size={12} className="text-primary" />
                    {project.userName}
                  </span>
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiLocationMarker size={12} className="text-primary" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiClock size={12} className="text-primary" />
                    Today
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-body font-medium flex-shrink-0 ${project.status === "setup_in_progress"
                  ? "bg-primary/10 text-primary"
                  : "bg-orange-500/10 text-orange-500"
                }`}>
                {project.status.replace(/_/g, " ")}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TodaySchedule