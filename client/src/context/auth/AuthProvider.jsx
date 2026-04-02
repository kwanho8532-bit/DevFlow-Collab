import { useState, useEffect } from 'react'
import api from '../../component/api/axios'
import { AuthStateContext } from './AuthStateContext'
import { AuthActionContext } from './AuthActionContext'

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        async function getAuth() {
            try {
                const { data } = await api.get('/me/auth', { withCredentials: true })
                console.log(auth)
                setAuth(data.user)
            } catch (err) {
                console.log(err)
                setAuth(err.response.data.user)
            } finally {
                setAuthLoading(false)
            }
        }
        getAuth()
    }, [])

    const changeAuth = (auth) => {
        setAuth(auth)
    }

    return (
        <AuthStateContext.Provider value={{ auth, authLoading }}>
            <AuthActionContext.Provider value={changeAuth}>
                {children}
            </AuthActionContext.Provider>
        </AuthStateContext.Provider>
    )
}