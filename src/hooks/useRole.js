import { useEffect, useState } from "react"
import useAuth from "./useAuth"
import axiosSecure from "../utils/axiosSecure"

const useRole = () => {
    const { user, loading, tokenReady } = useAuth()
    const [role, setRole]               = useState(null)
    const [roleLoading, setRoleLoading] = useState(true)

    useEffect(() => {
        // Wait until Firebase auth AND the JWT fetch are both complete.
        // Without tokenReady, the role request fires before the token is saved
        // to localStorage, gets a 401, and role stays null — locking admins out.
        if (loading || !tokenReady) return

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
                setRole(null)
            } finally {
                setRoleLoading(false)
            }
        }

        fetchRole()
    }, [user, loading, tokenReady])

    return [role, roleLoading]
}

export default useRole