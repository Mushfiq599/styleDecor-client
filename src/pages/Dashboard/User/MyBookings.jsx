import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAuth from "../../../hooks/useAuth"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { HiCalendar, HiLocationMarker, HiClock, HiX } from "react-icons/hi"
import { TbCurrencyTaka } from "react-icons/tb";
import { GiNotebook } from "react-icons/gi";
import { Link } from "react-router-dom"

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
  planning: "Planning Phase",
  materials_prepared: "Materials Prepared",
  on_the_way: "On The Way",
  setup_in_progress: "Setup In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const MyBookings = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const res = await axiosSecure.get(`/bookings/user/${user?.email}`)
      setBookings(res.data)
    } catch (error) {
      toast.error("Failed to load bookings!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) fetchBookings()
  }, [user])

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#0D9488",
    })

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/bookings/cancel/${bookingId}`)
        toast.success("Booking cancelled!")
        fetchBookings()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel!")
      }
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
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">
          My Bookings
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Track and manage all your decoration bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center justify-center items-center">
          <span className="text-6xl flex justify-center mb-4"><GiNotebook color="#0D9488"/></span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No bookings yet
          </h3>
          <p className="font-body text-sm text-base-content/60 mb-6">
            You haven't booked any decoration service yet.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 transition-all duration-300">
            Browse Services
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 flex flex-col sm:flex-row gap-4">
              <img
                src={booking.serviceImage || "https://placehold.co/100x100"}
                alt={booking.serviceName}
                className="w-full sm:w-24 h-24 rounded-xl object-cover flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-semibold text-base text-base-content">
                    {booking.serviceName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${statusColors[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiCalendar size={14} />
                    {booking.bookingDate}
                  </span>
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiLocationMarker size={14} />
                    {booking.location}
                  </span>
                  <span className="flex items-center gap-1 font-body text-xs text-base-content/60">
                    <HiClock size={14} />
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold flex items-center text-lg text-primary">
                      <TbCurrencyTaka size={20}/>{booking.serviceCost.toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${booking.paymentStatus === "paid"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                      {booking.paymentStatus === "paid" ? " Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.paymentStatus === "unpaid" &&
                      booking.status !== "cancelled" && (
                        <Link
                          to={`/dashboard/user/payment/${booking._id}`}
                          className="px-4 py-2 bg-primary text-white font-body text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                          Pay Now
                        </Link>)}
                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 font-body text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors">
                        <HiX size={14} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings