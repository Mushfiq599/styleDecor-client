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
    (error) => {
        return Promise.reject(error)
    }
)

axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("styleDecor-token")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default axiosSecure
