import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { HiArrowRight, HiClock, HiUser } from "react-icons/hi"
import { HiTag } from "react-icons/hi2"

const posts = [
  {
    id: 1,
    title: "10 Wedding Decoration Trends You'll Love in 2025",
    excerpt: "From intimate garden setups to luxurious ballroom arrangements, discover the decoration styles that are defining weddings this year. Our expert decorators share their top picks.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    category: "Wedding",
    author: "Rima Akhter",
    date: "December 10, 2024",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    title: "How to Transform Your Office Space for Better Productivity",
    excerpt: "A well-designed workspace isn't just aesthetically pleasing — it directly impacts your team's focus, creativity, and output. Here's how to do it right.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    category: "Office",
    author: "Kamal Hossain",
    date: "November 28, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Budget-Friendly Birthday Party Decoration Ideas",
    excerpt: "You don't need an unlimited budget to create a magical birthday experience. These creative, affordable ideas will make any birthday feel truly special.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    category: "Birthday",
    author: "Sadia Islam",
    date: "November 15, 2024",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 4,
    title: "Corporate Event Setup: A Complete Checklist",
    excerpt: "Planning a seminar or corporate gathering? This comprehensive checklist covers everything from venue layout to branding elements — don't miss a single detail.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    category: "Seminar",
    author: "Arif Rahman",
    date: "October 30, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 5,
    title: "The Psychology of Color in Interior Decoration",
    excerpt: "Colors profoundly influence how we feel in a space. Understanding color psychology can help you choose the right palette to create the mood you want in any room.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    category: "Home",
    author: "Tahmina Begum",
    date: "October 12, 2024",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Sustainable Decoration: Eco-Friendly Choices That Still Look Great",
    excerpt: "Being environmentally conscious doesn't mean compromising on style. Discover how our decorators incorporate sustainable materials and practices without sacrificing beauty.",
    image: "https://images.unsplash.com/photo-1416339134316-0e91dc9ded92?w=800&q=80",
    category: "Tips",
    author: "Rezaul Karim",
    date: "September 25, 2024",
    readTime: "5 min read",
    featured: false,
  },
]

const categoryColors = {
  Wedding:  "text-red-500   bg-red-500/10",
  Office:   "text-blue-500  bg-blue-500/10",
  Birthday: "text-yellow-500 bg-yellow-500/10",
  Seminar:  "text-purple-500 bg-purple-500/10",
  Home:     "text-primary   bg-primary/10",
  Tips:     "text-green-500 bg-green-500/10",
}

const Blog = () => {
  const featured  = posts.find((p) => p.featured)
  const rest      = posts.filter((p) => !p.featured)

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label text-primary bg-primary/10">Our Blog</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4 mt-2">
            Decoration <span className="text-primary">Insights</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-xl mx-auto">
            Tips, trends, and inspiration from our professional decorators to help you create stunning spaces.
          </p>
        </motion.div>

        {/* ── Featured post ── */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card overflow-hidden mb-12 group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body font-medium bg-primary text-white">
                  Featured
                </span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className={`inline-flex items-center gap-1.5 text-xs font-body font-medium px-3 py-1 rounded-full w-fit mb-4 ${categoryColors[featured.category]}`}>
                  <HiTag size={11} />{featured.category}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-base-content mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                  {featured.title}
                </h2>
                <p className="font-body text-base-content/60 text-sm leading-relaxed mb-6 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-body text-base-content/50">
                    <span className="flex items-center gap-1"><HiUser size={12} />{featured.author}</span>
                    <span className="flex items-center gap-1"><HiClock size={12} />{featured.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-body font-medium text-primary group-hover:gap-2 transition-all duration-300">
                    Read More <HiArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Post grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body font-medium ${categoryColors[post.category]}`}>
                    <HiTag size={10} />{post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading font-semibold text-lg text-base-content mb-3 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-base-content/60 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                  <div className="flex items-center gap-3 text-xs font-body text-base-content/50">
                    <span className="flex items-center gap-1"><HiUser size={12} />{post.author}</span>
                    <span className="flex items-center gap-1"><HiClock size={12} />{post.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-body font-medium text-primary group-hover:gap-2 transition-all duration-300">
                    Read <HiArrowRight size={12} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Newsletter CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 glass-card p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          <div className="relative">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-base-content mb-3">
              Never Miss an Article
            </h2>
            <p className="font-body text-base-content/60 text-sm mb-6 max-w-md mx-auto">
              Subscribe to get the latest decoration tips and trend reports delivered to your inbox.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Subscribe to Newsletter
              <HiArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Blog