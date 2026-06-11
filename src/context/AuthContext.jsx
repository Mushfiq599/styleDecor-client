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
    const [user, setUser]           = useState(null)
    const [loading, setLoading]     = useState(true)
    const [tokenReady, setTokenReady] = useState(false)

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
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Set user + stop loading IMMEDIATELY so PrivateRoute doesn't redirect
            setUser(currentUser)
            setLoading(false)

            if (currentUser?.email) {
                try {
                    const res = await axios.post(`${API_URL}/auth/jwt`, {
                        email: currentUser.email,
                    })
                    localStorage.setItem("styleDecor-token", res.data.token)
                } catch {
                    localStorage.removeItem("styleDecor-token")
                }
            } else {
                localStorage.removeItem("styleDecor-token")
            }

            // Signal that the JWT fetch attempt is complete (success or failure).
            // useRole waits for this before calling /users/role/:email so it
            // always has a token in localStorage when it makes the request.
            setTokenReady(true)
        })

        return () => unsubscribe()
    }, [])

    const authInfo = {
        user,
        loading,
        tokenReady,
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