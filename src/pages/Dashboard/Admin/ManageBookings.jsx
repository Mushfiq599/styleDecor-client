import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import { HiCalendar, HiLocationMarker, HiSearch, HiFilter } from "react-icons/hi"
import { HiChevronUpDown } from "react-icons/hi2"
import { TbCurrencyTaka } from "react-icons/tb"
import Badge from "../../../components/ui/Badge"
import Pagination from "../../../components/ui/Pagination"

const statusVariant = {
  pending:           "warning",
  assigned:          "info",
  planning:          "primary",
  materials_prepared:"neutral",
  on_the_way:        "secondary",
  setup_in_progress: "primary",
  completed:         "success",
  cancelled:         "danger",
}

const statusLabels = {
  pending: "Pending", assigned: "Assigned", planning: "Planning",
  materials_prepared: "Materials Prepared", on_the_way: "On The Way",
  setup_in_progress: "Setup In Progress", completed: "Completed", cancelled: "Cancelled",
}

const ITEMS_PER_PAGE = 10

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy]           = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchBookings = async () => {
    try {
      const res = await axiosSecure.get("/bookings")
      setBookings(res.data)
    } catch {
      toast.error("Failed to load bookings!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const filtered = bookings
    .filter((b) => {
      const q = search.toLowerCase()
      return (
        (b.serviceName?.toLowerCase().includes(q) ||
          b.userEmail?.toLowerCase().includes(q) ||
          b.userName?.toLowerCase().includes(q)) &&
        (statusFilter === "all" || b.status === statusFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === "oldest")      return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === "amount-desc") return (b.serviceCost || 0) - (a.serviceCost || 0)
      if (sortBy === "amount-asc")  return (a.serviceCost || 0) - (b.serviceCost || 0)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleChange = (setter) => (e) => { setter(e.target.value); setCurrentPage(1) }

  const miniStats = [
    { label: "Total",     value: bookings.length,                                           color: "text-base-content" },
    { label: "Pending",   value: bookings.filter(b => b.status === "pending").length,        color: "text-yellow-500" },
    { label: "Completed", value: bookings.filter(b => b.status === "completed").length,      color: "text-green-500" },
    { label: "Paid",      value: bookings.filter(b => b.paymentStatus === "paid").length,    color: "text-primary" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">Manage Bookings</h2>
        <p className="font-body text-sm text-base-content/60 mt-1">View and manage all customer bookings</p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {miniStats.map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-xs text-base-content/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
          <input
            type="text"
            value={search}
            onChange={handleChange(setSearch)}
            placeholder="Search by service, user..."
            aria-label="Search bookings"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <HiFilter className="text-base-content/40" size={16} />
          <select
            value={statusFilter}
            onChange={handleChange(setStatusFilter)}
            aria-label="Filter by status"
            className="px-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
          >
            <option value="all">All Status</option>
            {Object.entries(statusLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <HiChevronUpDown className="text-base-content/40" size={16} />
          <select
            value={sortBy}
            onChange={handleChange(setSortBy)}
            aria-label="Sort bookings"
            className="px-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

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
        <>
          <p className="font-body text-sm text-base-content/50 mb-4">
            Showing <span className="font-semibold text-base-content">{paginated.length}</span> of{" "}
            <span className="font-semibold text-base-content">{filtered.length}</span> bookings
          </p>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-base-300">
                    {["Service","Customer","Date & Location","Status","Payment","Amount"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((booking, i) => (
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
                            loading="lazy"
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <p className="font-body font-medium text-sm text-base-content max-w-[150px] truncate">
                            {booking.serviceName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-body text-sm text-base-content font-medium">{booking.userName}</p>
                        <p className="font-body text-xs text-base-content/50">{booking.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1 font-body text-xs text-base-content/60">
                          <HiCalendar size={12} />{booking.bookingDate}
                        </p>
                        <p className="flex items-center gap-1 font-body text-xs text-base-content/60 mt-1">
                          <HiLocationMarker size={12} />
                          <span className="truncate max-w-[120px]">{booking.location}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[booking.status] || "neutral"}>
                          {statusLabels[booking.status] || booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={booking.paymentStatus === "paid" ? "success" : "warning"}>
                          {booking.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center font-heading font-bold text-primary">
                          <TbCurrencyTaka size={18} />{booking.serviceCost?.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}

export default ManageBookings