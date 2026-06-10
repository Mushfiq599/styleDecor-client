import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { HiArrowRight, HiMail } from "react-icons/hi"
import toast from "react-hot-toast"

const NewsletterSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate API — wire to backend /newsletter if needed
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSubscribed(true)
    toast.success("You're subscribed! 🎉")
    setEmail("")
  }

  return (
    <section ref={ref} className="py-24 bg-base-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <HiMail className="text-primary" size={28} />
          </div>

          <span className="section-label text-secondary bg-secondary/10">Stay Updated</span>

          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4 mt-2">
            Get Decoration <span className="text-primary">Inspiration</span>
          </h2>
          <p className="font-body text-base-content/60 mb-8 leading-relaxed">
            Subscribe to our newsletter and get exclusive decoration tips, seasonal ideas, and
            special offers delivered straight to your inbox.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 text-center"
            >
              <p className="font-body font-semibold text-primary text-lg">
                🎉 You're on the list!
              </p>
              <p className="font-body text-sm text-base-content/60 mt-1">
                We'll send you beautiful ideas soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <HiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                  size={18}
                />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  aria-label="Email address for newsletter"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-base-100 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    Subscribe <HiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="font-body text-xs text-base-content/40 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsletterSection