import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HiArrowRight } from "react-icons/hi"
import { TbCurrencyTaka } from "react-icons/tb"
import Badge from "./Badge"

const categoryVariant = {
  home: "primary",
  wedding: "danger",
  office: "info",
  seminar: "neutral",
  meeting: "secondary",
  birthday: "warning",
}

/* ── Skeleton ── */
export const ServiceCardSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="h-52 skeleton-shimmer" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-4 skeleton-shimmer rounded w-3/4" />
      <div className="h-3 skeleton-shimmer rounded w-full" />
      <div className="h-3 skeleton-shimmer rounded w-2/3" />
      <div className="flex items-center justify-between mt-2">
        <div className="h-5 skeleton-shimmer rounded w-1/3" />
        <div className="h-4 skeleton-shimmer rounded w-1/4" />
      </div>
    </div>
  </div>
)

/* ── Card ── */
const ServiceCard = ({ service, index = 0, animate = true }) => {
  const card = (
    <Link
      to={`/services/${service._id}`}
      className="group block glass-card overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.image}
          alt={service.service_name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={categoryVariant[service.service_category] || "primary"}>
            {service.service_category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-base-content mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {service.service_name}
        </h3>
        <p className="font-body text-sm text-base-content/60 mb-4 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="flex items-center font-heading font-bold text-xl text-primary">
              <TbCurrencyTaka size={24} />
              {service.cost.toLocaleString()}
            </span>
            <span className="font-body text-xs text-base-content/50">
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
  )

  if (!animate) return card

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {card}
    </motion.div>
  )
}

export default ServiceCard