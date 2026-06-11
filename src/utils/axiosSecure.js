import axios from "axios"
import { API_URL } from "./apiUrl"

const axiosSecure = axios.create({
    baseURL: API_URL,
})

axiosSecure.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("styleDecor-token")
        if (token) {
            config.headers.authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        if (status === 401 || status === 403) {
            const hadToken = !!localStorage.getItem("styleDecor-token")
            localStorage.removeItem("styleDecor-token")

            // FIX: only force-redirect when there was actually a token present
            // (i.e. it expired / was invalid) AND we are on a dashboard route.
            // Without the `hadToken` guard, a startup race where the token
            // isn't saved yet could trigger a redirect loop on page load.
            const onDashboard = window.location.pathname.startsWith("/dashboard")
            if (hadToken && onDashboard) {
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default axiosSecure