import { useState } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { HiPhone, HiMail, HiLocationMarker, HiClock, HiArrowRight } from "react-icons/hi"
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";

const contactInfo = [
    {
        icon: HiPhone,
        label: "Phone",
        value: "+880 1234-567890",
        color: "bg-primary/10 text-primary",
    },
    {
        icon: HiMail,
        label: "Email",
        value: "hello@styledecor.com",
        color: "bg-secondary/10 text-secondary",
    },
    {
        icon: HiLocationMarker,
        label: "Address",
        value: "House 12, Road 5, Dhanmondi, Dhaka",
        color: "bg-purple-500/10 text-purple-500",
    },
    {
        icon: HiClock,
        label: "Working Hours",
        value: "Saturday – Thursday: 9AM – 8PM",
        color: "bg-green-500/10 text-green-500",
    },
]

const faqs = [
    {
        question: "How do I book a decoration service?",
        answer: "Simply browse our services, click on one you like, and click Book Now. Fill in your preferred date and location and confirm your booking.",
    },
    {
        question: "How far in advance should I book?",
        answer: "We recommend booking at least 7-10 days in advance for regular services and 30+ days for weddings and large events.",
    },
    {
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel pending bookings from your dashboard. Once a decorator is assigned, cancellation may not be possible.",
    },
    {
        question: "What areas do you serve?",
        answer: "We currently serve Dhaka Central, Gulshan, Dhanmondi, Mirpur and Uttara. More areas coming soon!",
    },
]

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [sending, setSending] = useState(false)
    const [openFaq, setOpenFaq] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)

        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast.success("Message sent! We'll get back to you soon. 🎉")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setSending(false)
    }

    return (
        <div className="min-h-screen bg-base-100">
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}>
                        <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
                            Get In Touch
                        </span>
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
                            We'd Love To
                            <span className="text-primary"> Hear From You</span>
                        </h1>
                        <p className="font-body text-base-content/60 max-w-xl mx-auto">
                            Have a question about our services? Want to discuss a project?
                            Our team is here to help you every step of the way.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col gap-6">
                            <div>
                                <h2 className="font-heading text-3xl font-bold text-base-content mb-2">
                                    Contact Information
                                </h2>
                                <p className="font-body text-base-content/60">
                                    Reach out to us through any of these channels and we'll respond as quickly as possible.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {contactInfo.map((info, i) => (
                                    <motion.div
                                        key={info.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-card p-5 flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                                            <info.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-base-content/50 mb-0.5">
                                                {info.label}
                                            </p>
                                            <p className="font-body text-sm font-medium text-base-content">
                                                {info.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="glass-card p-6">
                                <p className="font-body text-sm font-semibold text-base-content mb-4">
                                    Follow Us On Social Media
                                </p>
                                <div className="flex items-center gap-3">
                                    {[
                                        { icon: FaFacebook, color: "hover:bg-blue-500", href: "https://www.facebook.com/" },
                                        { icon: FaInstagram, color: "hover:bg-pink-500", href: "https://www.instagram.com/" },
                                        { icon: FaXTwitter, color: "hover:bg-black", href: "https://x.com/" },
                                        { icon: FaWhatsapp, color: "hover:bg-green-500", href: "https://whatsapp.com/" },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            className={`w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:text-white transition-all duration-300 ${social.color}`}>
                                            <social.icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}>
                            <div className="glass-card p-8">
                                <h2 className="font-heading text-2xl font-bold text-base-content mb-2">
                                    Send Us a Message
                                </h2>
                                <p className="font-body text-sm text-base-content/60 mb-6">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
                                        </div>
                                        <div>
                                            <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@example.com"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="How can we help you?"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
                                    </div>

                                    <div>
                                        <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                                            Message
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us about your project or question..."
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                                        {sending ? (
                                            <span className="loading loading-spinner loading-sm" />
                                        ) : (
                                            <>
                                                Send Message
                                                <HiArrowRight
                                                    size={18}
                                                    className="group-hover:translate-x-1 transition-transform duration-300"/>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div >
            </section >

            < section className="py-24 bg-base-200" >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12">
                        <span className="inline-block font-body text-xs font-medium text-secondary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-secondary/10">
                            FAQ
                        </span>
                        <h2 className="font-heading text-4xl font-bold text-base-content mb-4">
                            Frequently Asked
                            <span className="text-secondary"> Questions</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left">
                                    <span className="font-body font-semibold text-sm text-base-content pr-4">
                                        {faq.question}
                                    </span>
                                    <span className={`text-primary text-xl transition-transform duration-300 flex-shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>
                                    +
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-5 pb-5">
                                        <p className="font-body text-sm text-base-content/60 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    )}

export default Contact