// const VITE_API_URL = import.meta.env.VITE_API_URL

// const isLocalhost = !VITE_API_URL ||
//   VITE_API_URL.includes("localhost") ||
//   VITE_API_URL.includes("127.0.0.1")

// export const API_URL = isLocalhost
//   ? "https://styledecor-server-jm4k.onrender.com"
//   : VITE_API_URL

// export const wakeServer = () => {
//     fetch(`${API_URL}/`).catch(() => { })
// }

const VITE_API_URL = import.meta.env.VITE_API_URL

// Only fall back to the deployed server when VITE_API_URL isn't set at all.
// (Previously this also overrode any "localhost" value, which meant local
// dev always hit the production server instead of your local backend.)
export const API_URL = VITE_API_URL || "https://styledecor-server-jm4k.onrender.com"

export const wakeServer = () => {
    fetch(`${API_URL}/`).catch(() => { })
}