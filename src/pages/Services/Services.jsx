import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { API_URL } from "../../utils/apiUrl"
import { HiSearch, HiFilter } from "react-icons/hi"
import { HiChevronUpDown } from "react-icons/hi2"
import ServiceCard, { ServiceCardSkeleton } from "../../components/ui/ServiceCard"
import Pagination from "../../components/ui/Pagination"

// ✅ FIXED: added "festival" and "exhibition" to match seed.js categories
const categories = [
  "all",
  "home",
  "wedding",
  "office",
  "seminar",
  "meeting",
  "birthday",
  "festival",
  "exhibition",
]

const sortOptions = [
  { value: "newest",     label: "Newest First" },
  { value: "oldest",     label: "Oldest First" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc",   label: "Name: A–Z" },
]

const ITEMS_PER_PAGE = 12

const Services = () => {
  const [services, setServices]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [category, setCategory]       = useState("all")
  const [minCost, setMinCost]         = useState("")
  const [maxCost, setMaxCost]         = useState("")
  const [sortBy, setSortBy]           = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search)             params.search   = search
      if (category !== "all") params.category = category
      if (minCost)            params.minCost  = minCost
      if (maxCost)            params.maxCost  = maxCost
      const res = await axios.get(`${API_URL}/services`, { params })
      setServices(res.data)
      setCurrentPage(1)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchServices, 350)
    return () => clearTimeout(timer)
  }, [search, category, minCost, maxCost])

  // Client-side sort
  const sorted = [...services].sort((a, b) => {
    if (sortBy === "price-asc")  return a.cost - b.cost
    if (sortBy === "price-desc") return b.cost - a.cost
    if (sortBy === "name-asc")   return a.service_name.localeCompare(b.service_name)
    if (sortBy === "oldest")     return new Date(a.createdAt) - new Date(b.createdAt)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated  = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSortChange = (val) => { setSortBy(val); setCurrentPage(1) }
  const handleCategory   = (cat) => { setCategory(cat); setCurrentPage(1) }

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label text-primary bg-primary/10">All Services</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4 mt-2">
            Our Decoration <span className="text-primary">Services</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Browse all our decoration packages and find the perfect match for your space or event.
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-5 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <HiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                size={18}
              />
              <input
                id="services-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                aria-label="Search services"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
            </div>

            {/* Price range */}
            <div className="flex items-center gap-2">
              <HiFilter className="text-base-content/40 flex-shrink-0" size={18} />
              <input
                type="number"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                placeholder="Min ৳"
                aria-label="Minimum price"
                className="w-28 px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
              <span className="font-body text-sm text-base-content/40">–</span>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="Max ৳"
                aria-label="Maximum price"
                className="w-28 px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <HiChevronUpDown className="text-base-content/40 flex-shrink-0" size={18} />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort services"
                className="px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-body text-xs font-medium capitalize transition-all duration-200 ${
                  category === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result count */}
        {!loading && (
          <p className="font-body text-sm text-base-content/50 mb-6">
            Showing{" "}
            <span className="font-semibold text-base-content">{paginated.length}</span> of{" "}
            <span className="font-semibold text-base-content">{sorted.length}</span> services
          </p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
              No services found
            </h3>
            <p className="font-body text-sm text-base-content/60">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginated.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Services