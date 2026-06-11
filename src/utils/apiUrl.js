const VITE_API_URL = import.meta.env.VITE_API_URL

// If VITE_API_URL is not set or is pointing to localhost (happens when .env
// still has the dev value and hasn't been updated for production), fall back
// to the real deployed server URL.
const isLocalhost = !VITE_API_URL ||
  VITE_API_URL.includes("localhost") ||
  VITE_API_URL.includes("127.0.0.1")

export const API_URL = isLocalhost
  ? "https://styledecor-server-jm4k.onrender.com"
  : VITE_API_URL

export const wakeServer = () => {
    fetch(`${API_URL}/`).catch(() => { })
}