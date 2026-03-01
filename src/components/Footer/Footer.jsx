import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaRegCopyright, FaRegClock } from "react-icons/fa"
import { FaXTwitter, FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="bg-base-200 border-t border-base-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                                <img src="./logo.png" alt="Logo" className="rounded-lg"/>
                            </div>
                            <span className="font-heading font-bold text-xl text-base-content">
                                Style<span className="text-primary">Decor</span>
                            </span>
                        </div>
                        <p className="font-body text-sm text-base-content/60 leading-relaxed max-w-xs">
                            Your trusted partner for home and ceremony decoration. We bring your vision to life with elegance and creativity.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-heading font-semibold text-base-content mb-4">Quick Links</h4>
                        <ul className="flex flex-col gap-2">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Services", path: "/services" },
                                { name: "About", path: "/about" },
                                { name: "Contact", path: "/contact" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="font-body text-sm text-base-content/60 hover:text-primary transition-colors duration-200">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-heading font-semibold text-base-content mb-4">Contact</h4>
                        <ul className="flex flex-col gap-2">
                            <li className="flex gap-1 items-center font-body text-sm text-base-content/60 hover:text-primary"><FaLocationDot size={14} /> Dhaka, Bangladesh</li>
                            <li className="flex gap-1 items-center font-body text-sm text-base-content/60 hover:text-secondary"><BsFillTelephoneFill size={14}/> +880 1234-567890</li>
                            <li className="flex gap-1 items-center font-body text-sm text-base-content/60 hover:text-primary"><MdOutlineAlternateEmail size={14}/> hello@styledecor.com</li>
                            <li className="flex gap-1 items-center font-body text-sm text-base-content/60 hover:text-secondary"><FaRegClock size={14}/> Sat–Thu: 9AM – 8PM</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-base-300 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body text-xs text-base-content/40 flex gap-1">
                        <FaRegCopyright size={14}/>2026 StyleDecor. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.facebook.com/"
                            className="text-base-content/40 hover:text-primary transition-colors duration-200">
                            <FaFacebook size={16} />
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            className="text-base-content/40 hover:text-primary transition-colors duration-200">
                            <FaInstagram size={16} />
                        </a>
                        <a
                            href="https://www.x.com/"
                            className="text-base-content/40 hover:text-secondary transition-colors duration-200">
                            <FaXTwitter size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer