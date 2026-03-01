import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios"
import { HiSearch, HiFilter, HiArrowRight } from "react-icons/hi"
import { TbCurrencyTaka } from "react-icons/tb";

const categoryColors = {
  home: "bg-primary/10 text-primary",
  wedding: "bg-pink-500/10 text-pink-500",
  office: "bg-blue-500/10 text-blue-500",
  seminar: "bg-purple-500/10 text-purple-500",
  meeting: "bg-secondary/10 text-secondary",
  birthday: "bg-yellow-500/10 text-yellow-500",
}

const categories = ["all", "home", "wedding", "office", "seminar", "meeting", "birthday"]
const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [minCost, setMinCost] = useState("")
  const [maxCost, setMaxCost] = useState("")

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category !== "all") params.category = category
      if (minCost) params.minCost = minCost
      if (maxCost) params.maxCost = maxCost

      const res = await axios.get("http://localhost:5000/services", { params })
      setServices(res.data)
    } catch (error) {
      console.error("Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices()
    }, 400)
    return () => clearTimeout(timer)
  }, [search, category, minCost, maxCost])

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
            All Services
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
            Our Decoration
            <span className="text-primary"> Services</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Browse all our decoration packages and find the perfect match for your space or event.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                size={18}/>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
            </div>
            <div className="flex items-center gap-2">
              <HiFilter className="text-base-content/40 flex-shrink-0" size={18} />
              <input
                type="number"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                placeholder="Min "
                className="w-28 px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
              <span className="font-body text-sm text-base-content/40">to</span>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="Max "
                className="w-28 px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"/>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-body text-xs font-medium capitalize transition-all duration-200 ${category === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
                  }`}>
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </motion.div>
        <p className="font-body text-sm text-base-content/50 mb-6">
          Showing{" "}
          <span className="font-semibold text-base-content">
            {services.length}
          </span>{" "}
          services
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4"><HiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
              size={18}
            /></span>
            <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
              No services found
            </h3>
            <p className="font-body text-sm text-base-content/60">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}>
                <Link
                  to={`/services/${service._id}`}
                  className="group block glass-card overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.service_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
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
                        <span className="flex items-center font-heading font-bold text-xl text-primary">
                          <TbCurrencyTaka  size={24}/>{service.cost.toLocaleString()}
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
        )}
      </div>
    </div>
  )
}

export default Services