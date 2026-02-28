import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import {
  HiCalendar, HiLocationMarker, HiSearch, HiFilter
} from "react-icons/hi"

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  assigned: "bg-blue-500/10 text-blue-500",
  planning: "bg-purple-500/10 text-purple-500",
  materials_prepared: "bg-indigo-500/10 text-indigo-500",
  on_the_way: "bg-orange-500/10 text-orange-500",
  setup_in_progress: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
}

const statusLabels = {
  pending: "Pending",
  assigned: "Assigned",
  planning: "Planning",
  materials_prepared: "Materials Prepared",
  on_the_way: "On The Way",
  setup_in_progress: "Setup In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings")
      setBookings(res.data)
    } catch (error) {
      toast.error("Failed to load bookings!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.userName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">
          Manage Bookings
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          View and manage all customer bookings
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service, user..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <HiFilter className="text-base-content/40" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
          >
            <option value="all">All Status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: bookings.length, color: "text-base-content" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "text-yellow-500" },
          { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "text-green-500" },
          { label: "Paid", value: bookings.filter(b => b.paymentStatus === "paid").length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className={`font-heading font-bold text-2xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="font-body text-xs text-base-content/60 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-3">📋</span>
          <p className="font-body text-base-content/60">No bookings found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Date & Location</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={booking.serviceImage || "https://placehold.co/48"}
                          alt={booking.serviceName}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <p className="font-body font-medium text-sm text-base-content max-w-[150px] truncate">
                          {booking.serviceName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-sm text-base-content font-medium">
                        {booking.userName}
                      </p>
                      <p className="font-body text-xs text-base-content/50">
                        {booking.userEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-body text-xs text-base-content/60">
                        <HiCalendar size={12} />
                        {booking.bookingDate}
                      </p>
                      <p className="flex items-center gap-1 font-body text-xs text-base-content/60 mt-1">
                        <HiLocationMarker size={12} />
                        <span className="truncate max-w-[120px]">{booking.location}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${booking.paymentStatus === "paid"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                        {booking.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-primary">
                      ৳{booking.serviceCost?.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBookings