import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix leaflet default marker icon bug in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const coverageAreas = [
    { name: "Dhaka Central", position: [23.8103, 90.4125], radius: 5000 },
    { name: "Gulshan", position: [23.7806, 90.4193], radius: 3000 },
    { name: "Dhanmondi", position: [23.7461, 90.3742], radius: 3000 },
    { name: "Mirpur", position: [23.8223, 90.3654], radius: 4000 },
    { name: "Uttara", position: [23.8759, 90.3795], radius: 3500 },
]

const MapSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-base-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block font-body text-xs font-medium text-secondary tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-secondary/10">
                        Where We Serve
                    </span>
                    <h2 className="font-heading text-4xl sm:text-5xl font-bold text-base-content mb-4">
                        Service <span className="text-secondary">Coverage</span>
                    </h2>
                    <p className="font-body text-base-content/60 max-w-xl mx-auto">
                        We currently serve these areas in Dhaka. More locations coming soon!
                    </p>
                </motion.div>

                {/* Map */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl overflow-hidden shadow-2xl border border-base-300 h-[450px]"
                >
                    <MapContainer
                        center={[23.8103, 90.4125]}
                        zoom={12}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {coverageAreas.map((area) => (
                            <div key={area.name}>
                                <Circle
                                    center={area.position}
                                    radius={area.radius}
                                    pathOptions={{
                                        color: "#0D9488",
                                        fillColor: "#0D9488",
                                        fillOpacity: 0.15,
                                        weight: 2,
                                    }}
                                />
                                <Marker position={area.position}>
                                    <Popup>
                                        <div className="font-body">
                                            <strong>{area.name}</strong>
                                            <br />
                                            <span className="text-xs text-gray-500">StyleDecor serves this area</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            </div>
                        ))}
                    </MapContainer>
                </motion.div>

            </div>
        </section>
    )
}

export default MapSection