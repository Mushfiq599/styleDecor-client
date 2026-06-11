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
        // Do NOT auto-redirect to /login on 401/403.
        // The Render free-tier server sleeps and returns 401/503 on wake-up,
        // which was kicking the admin out every time. Route guards (PrivateRoute,
        // AdminRoute) handle access control — just pass the error through.
        return Promise.reject(error)
    }
)

export default axiosSecure