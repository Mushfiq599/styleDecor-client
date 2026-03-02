import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import { TbBrandCashapp } from "react-icons/tb";
import { BsHourglassSplit } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { IoCheckbox } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from "recharts"

const COLORS = ["#0D9488", "#F97316", "#6366f1", "#ec4899", "#f59e0b", "#10b981"]

const Analytics = () => {
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          axiosSecure.get("/bookings"),
          axiosSecure.get("/services"),
        ])
        setBookings(bookingsRes.data)
        setServices(servicesRes.data)
      } catch (error) {
        console.error("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const serviceDemandData = services.map((service) => ({
    name: service.service_name.split(" ").slice(0, 2).join(" "),
    bookings: bookings.filter((b) => b.serviceName === service.service_name).length,
  })).sort((a, b) => b.bookings - a.bookings)

  const statusData = [
    { name: "Pending", value: bookings.filter(b => b.status === "pending").length },
    { name: "Completed", value: bookings.filter(b => b.status === "completed").length },
    { name: "Assigned", value: bookings.filter(b => b.status === "assigned").length },
    { name: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length },
  ].filter(d => d.value > 0)

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.serviceCost || 0), 0)

  const totalBookings = bookings.length
  const completedBookings = bookings.filter(b => b.status === "completed").length
  const pendingBookings = bookings.filter(b => b.status === "pending").length

  const stats = [
    { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: <TbBrandCashapp color="#85BB65"/>, color: "text-primary" },
    { label: "Total Bookings", value: totalBookings, icon: <CgNotes color="#3b82f6"/>, color: "text-blue-500" },
    { label: "Completed", value: completedBookings, icon: <IoCheckbox color="green"/>, color: "text-green-500" },
    { label: "Pending", value: pendingBookings, icon: <BsHourglassSplit color="#F97316"/>, color: "text-yellow-500" },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-base-content">
          Analytics
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Business insights and performance overview
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center">
            <span className="text-3xl flex justify-center mb-2">{stat.icon}</span>
            <p className={`font-heading font-bold text-2xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="font-body text-xs text-base-content/60 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg text-base-content mb-6">
            Service Demand
          </h3>
          {serviceDemandData.every(d => d.bookings === 0) ? (
            <div className="flex items-center justify-center h-48 text-base-content/40">
              <p className="font-body text-sm">No booking data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={serviceDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontFamily: "Inter" }}/>
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Inter" }}
                  allowDecimals={false}/>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    fontFamily: "Inter",
                    fontSize: "12px",
                  }}/>
                <Bar dataKey="bookings" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg text-base-content mb-6">
            Booking Status Distribution
          </h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-base-content/40">
              <p className="font-body text-sm">No booking data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    fontFamily: "Inter",
                    fontSize: "12px",
                  }}/>
                <Legend
                  wrapperStyle={{ fontFamily: "Inter", fontSize: "12px" }}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6">
        <h3 className="font-heading font-semibold text-lg text-base-content mb-4">
          Revenue Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="font-body text-xs text-base-content/50 mb-1">Total Revenue</p>
            <p className="flex gap-1 items-center font-heading font-bold text-2xl text-primary">
              <TbCurrencyTaka />{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
            <p className="font-body text-xs text-base-content/50 mb-1">Paid Bookings</p>
            <p className="font-heading font-bold text-2xl text-green-500">
              {bookings.filter(b => b.paymentStatus === "paid").length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
            <p className="font-body text-xs text-base-content/50 mb-1">Unpaid Bookings</p>
            <p className="font-heading font-bold text-2xl text-yellow-500">
              {bookings.filter(b => b.paymentStatus === "unpaid").length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics