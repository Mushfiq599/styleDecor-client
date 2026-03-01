import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { IoIosColorPalette } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { HiEmojiHappy } from "react-icons/hi";
import { HiMiniTrophy } from "react-icons/hi2";
import { useRef } from "react"

const stats = [
    { value: "500+", label: "Happy Clients", icon: <HiEmojiHappy color="Orange" /> },
    { value: "1200+", label: "Projects Done", icon: <HiMiniTrophy color="Orange"/> },
    { value: "50+", label: "Expert Decorators", icon: <IoIosColorPalette color="Orange"/>},
    { value: "4.9", label: "Average Rating", icon: <FaStar color="Orange"/> },
]
const StatsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-16 bg-base-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                className="text-4xl flex justify-center mb-3">
                                {stat.icon}
                            </motion.span>
                            <p className="font-heading font-bold text-3xl text-primary mb-1">
                                {stat.value}
                            </p>
                            <p className="font-body text-sm text-base-content/60">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StatsSection