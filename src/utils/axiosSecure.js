import axios from "axios"

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
})

// Automatically attach token to every request
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

// If token expired → logout user automatically
axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token invalid or expired
            localStorage.removeItem("styleDecor-token")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default axiosSecure
