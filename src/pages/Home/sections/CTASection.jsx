import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Link } from "react-router-dom"
import { HiArrowRight, HiPhone } from "react-icons/hi"

const CTASection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
          alt="decoration background"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label text-secondary bg-secondary/20">
              Limited Slots Available
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 mt-2">
              Ready to Transform
              <br />
              <span className="text-primary">Your Space?</span>
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Join hundreds of happy clients who trusted StyleDecor to bring their vision to life.
              Book today and get a free consultation with our expert decorators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-body font-semibold rounded-2xl hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                Book a Service
                <HiArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <a
                href="tel:+8801234567890"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-body font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <HiPhone size={18} />
                Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection