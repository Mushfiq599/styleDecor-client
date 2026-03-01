import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { HiArrowRight, HiSparkles } from "react-icons/hi"
import { IoFlowerSharp } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { FcHome } from "react-icons/fc";
import { HiStar } from "react-icons/hi2"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    title: "Dream Wedding Setups",
    description: "Breathtaking floral arrangements and venue decoration for your perfect day.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80",
    title: "Luxury Home Interiors",
    description: "Transform your living space into a modern masterpiece.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
    title: "Grand Event Decoration",
    description: "Stunning stage and hall setups that leave lasting impressions.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80",
    title: "Celebration Setups",
    description: "Vibrant and joyful decorations for every special occasion.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full hero-swiper"
          style={{ height: "100vh" }}>
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute bottom-24 left-8 lg:left-16 z-10">
                  <p className="font-body text-xs text-white/60 tracking-widest uppercase mb-1">
                    Featured Project
                  </p>
                  <h4 className="font-heading text-white font-semibold text-xl">
                    {slide.title}
                  </h4>
                  <p className="font-body text-white/70 text-sm max-w-xs mt-1">
                    {slide.description}
                  </p>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[15%] z-20 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm hidden lg:flex items-center justify-center">
        <span className="text-2xl"><IoFlowerSharp color="#FF69B4" size={26}/></span>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[12%] z-20 w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm hidden lg:flex items-center justify-center">
        <span className="text-xl"><BsStars color="yellow" size={26}/></span>
      </motion.div>

      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-48 left-[20%] z-20 w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm hidden lg:flex items-center justify-center">
        <span className="text-lg"><FcHome size={26}/></span>
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
          <HiSparkles className="text-primary" size={16} />
          <span className="font-body text-xs font-medium text-white tracking-wider uppercase">
            Premium Decoration Services
          </span>
          <HiSparkles className="text-primary" size={16} />
        </motion.div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6">
          Transform Your
          <br />
          <span className="relative inline-block">
            <span className="text-primary">Space</span>
          </span>
          {" "}Into
          <br />
          Something{" "}
          <span className="text-secondary">Magical</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="font-body text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          From intimate home makeovers to grand ceremony setups — our expert decorators
          bring your vision to life with precision, creativity, and passion.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/services"
            className="group flex items-center gap-3 px-8 py-4 bg-primary text-white font-body font-semibold rounded-2xl hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
            Book Decoration Service
            <HiArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"/>
          </Link>
          <Link
            to="/services"
            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-body font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
            Explore Services
          </Link>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "https://ui-avatars.com/api/?name=Rahim+Khan&background=0D9488&color=fff",
                "https://ui-avatars.com/api/?name=Priya+Das&background=F97316&color=fff",
                "https://ui-avatars.com/api/?name=Karim+Ali&background=0D9488&color=fff",
                "https://ui-avatars.com/api/?name=Nadia+Islam&background=F97316&color=fff",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="w-9 h-9 rounded-full border-2 border-white/50 overflow-hidden">
                  <img src={src} alt="customer" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="text-secondary" size={14} />
                ))}
              </div>
              <p className="font-body text-xs text-white/60 ">
                <span className="font-semibold text-white">500+</span> happy clients
              </p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/20" />
          <div className="text-center sm:text-left">
            <p className="font-heading font-bold text-2xl text-white">4.9/5</p>
            <p className="font-body text-xs text-white/60">Average Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection