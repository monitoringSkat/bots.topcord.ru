import 'emoji-mart/css/emoji-mart.css'
import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar'
import AuthContext from '../context/auth.context'
import '../../i18next'
import { useEffect, useState } from 'react'
import User from '../interfaces/user.interface'
import config from '../config'
import router from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
    const initialUser: User = {
        id: '',
        username: '',
        discriminator: '',
        avatar: '',
        verified: false,
        bots: [],
        role: 'member',
        bio: '',
        banned: false,
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

    async function login(): Promise<boolean> {
        const token = localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY)
        if (!token || user.id) return false
        try {
            const res = await fetch(`${config.SERVER_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (data.message === 'Unauthorized' && data.statusCode === 401)
                return false
            setUser(data)
            return true
        } catch (e) {
            return false
        }
    }

    async function logout() {
        router.push('/')
        localStorage.setItem(config.AUTH_LOCAL_STORAGE_KEY, '')
        setUser(initialUser)
    }

    useEffect(() => {
        login()
    }, [])

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
