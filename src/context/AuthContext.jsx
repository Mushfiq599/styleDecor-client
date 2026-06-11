import { createContext, useEffect, useState } from "react"
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
import { API_URL } from "../utils/apiUrl"

export const AuthContext = createContext(null)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null)
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
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Set user and stop loading IMMEDIATELY — don't wait for the JWT fetch.
            // Previously the fetch was awaited before setUser/setLoading, so a slow
            // or sleeping Render backend caused PrivateRoute to see user=null and
            // redirect to /login even though Firebase had confirmed authentication.
            setUser(currentUser)
            setLoading(false)

            if (currentUser?.email) {
                // Fetch JWT in the background — non-blocking
                axios.post(`${API_URL}/auth/jwt`, { email: currentUser.email })
                    .then((res) => {
                        localStorage.setItem("styleDecor-token", res.data.token)
                    })
                    .catch(() => {
                        // Only remove token if there isn't already a valid one stored.
                        // A slow/sleeping Render server should not log the user out.
                        if (!localStorage.getItem("styleDecor-token")) {
                            localStorage.removeItem("styleDecor-token")
                        }
                    })
            } else {
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