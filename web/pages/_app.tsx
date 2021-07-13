import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar'
import AuthContext from '../context/auth.context'
import '../i18next'
import { useEffect, useState } from 'react'
import User from '../interfaces/user.interface'
import config from '../config'
import router from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
    const initialUser = {
        id: '',
        username: '',
        discriminator: '',
        avatar: '',
        verified: false,
        bots: [],
        role: '',
        bio: '',
        social: {
            github: '',
            vk: '',
            youtube: '',
            twitch: '',
            reddit: '',
            twitter: '',
            instagram: '',
            steam: '',
            facebook: '',
            telegram: '',
            spotify: ''
        },
        followers: [],
        following: []
    }

    const [user, setUser] = useState<User>(initialUser)

    async function login() {
        const token = localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY)
        if (!token || user.id) return
        const res = await fetch(`${config.SERVER_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        if (data.message === 'Unauthorized' && data.statusCode === 401) return
        setUser(data)
    }

    async function logout() {
        router.push('/')
        localStorage.setItem(config.AUTH_LOCAL_STORAGE_KEY, '')
        setUser(initialUser)
    }

    useEffect(() => {
        login()
    })

    function updateUser(newData: { [key: string]: any }) {
        setUser({ ...user, ...newData })
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, setUser: updateUser }}
        >
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
