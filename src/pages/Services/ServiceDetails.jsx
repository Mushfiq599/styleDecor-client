import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import { API_URL } from "../../utils/apiUrl"
import toast from "react-hot-toast"
import useAuth from "../../hooks/useAuth"
import {
  HiLocationMarker, HiCalendar, HiArrowRight,
  HiChevronLeft, HiChevronRight,
} from "react-icons/hi"
import { TbCurrencyTaka } from "react-icons/tb"
import { FaCheck } from "react-icons/fa6"
import { HiStar } from "react-icons/hi2"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Modal from "../../components/ui/Modal"
import ServiceCard, { ServiceCardSkeleton } from "../../components/ui/ServiceCard"

const categoryVariant = {
  home: "primary", wedding: "danger", office: "info",
  seminar: "neutral", meeting: "secondary", birthday: "warning",
}

// Placeholder reviews — replace with real API when backend supports it
const mockReviews = [
  { id: 1, name: "Tahmina B.", rating: 5, date: "2025-11-10", text: "Absolutely stunning setup. Every detail was perfect. The team was professional and on time." },
  { id: 2, name: "Rezaul K.",  rating: 5, date: "2025-10-25", text: "Our office transformation exceeded expectations. Great communication throughout the project." },
  { id: 3, name: "Sadia I.",   rating: 4, date: "2025-09-18", text: "Beautiful decoration for our event. Would definitely book again for our next occasion." },
]

const ServiceDetails = () => {
  const { id }        = useParams()
  const { user }      = useAuth()
  const navigate      = useNavigate()
  const axiosSecure   = useAxiosSecure()

  const [service, setService]           = useState(null)
  const [related, setRelated]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeImg, setActiveImg]       = useState(0)
  const [modalOpen, setModalOpen]       = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [formData, setFormData]         = useState({ bookingDate: "", location: "" })
  const [errors, setErrors]             = useState({})

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setActiveImg(0)
      try {
        const res = await axios.get(`${API_URL}/services/${id}`)
        setService(res.data)
        const allRes = await axios.get(`${API_URL}/services`, {
          params: { category: res.data.service_category },
        })
        setRelated(allRes.data.filter((s) => s._id !== id).slice(0, 4))
      } catch {
        toast.error("Service not found!")
        navigate("/services")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Gallery: 4 distinct images stored per service.
  // Falls back to repeating the single cover image for any older
  // services that were never given an `images` array.
  const gallery = service
    ? service.images && service.images.length > 0
      ? service.images
      : [service.image, service.image, service.image, service.image]
    : []

  const validate = () => {
    const e = {}
    if (!formData.bookingDate) e.bookingDate = "Please select a date"
    if (!formData.location.trim()) e.location = "Please enter your location"
    setErrors(e)
    return Object.keys(e).length === 0
  }

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
    if (!validate()) return
    setBookingLoading(true)
    try {
      await axiosSecure.post("/bookings", {
        serviceId:   service._id,
        serviceName: service.service_name,
        serviceImage: service.image,
        serviceCost: service.cost,
        userEmail:   user.email,
        userName:    user.displayName,
        bookingDate: formData.bookingDate,
        location:    formData.location,
      })
      toast.success("Booking confirmed! 🎉")
      setModalOpen(false)
      setFormData({ bookingDate: "", location: "" })
      setErrors({})
    } catch (error) {
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

          {/* ── Image Gallery ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            {/* Main image */}
            <div className="relative h-72 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl mb-3">
              <img
                src={gallery[activeImg]}
                alt={`${service.service_name} view ${activeImg + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant={categoryVariant[service.service_category] || "primary"}>
                  {service.service_category}
                </Badge>
              </div>

              {/* Nav arrows */}
              <button
                onClick={() => setActiveImg((p) => Math.max(0, p - 1))}
                disabled={activeImg === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
                aria-label="Previous image"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveImg((p) => Math.min(gallery.length - 1, p + 1))}
                disabled={activeImg === gallery.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
                aria-label="Next image"
              >
                <HiChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImg === i
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Content ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Title + rating */}
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-base-content mb-3">
                  {service.service_name}
                </h1>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-secondary" size={18} />
                  ))}
                  <span className="font-body text-sm text-base-content/60 ml-1">
                    4.9 ({mockReviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-3">
                  About This Service
                </h3>
                <p className="font-body text-base-content/70 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* What's included */}
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
                        <FaCheck className="text-primary" size={10} />
                      </div>
                      <span className="font-body text-sm text-base-content/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status flow */}
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-4">
                  Project Status Flow
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Assigned", "Planning", "Materials Prepared", "On The Way", "Setup In Progress", "Completed"].map(
                    (step, i, arr) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-base-200 font-body text-xs text-base-content/70">
                          {step}
                        </span>
                        {i < arr.length - 1 && (
                          <HiArrowRight size={12} className="text-base-content/30" />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ── Reviews ── */}
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-6">
                  Client Reviews ({mockReviews.length})
                </h3>
                <div className="flex flex-col gap-5">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 font-heading font-bold text-primary text-sm">
                        {r.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-body font-semibold text-sm text-base-content">{r.name}</p>
                          <p className="font-body text-xs text-base-content/40">{r.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[...Array(r.rating)].map((_, j) => (
                            <HiStar key={j} className="text-secondary" size={12} />
                          ))}
                        </div>
                        <p className="font-body text-sm text-base-content/70 leading-relaxed">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right: Booking card ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 sticky top-28">
                <div className="mb-6">
                  <p className="font-body text-sm text-base-content/60 mb-1">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="flex items-center font-heading font-bold text-4xl text-primary">
                      <TbCurrencyTaka size={40} />
                      {service.cost.toLocaleString()}
                    </span>
                    <span className="font-body text-sm text-base-content/50">{service.unit}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-base-300">
                  {[
                    { emoji: "🏷️", label: "Category",    value: service.service_category },
                    { emoji: "📐", label: "Pricing Unit", value: service.unit },
                    { emoji: "✅", label: "Availability", value: "Available Now", green: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div>
                        <p className="font-body text-xs text-base-content/50">{item.label}</p>
                        <p className={`font-body text-sm font-medium capitalize ${item.green ? "text-green-500" : "text-base-content"}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleBookNow} size="lg" className="w-full justify-center">
                  Book Now
                  <HiArrowRight size={18} />
                </Button>

                {!user && (
                  <p className="font-body text-xs text-center text-base-content/50 mt-3">
                    You need to{" "}
                    <a href="/login" className="text-primary hover:underline">login</a>{" "}
                    to book
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Related Services ── */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="font-heading text-2xl font-bold text-base-content mb-6">
                Related <span className="text-primary">Services</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((s, i) => (
                  <ServiceCard key={s._id} service={s} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setErrors({}) }}
        title="Confirm Booking"
        subtitle="Fill in the details to book this service"
      >
        {/* Service preview */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-base-200 mb-6">
          <img
            src={service.image}
            alt={service.service_name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-body font-semibold text-sm text-base-content truncate">
              {service.service_name}
            </p>
            <p className="flex items-center font-heading font-bold text-primary text-lg">
              <TbCurrencyTaka size={24} />
              {service.cost.toLocaleString()}
              <span className="font-body font-normal text-xs text-base-content/50 ml-1">
                {service.unit}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} noValidate className="flex flex-col gap-4">
          {/* Read-only user info */}
          <div>
            <label htmlFor="booking-name" className="font-body text-sm font-medium text-base-content mb-1.5 block">
              Your Name
            </label>
            <input
              id="booking-name"
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent outline-none font-body text-sm text-base-content/60 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="booking-email" className="font-body text-sm font-medium text-base-content mb-1.5 block">
              Your Email
            </label>
            <input
              id="booking-email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent outline-none font-body text-sm text-base-content/60 cursor-not-allowed"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="booking-date" className="font-body text-sm font-medium text-base-content mb-1.5 block">
              <HiCalendar className="inline mr-1" size={14} />
              Preferred Date
            </label>
            <input
              id="booking-date"
              type="date"
              value={formData.bookingDate}
              onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              required
              className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content transition-all duration-300 ${
                errors.bookingDate ? "border-red-500" : "border-transparent focus:border-primary"
              }`}
            />
            {errors.bookingDate && (
              <p className="font-body text-xs text-red-500 mt-1">{errors.bookingDate}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="booking-location" className="font-body text-sm font-medium text-base-content mb-1.5 block">
              <HiLocationMarker className="inline mr-1" size={14} />
              Service Location
            </label>
            <input
              id="booking-location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. House 12, Road 5, Dhanmondi"
              required
              className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${
                errors.location ? "border-red-500" : "border-transparent focus:border-primary"
              }`}
            />
            {errors.location && (
              <p className="font-body text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <Button type="submit" loading={bookingLoading} size="lg" className="w-full justify-center mt-2">
            Confirm Booking
            <HiArrowRight size={18} />
          </Button>
        </form>
      </Modal>
    </>
  )
}

export default ServiceDetails