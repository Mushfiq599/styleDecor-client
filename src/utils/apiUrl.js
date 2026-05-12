export const API_URL = import.meta.env.VITE_API_URL || "https://styledecor-server-jm4k.onrender.com"

export const wakeServer = () => {
    fetch(`${API_URL}/`).catch(() => { })
}