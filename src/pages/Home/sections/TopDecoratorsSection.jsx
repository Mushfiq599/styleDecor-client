import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { HiStar } from "react-icons/hi2"
import { Link } from "react-router-dom"

const dummyDecorators = [
  {
    _id: "1",
    name: "Ayesha Rahman",
    specialty: ["Wedding", "Home"],
    rating: 4.9,
    projects: 120,
    image: "https://ui-avatars.com/api/?name=Ayesha+Rahman&background=0D9488&color=fff&size=200",
  },
  {
    _id: "2",
    name: "Karim Hossain",
    specialty: ["Office", "Seminar"],
    rating: 4.8,
    projects: 95,
    image: "https://ui-avatars.com/api/?name=Karim+Hossain&background=F97316&color=fff&size=200",
  },
  {
    _id: "3",
    name: "Nadia Islam",
    specialty: ["Wedding", "Birthday"],
    rating: 4.9,
    projects: 140,
    image: "https://ui-avatars.com/api/?name=Nadia+Islam&background=0D9488&color=fff&size=200",
  },
  {
    _id: "4",
    name: "Rahim Chowdhury",
    specialty: ["Home", "Office"],
    rating: 4.7,
    projects: 80,
    image: "https://ui-avatars.com/api/?name=Rahim+Chowdhury&background=F97316&color=fff&size=200",
  },
]

const TopDecoratorsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
            Meet The Team
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
            Top <span className="text-primary">Decorators</span>
          </h2>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Our most loved decorators, rated by hundreds of happy clients.
          </p>
        </motion.div>

        {/* Decorators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyDecorators.map((decorator, i) => (
            <motion.div
              key={decorator._id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={decorator.image}
                  alt={decorator.name}
                  className="w-full h-full rounded-2xl object-cover border-2 border-primary/20 group-hover:border-primary transition-colors duration-300"
                />
                {/* Online badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-base-100" />
              </div>

              <h3 className="font-heading font-semibold text-base text-base-content mb-1">
                {decorator.name}
              </h3>

              {/* Specialties */}
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {decorator.specialty.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, j) => (
                  <HiStar
                    key={j}
                    size={14}
                    className={j < Math.floor(decorator.rating) ? "text-secondary" : "text-base-300"}
                  />
                ))}
                <span className="font-body text-xs font-semibold text-base-content ml-1">
                  {decorator.rating}
                </span>
              </div>

              <p className="font-body text-xs text-base-content/50">
                {decorator.projects} projects completed
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default TopDecoratorsSection