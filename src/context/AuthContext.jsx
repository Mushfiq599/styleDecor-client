import { createContext, useContext, useEffect, useState } from "react"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth"
import { auth } from "../firebase.config"
import axios from "axios"

export const AuthContext = createContext(null)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const register = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleLogin = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const logout = () => {
        setLoading(true)
        // Remove token from localStorage on logout
        localStorage.removeItem("styleDecor-token")
        return signOut(auth)
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            setLoading(false)

            if (currentUser?.email) {
                // ── Request JWT token from our server ──
                try {
                    const res = await axios.post("http://localhost:5000/auth/jwt", {
                        email: currentUser.email,
                    })
                    // Store token in localStorage
                    localStorage.setItem("styleDecor-token", res.data.token)
                } catch (error) {
                    console.error("Failed to get JWT token:", error)
                }
            } else {
                // User logged out — remove token
                localStorage.removeItem("styleDecor-token")
            }
        })

        return () => unsubscribe()
    }, [])

    const authInfo = {
        user,
        loading,
        register,
        login,
        googleLogin,
        logout,
        updateUserProfile,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider