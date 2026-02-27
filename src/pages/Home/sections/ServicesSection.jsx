import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Link } from "react-router-dom"
import { HiArrowRight } from "react-icons/hi"

const dummyServices = [
    {
        _id: "1",
        service_name: "Home Interior Decoration",
        service_category: "home",
        cost: 5000,
        unit: "per room",
        description: "Transform your living spaces with our expert interior decoration services tailored to your style.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80",
    },
    {
        _id: "2",
        service_name: "Wedding Ceremony Setup",
        service_category: "wedding",
        cost: 25000,
        unit: "per event",
        description: "Make your special day unforgettable with breathtaking floral arrangements and venue decoration.",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80",
    },
    {
        _id: "3",
        service_name: "Office Space Decoration",
        service_category: "office",
        cost: 8000,
        unit: "per floor",
        description: "Create an inspiring and productive work environment with our professional office decoration.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
    },
    {
        _id: "4",
        service_name: "Seminar & Event Decoration",
        service_category: "seminar",
        cost: 12000,
        unit: "per event",
        description: "Impress your guests with stunning stage setups and hall decorations for any corporate event.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80",
    },
    {
        _id: "5",
        service_name: "Birthday Party Setup",
        service_category: "home",
        cost: 3500,
        unit: "per event",
        description: "Celebrate in style with vibrant, themed birthday decorations that bring joy to every moment.",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
    },
    {
        _id: "6",
        service_name: "Meeting Room Setup",
        service_category: "meeting",
        cost: 4000,
        unit: "per room",
        description: "Professional and elegant meeting room setups that leave a lasting impression on your clients.",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=80",
    },
]

const categoryColors = {
    home: "bg-primary/10 text-primary",
    wedding: "bg-pink-500/10 text-pink-500",
    office: "bg-blue-500/10 text-blue-500",
    seminar: "bg-purple-500/10 text-purple-500",
    meeting: "bg-secondary/10 text-secondary",
}

const ServicesSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
                        What We Offer
                    </span>
                    <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
                        Our Decoration
                        <span className="text-primary"> Services</span>
                    </h2>
                    <p className="font-body text-base-content/60 max-w-xl mx-auto">
                        From homes to grand ceremonies — we cover every space with creativity and expertise.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyServices.map((service, i) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link
                                to={`/services/${service._id}`}
                                className="group block glass-card overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.service_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Category Badge */}
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-medium capitalize ${categoryColors[service.service_category] || "bg-primary/10 text-primary"}`}>
                                        {service.service_category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-heading font-semibold text-lg text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                                        {service.service_name}
                                    </h3>
                                    <p className="font-body text-sm text-base-content/60 mb-4 line-clamp-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-heading font-bold text-xl text-primary">
                                                ৳{service.cost.toLocaleString()}
                                            </span>
                                            <span className="font-body text-xs text-base-content/50 ml-1">
                                                {service.unit}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1 text-xs font-body font-medium text-primary group-hover:gap-2 transition-all duration-300">
                                            View Details
                                            <HiArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-body font-semibold rounded-2xl hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300"
                    >
                        View All Services
                        <HiArrowRight size={18} />
                    </Link>
                </motion.div>

            </div>
        </section>
    )
}

export default ServicesSection