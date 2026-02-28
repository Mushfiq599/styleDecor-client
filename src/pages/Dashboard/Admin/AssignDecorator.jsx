import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { HiCheck } from "react-icons/hi"

const AssignDecorator = () => {
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [decorators, setDecorators] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(null)
  const [selectedDecorator, setSelectedDecorator] = useState({})

  const fetchData = async () => {
    try {
      const [bookingsRes, usersRes] = await Promise.all([
        axiosSecure.get("/bookings"),
        axiosSecure.get("/users"),
      ])
      const paidBookings = bookingsRes.data.filter(
        (b) =>
          b.paymentStatus === "paid" &&
          b.status === "pending"
      )
      const decoratorUsers = usersRes.data.filter(
        (u) => u.role === "decorator"
      )
      setBookings(paidBookings)
      setDecorators(decoratorUsers)
    } catch (error) {
      toast.error("Failed to load data!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssign = async (bookingId) => {
    const decoratorEmail = selectedDecorator[bookingId]
    if (!decoratorEmail) {
      return toast.error("Please select a decorator first!")
    }
    const result = await Swal.fire({
      title: "Assign Decorator?",
      text: `Assign ${decoratorEmail} to this booking?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, assign!",
      confirmButtonColor: "#0D9488",
      cancelButtonColor: "#6b7280",
    })
    if (result.isConfirmed) {
      setAssigning(bookingId)
      try {
        await axiosSecure.patch(
          `/bookings/assign/${bookingId}`,
          { assignedDecorator: decoratorEmail }
        )
        toast.success("Decorator assigned successfully!")
        fetchData()
      } catch (error) {
        toast.error("Failed to assign decorator!")
      } finally {
        setAssigning(null)
      }
    }
  }
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">
          Assign Decorators
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          Assign decorators to paid bookings
        </p>
      </div>

      {/* Info banner */}
      <div className="glass-card p-4 mb-6 flex items-center gap-3 border-l-4 border-primary">
        <span className="text-2xl">💡</span>
        <p className="font-body text-sm text-base-content/70">
          Only <strong>paid bookings</strong> with <strong>pending</strong> status are shown here. Make sure users have paid before assigning a decorator.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-3">✅</span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            All caught up!
          </h3>
          <p className="font-body text-sm text-base-content/60">
            No paid bookings waiting for decorator assignment.
          </p>
        </div>
      ) : decorators.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-3">👷</span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No decorators available
          </h3>
          <p className="font-body text-sm text-base-content/60">
            Go to Manage Decorators and assign decorator roles to users first.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              {/* Service Info */}
              <img
                src={booking.serviceImage || "https://placehold.co/80"}
                alt={booking.serviceName}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-base text-base-content">
                  {booking.serviceName}
                </p>
                <p className="font-body text-xs text-base-content/60 mt-0.5">
                  👤 {booking.userName} · 📅 {booking.bookingDate} · 📍 {booking.location}
                </p>
                <p className="font-heading font-bold text-primary mt-1">
                  ৳{booking.serviceCost?.toLocaleString()}
                </p>
              </div>

              {/* Assign Section */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedDecorator[booking._id] || ""}
                  onChange={(e) =>
                    setSelectedDecorator({
                      ...selectedDecorator,
                      [booking._id]: e.target.value,
                    })
                  }
                  className="flex-1 sm:w-48 px-3 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
                >
                  <option value="">Select Decorator</option>
                  {decorators.map((d) => (
                    <option key={d._id} value={d.email}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssign(booking._id)}
                  disabled={assigning === booking._id}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-body text-sm font-medium rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 flex-shrink-0"
                >
                  {assigning === booking._id ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <HiCheck size={16} />
                      Assign
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssignDecorator