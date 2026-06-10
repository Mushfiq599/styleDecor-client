import { useState, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { API_URL } from "../utils/apiUrl"
import toast from "react-hot-toast"
import {
  HiMail, HiPhone, HiLocationMarker,
  HiArrowRight, HiCheck,
} from "react-icons/hi"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const faqs = [
  {
    q: "How far in advance should I book a service?",
    a: "We recommend booking at least 7–14 days in advance for standard services. For weddings and large events, 4–8 weeks ahead ensures availability and proper planning.",
  },
  {
    q: "Do you offer customized decoration packages?",
    a: "Absolutely! Every project is tailored to your vision, budget, and venue. Contact us with your requirements and we'll put together a custom quote.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve all major areas in Dhaka, Chittagong, and Sylhet. For remote locations, additional travel fees may apply.",
  },
  {
    q: "Can I make changes after booking?",
    a: "Yes, changes can be made up to 48 hours before your event date without any extra charge. Contact your assigned decorator directly.",
  },
]

const contactInfo = [
  { icon: <HiMail className="text-primary" size={20} />, label: "Email", value: "hello@styledecor.com", href: "mailto:hello@styledecor.com" },
  { icon: <HiPhone className="text-primary" size={20} />, label: "Phone", value: "+880 1234-567890", href: "tel:+8801234567890" },
  { icon: <HiLocationMarker className="text-primary" size={20} />, label: "Address", value: "House 12, Road 5, Dhanmondi, Dhaka 1205", href: null },
]

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [openFaq, setOpenFaq]   = useState(null)

  const validate = () => {
    const e = {}
    if (!formData.name.trim())     e.name    = "Name is required"
    if (!formData.email)           e.email   = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email"
    if (!formData.subject.trim())  e.subject = "Subject is required"
    if (!formData.message.trim())  e.message = "Message is required"
    else if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await axios.post(`${API_URL}/contact`, formData)
      setSuccess(true)
      toast.success("Message sent successfully! 🎉")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label text-primary bg-primary/10">Get In Touch</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4 mt-2">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Have a question or ready to start your next decoration project? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

          {/* ── Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Info cards */}
            {contactInfo.map((item) => (
              <div key={item.label} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-body text-xs text-base-content/50 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-body text-sm text-base-content hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-base-content">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Business hours */}
            <div className="glass-card p-5">
              <h3 className="font-heading font-semibold text-base text-base-content mb-3">Business Hours</h3>
              <div className="flex flex-col gap-2">
                {[
                  { day: "Saturday – Thursday", hours: "9:00 AM – 8:00 PM" },
                  { day: "Friday",              hours: "Closed" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-body text-sm text-base-content/70">{day}</span>
                    <span className={`font-body text-sm font-medium ${hours === "Closed" ? "text-red-500" : "text-primary"}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="glass-card p-5">
              <h3 className="font-heading font-semibold text-base text-base-content mb-3">Follow Us</h3>
              <div className="flex items-center gap-3">
                {[
                  { icon: <FaFacebook size={16} />, href: "https://www.facebook.com/", label: "Facebook" },
                  { icon: <FaInstagram size={16} />, href: "https://www.instagram.com/", label: "Instagram" },
                  { icon: <FaXTwitter size={16} />, href: "https://www.twitter.com/", label: "Twitter" },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-base-200 text-base-content/60 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8">
              <h2 className="font-heading text-2xl font-bold text-base-content mb-6">
                Send a Message
              </h2>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <HiCheck className="text-green-500" size={32} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-base-content">Message Sent!</h3>
                  <p className="font-body text-sm text-base-content/60 max-w-xs">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 px-6 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.name ? "border-red-500" : "border-transparent focus:border-primary"}`}
                      />
                      {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.email ? "border-red-500" : "border-transparent focus:border-primary"}`}
                      />
                      {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Wedding decoration inquiry"
                      required
                      className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors.subject ? "border-red-500" : "border-transparent focus:border-primary"}`}
                    />
                    {errors.subject && <p className="font-body text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or ask your question..."
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 focus:bg-base-100 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 resize-none ${errors.message ? "border-red-500" : "border-transparent focus:border-primary"}`}
                    />
                    {errors.message && <p className="font-body text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        Send Message
                        <HiArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── FAQ ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-base-content">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-body font-semibold text-sm text-base-content pr-4">
                    {faq.q}
                  </span>
                  <span className={`text-primary text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-6"
                  >
                    <p className="font-body text-sm text-base-content/70 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact