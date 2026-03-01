import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
    {
        step: "01",
        icon: "🔍",
        title: "Browse Services",
        description: "Explore our wide range of decoration packages and find the perfect match for your space or event.",
    },
    {
        step: "02",
        icon: "📅",
        title: "Book & Schedule",
        description: "Select your preferred date, time and decorator. Fill in your location and event details.",
    },
    {
        step: "03",
        icon: "💳",
        title: "Make Payment",
        description: "Securely pay for your selected package online. Instant confirmation sent to your email.",
    },
    {
        step: "04",
        icon: "🎨",
        title: "We Decorate",
        description: "Our expert team arrives on time, sets up everything beautifully and keeps you updated.",
    },
]

const HowItWorksSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-base-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16">
                    <span className="inline-block font-body text-xs font-medium text-secondary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-secondary/10">
                        Simple Process
                    </span>
                    <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
                        How It <span className="text-secondary">Works</span>
                    </h2>
                    <p className="font-body text-base-content/60 max-w-xl mx-auto">
                        Getting your space decorated is just 4 simple steps away.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-secondary/40 to-primary/20 z-0" />
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 flex flex-col items-center text-center">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-24 h-24 rounded-2xl bg-base-100 border-2 border-base-300 flex items-center justify-center mb-6 shadow-lg group-hover:border-primary transition-colors duration-300 relative">
                                <span className="text-4xl">{step.icon}</span>
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white font-heading font-bold text-xs flex items-center justify-center shadow-lg">
                                    {step.step}
                                </span>
                            </motion.div>
                            <h3 className="font-heading font-semibold text-lg text-base-content mb-2">
                                {step.title}
                            </h3>
                            <p className="font-body text-sm text-base-content/60 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection