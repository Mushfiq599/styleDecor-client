import { motion, AnimatePresence } from "framer-motion"
import { HiX } from "react-icons/hi"

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`bg-base-100 rounded-3xl shadow-2xl w-full ${maxWidth} p-8 relative max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors"
              >
                <HiX size={16} />
              </button>

              {/* Header */}
              {(title || subtitle) && (
                <div className="mb-6 pr-8">
                  {title && (
                    <h2 className="font-heading text-2xl font-bold text-base-content">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="font-body text-sm text-base-content/60 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal