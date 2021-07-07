import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar'
import AuthContext from '../context/auth.context'
import '../i18next'
import { useState } from 'react'
import User from '../interfaces/user.interface'
import config from '../config'

function MyApp({ Component, pageProps }: AppProps) {
    const initialUser = {
        id: "",
        username: "",
        discriminator: "",
        avatar: "",
        verified: false,
        bots: [],
        role: "",
    }

    const [user, setUser] = useState<User>(initialUser)
    async function login() {
        const token = localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY)
        if (!token) return
        const res = await fetch(`${config.SERVER_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        if ((data.message === "Unauthorized" && data.statusCode === 401) || user.id) return
        setUser(data)
    }

    async function logout() {
        setUser(initialUser)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <NextNprogress
                color="#1d1f23"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
            />
            <Component {...pageProps} />
        </AuthContext.Provider>
    )
}

export default MyApp
