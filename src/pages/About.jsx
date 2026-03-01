import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { HiArrowRight } from "react-icons/hi"
import { IoIosColorPalette } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { HiEmojiHappy } from "react-icons/hi";
import { HiMiniTrophy } from "react-icons/hi2";
import { FcIdea } from "react-icons/fc";
import { GiBullseye } from "react-icons/gi";
import { PiHandshake } from "react-icons/pi";


const stats = [
    { value: "500+", label: "Happy Clients", icon: <HiEmojiHappy color="Orange" /> },
    { value: "1200+", label: "Projects Done", icon: <HiMiniTrophy color="Orange"/> },
    { value: "50+", label: "Expert Decorators", icon: <IoIosColorPalette color="Orange"/>},
    { value: "4.9", label: "Average Rating", icon: <FaStar color="Orange"/> },
]

const team = [
    {
        name: "Ayesha Rahman",
        role: "Founder & CEO",
        image: "https://ui-avatars.com/api/?name=Ayesha+Rahman&background=0D9488&color=fff&size=200",
        bio: "10+ years of decoration experience with a passion for transforming spaces.",
    },
    {
        name: "Karim Hossain",
        role: "Head of Operations",
        image: "https://ui-avatars.com/api/?name=Karim+Hossain&background=F97316&color=fff&size=200",
        bio: "Expert in managing large scale decoration projects and decorator teams.",
    },
    {
        name: "Nadia Islam",
        role: "Lead Designer",
        image: "https://ui-avatars.com/api/?name=Nadia+Islam&background=0D9488&color=fff&size=200",
        bio: "Award winning designer specializing in wedding and ceremony decorations.",
    },
    {
        name: "Rahim Chowdhury",
        role: "Senior Decorator",
        image: "https://ui-avatars.com/api/?name=Rahim+Chowdhury&background=F97316&color=fff&size=200",
        bio: "Specialist in home interiors and office space transformations.",
    },
]

const values = [
    {
        icon: <GiBullseye color="#F97316"/>,
        title: "Precision",
        description: "Every detail matters. We execute each project with meticulous attention to detail.",
    },
    {
        icon: <FcIdea />,
        title: "Creativity",
        description: "We bring fresh ideas and unique concepts to every decoration project.",
    },
    {
        icon: <PiHandshake color="#F97316"/>,
        title: "Trust",
        description: "We build lasting relationships with our clients based on honesty and reliability.",
    },
    {
        icon: "⚡",
        title: "Efficiency",
        description: "We deliver on time every time without compromising on quality.",
    },
]

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
}

const About = () => {
    return (
        <div className="min-h-screen bg-base-100">
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}>
                            <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
                                About Us
                            </span>
                            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-base-content leading-tight mb-6">
                                We Transform Spaces Into
                                <span className="text-primary"> Memories</span>
                            </h1>
                            <p className="font-body text-base-content/60 leading-relaxed mb-6">
                                StyleDecor was founded in 2018 with a simple mission — to make professional decoration services accessible to everyone. From intimate home makeovers to grand wedding ceremonies, we bring creativity and expertise to every project.
                            </p>
                            <p className="font-body text-base-content/60 leading-relaxed mb-8">
                                Our team of 50+ expert decorators has completed over 1200 projects across Dhaka, serving hundreds of happy clients with a consistent 4.9 star rating.
                            </p>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
                                Explore Our Services
                                <HiArrowRight size={18} />
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="grid grid-cols-2 gap-4">
                            {[
                                "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
                                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
                                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
                                "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
                            ].map((src, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-48" : "h-36"}`}>
                                    <img
                                        src={src}
                                        alt="decoration"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"/>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="glass-card p-6 text-center items-center justify-center">
                                <span className="text-4xl mb-3 flex justify-center">{stat.icon}</span>
                                <p className="font-heading font-bold text-3xl text-primary mb-1">
                                    {stat.value}
                                </p>
                                <p className="font-body text-sm text-base-content/60">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 bg-base-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16">
                        <span className="inline-block font-body text-xs font-medium text-secondary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-secondary/10">
                            What Drives Us
                        </span>
                        <h2 className="font-heading text-4xl font-bold text-base-content mb-4">
                            Our Core <span className="text-secondary">Values</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="glass-card p-6 text-center group hover:-translate-y-2 transition-transform duration-300">
                                <span className="text-5xl flex justify-center mb-4">{value.icon}</span>
                                <h3 className="font-heading font-semibold text-lg text-base-content mb-2">
                                    {value.title}
                                </h3>
                                <p className="font-body text-sm text-base-content/60 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16">
                        <span className="inline-block font-body text-xs font-medium text-primary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
                            The People Behind StyleDecor
                        </span>
                        <h2 className="font-heading text-4xl font-bold text-base-content mb-4">
                            Meet Our <span className="text-primary">Team</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="glass-card p-6 text-center group hover:-translate-y-2 transition-transform duration-300">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover border-2 border-primary/20 group-hover:border-primary transition-colors duration-300"/>
                                <h3 className="font-heading font-semibold text-base text-base-content mb-1">
                                    {member.name}
                                </h3>
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium mb-3">
                                    {member.role}
                                </span>
                                <p className="font-body text-xs text-base-content/60 leading-relaxed">
                                    {member.bio}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 bg-base-100">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}>
                        <h2 className="font-heading text-4xl font-bold text-base-content mb-4">
                            Ready to Transform
                            <span className="text-primary"> Your Space?</span>
                        </h2>
                        <p className="font-body text-base-content/60 mb-8">
                            Join hundreds of happy clients who trusted StyleDecor to bring their vision to life.
                        </p>
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-body font-semibold rounded-2xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
                            Book a Service Today
                            <HiArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default About