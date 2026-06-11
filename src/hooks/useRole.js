import { useEffect, useState } from "react"
import useAuth from "./useAuth"
import axiosSecure from "../utils/axiosSecure"

const useRole = () => {
    const { user, loading } = useAuth()
    const [role, setRole]               = useState(null)
    const [roleLoading, setRoleLoading] = useState(true)

    useEffect(() => {
        // Don't fetch until Firebase + JWT are both ready
        if (loading) return

        if (!user?.email) {
            setRole(null)
            setRoleLoading(false)
            return
        }

        const fetchRole = async () => {
            try {
                const res = await axiosSecure.get(`/users/role/${user.email}`)
                setRole(res.data.role)
            } catch {
                // FIX: Don't fake a "user" role on failure.
                // Returning null lets AdminRoute/DecoratorRoute redirect
                // correctly instead of silently showing the wrong panel.
                setRole(null)
            } finally {
                setRoleLoading(false)
            }
        }

        fetchRole()
    }, [user, loading])

    return [role, roleLoading]
}

export default useRole