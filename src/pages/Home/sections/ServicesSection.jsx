import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom"
import { HiArrowRight } from "react-icons/hi"
import axios from "axios"

const categoryColors = {
    home: "bg-primary/10 text-primary",
    wedding: "bg-pink-500/10 text-pink-500",
    office: "bg-blue-500/10 text-blue-500",
    seminar: "bg-purple-500/10 text-purple-500",
    meeting: "bg-secondary/10 text-secondary",
    birthday: "bg-yellow-500/10 text-yellow-500",
}

const ServicesSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [services, setServices] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/services")
            .then(res => setServices(res.data.slice(0, 6)))
            .catch(err => console.error(err))
    }, [])

    return (
        <section ref={ref} className="py-24 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                            <Link
                                to={`/services/${service._id}`}
                                className="group block glass-card overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.service_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-medium capitalize ${categoryColors[service.service_category] || "bg-primary/10 text-primary"}`}>
                                        {service.service_category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-heading font-semibold text-lg text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                                        {service.service_name}
                                    </h3>
                                    <p className="font-body text-sm text-base-content/60 mb-4 line-clamp-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-heading font-bold text-xl text-primary flex items-center gap-1">
                                                <TbCurrencyTaka   size={24}/>{service.cost.toLocaleString()}
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-body font-semibold rounded-2xl hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
                        View All Services
                        <HiArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default ServicesSection