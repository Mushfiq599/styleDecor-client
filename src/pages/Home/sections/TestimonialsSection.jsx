import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { HiStar } from "react-icons/hi2"
import { BsQuote } from "react-icons/bs"

const testimonials = [
  {
    id: 1,
    name: "Tahmina Begum",
    role: "Wedding Client",
    image: "https://ui-avatars.com/api/?name=Tahmina+Begum&background=0D9488&color=fff&size=200",
    rating: 5,
    text: "StyleDecor transformed our wedding venue beyond our wildest dreams. Every detail was perfect — from the floral arrangements to the lighting. Our guests could not stop complimenting the setup!",
  },
  {
    id: 2,
    name: "Rezaul Karim",
    role: "Office Interior Client",
    image: "https://ui-avatars.com/api/?name=Rezaul+Karim&background=F97316&color=fff&size=200",
    rating: 5,
    text: "We hired StyleDecor to redesign our office space and the results were incredible. The team was professional, on time, and the finished space has genuinely improved our team's productivity.",
  },
  {
    id: 3,
    name: "Sadia Islam",
    role: "Birthday Party Client",
    image: "https://ui-avatars.com/api/?name=Sadia+Islam&background=0D9488&color=fff&size=200",
    rating: 5,
    text: "My daughter's birthday party was absolutely magical thanks to StyleDecor. They listened to every idea and brought them to life with stunning balloon art and themed decorations.",
  },
  {
    id: 4,
    name: "Arif Hossain",
    role: "Seminar Organizer",
    image: "https://ui-avatars.com/api/?name=Arif+Hossain&background=F97316&color=fff&size=200",
    rating: 5,
    text: "We needed a professional setup for our annual company seminar. StyleDecor delivered an elegant, brand-consistent environment that impressed all our stakeholders. Will definitely book again.",
  },
]

const TestimonialsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 bg-base-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label text-primary bg-primary/10">Client Stories</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Real feedback from real customers who trusted us with their most important moments.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-6 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300"
            >
              <BsQuote className="text-primary/20" size={32} />

              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <HiStar key={j} className="text-secondary" size={14} />
                ))}
              </div>

              <p className="font-body text-sm text-base-content/70 leading-relaxed flex-1">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-base-300">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2 border-primary/20"
                />
                <div>
                  <p className="font-body font-semibold text-sm text-base-content">{t.name}</p>
                  <p className="font-body text-xs text-base-content/50">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection