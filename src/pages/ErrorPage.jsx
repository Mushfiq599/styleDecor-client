import { useNavigate, useRouteError, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HiHome, HiArrowLeft } from "react-icons/hi"

const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg mx-auto"
      >

        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", damping: 15 }}
          className="mb-6"
        >
          <h1 className="font-heading font-bold text-[10rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary select-none">
            404
          </h1>
        </motion.div>

        {/* Floating emoji */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6 block"
        >
          🎨
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-heading text-3xl font-bold text-base-content mb-3">
            Oops! Page Not Found
          </h2>
          <p className="font-body text-base-content/60 mb-2">
            Looks like this page got decorated out of existence!
          </p>
          {error?.statusText || error?.message ? (
            <p className="font-body text-sm text-red-400 mb-8 px-4 py-2 rounded-xl bg-red-500/10 inline-block">
              {error?.statusText || error?.message}
            </p>
          ) : (
            <div className="mb-8" />
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3.5 bg-base-200 text-base-content font-body font-medium rounded-xl hover:bg-base-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            <HiArrowLeft size={18} />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <HiHome size={18} />
            Back to Home
          </Link>
        </motion.div>

        {/* Decorative bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-xs text-base-content/30 mt-12"
        >
          StyleDecor © 2025 · All Rights Reserved
        </motion.p>

      </motion.div>
    </div>
  )
}

export default ErrorPage