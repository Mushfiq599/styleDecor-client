import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import useAuth from "../../hooks/useAuth"
import { HiLocationMarker, HiCalendar, HiX, HiArrowRight } from "react-icons/hi"
import { TbCurrencyTaka } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { HiStar } from "react-icons/hi2"

const categoryColors = {
  home: "bg-primary/10 text-primary",
  wedding: "bg-pink-500/10 text-pink-500",
  office: "bg-blue-500/10 text-blue-500",
  seminar: "bg-purple-500/10 text-purple-500",
  meeting: "bg-secondary/10 text-secondary",
  birthday: "bg-yellow-500/10 text-yellow-500",
}

const ServiceDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [formData, setFormData] = useState({
    bookingDate: "",
    location: "",
  })
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/services/${id}`
        )
        setService(res.data)
      } catch (error) {
        toast.error("Service not found!")
        navigate("/services")
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book a service!")
      navigate("/login")
      return
    }
    setModalOpen(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    try {
      await axiosSecure.post("/bookings", {
        serviceId: service._id,
        serviceName: service.service_name,
        serviceImage: service.image,
        serviceCost: service.cost,
        userEmail: user.email,
        userName: user.displayName,
        bookingDate: formData.bookingDate,
        location: formData.location,
      })
      toast.success("Booking confirmed!")
      setModalOpen(false)
      setFormData({ bookingDate: "", location: "" })
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Booking failed!")
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!service) return null

  return (
    <>
      <div className="min-h-screen bg-base-100 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-10 shadow-2xl">
            <img
              src={service.image || "https://placehold.co/1200x400"}
              alt={service.service_name}
              className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className={`px-3 py-1 rounded-full text-xs font-body font-medium capitalize ${categoryColors[service.service_category] || "bg-primary/10 text-primary"}`}>
                {service.service_category}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-base-content mb-3">
                  {service.service_name}
                </h1>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-secondary" size={18} />
                  ))}
                  <span className="font-body text-sm text-base-content/60 ml-1">
                    4.9 (120 reviews)
                  </span>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-3">
                  About This Service
                </h3>
                <p className="font-body text-base-content/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-4">
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Professional decorator team",
                    "Premium quality materials",
                    "On-site setup & arrangement",
                    "Post-event cleanup",
                    "Real-time status updates",
                    "Satisfaction guarantee",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs"><FaCheck /></span>
                      </div>
                      <span className="font-body text-sm text-base-content/70">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-4">
                  Project Status Flow
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Assigned",
                    "Planning",
                    "Materials Prepared",
                    "On The Way",
                    "Setup In Progress",
                    "Completed",
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-base-200 font-body text-xs text-base-content/70">
                        {step}
                      </span>
                      {i < 5 && (
                        <HiArrowRight size={12} className="text-base-content/30" />)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-28">
                <div className="mb-6">
                  <p className="font-body text-sm text-base-content/60 mb-1">
                    Starting from
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="flex items-center font-heading font-bold text-4xl text-primary">
                      <TbCurrencyTaka size={40}/>{service.cost.toLocaleString()}
                    </span>
                    <span className="font-body text-sm text-base-content/50">
                      {service.unit}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-base-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm">🏷️</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-base-content/50">Category</p>
                      <p className="font-body text-sm font-medium text-base-content capitalize">
                        {service.service_category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm">📐</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-base-content/50">Pricing Unit</p>
                      <p className="font-body text-sm font-medium text-base-content">
                        {service.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <span className="text-green-500 text-sm"><FaCheck /></span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-base-content/50">Availability</p>
                      <p className="font-body text-sm font-medium text-green-500">
                        Available Now
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300">
                  Book Now
                  <HiArrowRight size={18} />
                </button>

                {!user && (
                  <p className="font-body text-xs text-center text-base-content/50 mt-3">
                    You need to{" "}
                    <a href="/login" className="text-primary hover:underline">
                      login
                    </a>{" "}
                    to book this service
                  </p>)}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"/>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors">
                  <HiX size={16} />
                </button>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-bold text-base-content">
                    Confirm Booking
                  </h2>
                  <p className="font-body text-sm text-base-content/60 mt-1">
                    Fill in the details to book this service
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-base-200 mb-6">
                  <img
                    src={service.image}
                    alt={service.service_name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-base-content truncate">
                      {service.service_name}
                    </p>
                    <p className="flex items-center font-heading font-bold text-primary text-lg">
                      <TbCurrencyTaka size={24}/>{service.cost.toLocaleString()}
                      <span className="font-body font-normal text-xs text-base-content/50 ml-1">
                        {service.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent outline-none font-body text-sm text-base-content/60 cursor-not-allowed"/>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent outline-none font-body text-sm text-base-content/60 cursor-not-allowed"/>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      <HiCalendar className="inline mr-1" size={14} />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) =>
                        setFormData({ ...formData, bookingDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"/>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      <HiLocationMarker className="inline mr-1" size={14} />
                      Service Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. House 12, Road 5, Dhanmondi"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                    {bookingLoading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        Confirm Booking
                        <HiArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ServiceDetails