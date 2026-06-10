import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import useRole from "../../hooks/useRole"
import useAuth from "../../hooks/useAuth"
import { TbCurrencyTaka, TbBrandCashapp } from "react-icons/tb"
import { BsHourglassSplit } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"
import { IoCheckbox } from "react-icons/io5"
import { HiUsers, HiCollection, HiArrowRight } from "react-icons/hi"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"

/* ── Reusable stat card ─────────────────────────────────────── */
const StatCard = ({ label, value, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-5"
  >
    <div className="flex items-center justify-between mb-3">
      <p className="font-body text-sm text-base-content/60">{label}</p>
      <span className={`text-2xl ${color}`}>{icon}</span>
    </div>
    <p className={`font-heading font-bold text-3xl ${color}`}>{value}</p>
  </motion.div>
)

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const buildMonthlyData = (bookings) => {
  const map = {}
  MONTHS.forEach((m) => { map[m] = { month: m, revenue: 0, bookings: 0 } })
  bookings
    .filter((b) => b.paymentStatus === "paid")
    .forEach((b) => {
      const d = new Date(b.createdAt)
      if (!isNaN(d)) {
        const m = MONTHS[d.getMonth()]
        map[m].revenue  += b.serviceCost || 0
        map[m].bookings += 1
      }
    })
  return Object.values(map)
}

/* ── Main component ─────────────────────────────────────────── */
const DashboardOverview = () => {
  const { user }              = useAuth()
  const axiosSecure           = useAxiosSecure()
  const [role, roleLoading]   = useRole()
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!role) return
    const load = async () => {
      try {
        if (role === "admin") {
          const [b, s, u] = await Promise.all([
            axiosSecure.get("/bookings"),
            axiosSecure.get("/services"),
            axiosSecure.get("/users"),
          ])
          setBookings(b.data)
          setServices(s.data)
          setUsers(u.data)
        } else if (role === "user") {
          const b = await axiosSecure.get(`/bookings/user/${user?.email}`)
          setBookings(b.data)
        } else if (role === "decorator") {
          try {
            const b = await axiosSecure.get(`/bookings/decorator/${user?.email}`)
            setBookings(b.data || [])
          } catch { setBookings([]) }
        }
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [role, user])

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  /* ── Admin ── */
  if (role === "admin") {
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((s, b) => s + (b.serviceCost || 0), 0)

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-base-content">
            Admin Overview
          </h2>
          <p className="font-body text-sm text-base-content/60 mt-1">
            Welcome back, {user?.displayName?.split(" ")[0]}. Here's your business snapshot.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={<span className="flex items-center text-2xl"><TbCurrencyTaka size={26} />{totalRevenue.toLocaleString()}</span>}
            icon={<TbBrandCashapp />} color="text-primary" delay={0}
          />
          <StatCard label="Total Bookings" value={bookings.length}  icon={<CgNotes />}    color="text-blue-500"   delay={0.1} />
          <StatCard label="Total Users"    value={users.length}     icon={<HiUsers />}    color="text-secondary"  delay={0.2} />
          <StatCard label="Services"       value={services.length}  icon={<HiCollection />} color="text-purple-500" delay={0.3} />
        </div>

        {/* Line chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-semibold text-lg text-base-content mb-6">
            Monthly Revenue & Bookings
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={buildMonthlyData(bookings)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Inter" }} />
              <YAxis yAxisId="left"  tick={{ fontSize: 11, fontFamily: "Inter" }} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fontFamily: "Inter" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontFamily: "Inter", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: "12px" }} />
              <Line yAxisId="left"  type="monotone" dataKey="revenue"  stroke="#0D9488" strokeWidth={2.5} dot={{ r: 3 }} name="Revenue (৳)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Manage Bookings", to: "/dashboard/admin/manage-bookings", color: "text-blue-500" },
            { label: "Manage Services", to: "/dashboard/admin/manage-services", color: "text-primary" },
            { label: "Manage Users",    to: "/dashboard/admin/manage-users",    color: "text-secondary" },
          ].map((item) => (
            <Link key={item.label} to={item.to}
              className="glass-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300"
            >
              <span className={`font-body font-semibold text-sm ${item.color}`}>{item.label}</span>
              <HiArrowRight className={item.color} size={16} />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  /* ── User ── */
  if (role === "user") {
    const paid      = bookings.filter((b) => b.paymentStatus === "paid")
    const pending   = bookings.filter((b) => b.status === "pending")
    const completed = bookings.filter((b) => b.status === "completed")
    const totalSpent = paid.reduce((s, b) => s + (b.serviceCost || 0), 0)

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-base-content">My Overview</h2>
          <p className="font-body text-sm text-base-content/60 mt-1">
            Welcome back, {user?.displayName?.split(" ")[0]}!
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={bookings.length}  icon={<CgNotes />}          color="text-blue-500"   delay={0} />
          <StatCard label="Pending"        value={pending.length}   icon={<BsHourglassSplit />} color="text-yellow-500" delay={0.1} />
          <StatCard label="Completed"      value={completed.length} icon={<IoCheckbox />}       color="text-green-500"  delay={0.2} />
          <StatCard
            label="Total Spent"
            value={<span className="flex items-center text-2xl"><TbCurrencyTaka size={26}/>{totalSpent.toLocaleString()}</span>}
            icon={<TbBrandCashapp />} color="text-primary" delay={0.3}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/dashboard/user/bookings" className="glass-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
            <span className="font-body font-semibold text-sm text-blue-500">My Bookings</span>
            <HiArrowRight className="text-blue-500" size={16} />
          </Link>
          <Link to="/services" className="glass-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
            <span className="font-body font-semibold text-sm text-primary">Browse Services</span>
            <HiArrowRight className="text-primary" size={16} />
          </Link>
        </div>
      </div>
    )
  }

  /* ── Decorator ── */
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-base-content">Decorator Overview</h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Welcome back, {user?.displayName?.split(" ")[0]}!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Assigned Projects" value={bookings.filter((b) => b.status === "assigned").length}  icon={<CgNotes />}    color="text-blue-500"  delay={0} />
        <StatCard label="Completed"         value={bookings.filter((b) => b.status === "completed").length} icon={<IoCheckbox />} color="text-green-500" delay={0.1} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dashboard/decorator/projects"  className="glass-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <span className="font-body font-semibold text-sm text-primary">My Projects</span>
          <HiArrowRight className="text-primary" size={16} />
        </Link>
        <Link to="/dashboard/decorator/schedule" className="glass-card p-5 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <span className="font-body font-semibold text-sm text-secondary">Today's Schedule</span>
          <HiArrowRight className="text-secondary" size={16} />
        </Link>
      </div>
    </div>
  )
}

export default DashboardOverview