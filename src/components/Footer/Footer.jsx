import { Link } from "react-router-dom"
import {
  FaFacebook, FaInstagram, FaYoutube,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-base-content">
                Style<span className="text-primary">Decor</span>
              </span>
            </Link>
            <p className="font-body text-sm text-base-content/60 leading-relaxed mb-5">
              Premium decoration services for every occasion — weddings, offices, birthdays and more. Transforming spaces into memories since 2020.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FaFacebook size={16} />, href: "#", label: "Facebook" },
                { icon: <FaInstagram size={16} />, href: "#", label: "Instagram" },
                { icon: <FaXTwitter size={16} />, href: "#", label: "Twitter" },
                { icon: <FaYoutube size={16} />, href: "#", label: "YouTube" },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-base-300 text-base-content/60 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h3 className="font-heading font-semibold text-base text-base-content mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: "/",         label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/about",    label: "About Us" },
                { to: "/blog",     label: "Blog" },
                { to: "/contact",  label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-body text-sm text-base-content/60 hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h3 className="font-heading font-semibold text-base text-base-content mb-4">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                "Wedding Decoration",
                "Home Interior",
                "Office Setup",
                "Birthday Events",
                "Seminar Setups",
                "Corporate Meetings",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="font-body text-sm text-base-content/60 hover:text-primary transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="font-heading font-semibold text-base text-base-content mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:hello@styledecor.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <HiMail size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-base-content/40 uppercase tracking-wider">Email</p>
                    <p className="font-body text-sm text-base-content/70 group-hover:text-primary transition-colors">
                      hello@styledecor.com
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <HiPhone size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-base-content/40 uppercase tracking-wider">Phone</p>
                    <p className="font-body text-sm text-base-content/70 group-hover:text-primary transition-colors">
                      +880 1234-567890
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HiLocationMarker size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-base-content/40 uppercase tracking-wider">Address</p>
                    <p className="font-body text-sm text-base-content/70">
                      House 12, Road 5, Dhanmondi<br />Dhaka 1205, Bangladesh
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-sm text-base-content/50">
            © {year} StyleDecor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="font-body text-xs text-base-content/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/blog" className="font-body text-xs text-base-content/50 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer