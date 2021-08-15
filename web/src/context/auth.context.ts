import { createContext } from 'react'
import User from '../interfaces/user.interface'

interface AuthContextInterface {
    user: User
    setUser: (newData: any) => void
    login: () => Promise<boolean>
    logout: () => Promise<void | boolean>
}

const AuthContext = createContext<AuthContextInterface>({
    user: {
        id: '',
        username: '',
        discriminator: '',
        avatar: '',
        verified: false,
        bots: [],
        role: 'member',
        bio: '',
        social: {},
        banned: false,
        followers: [],
        following: []
    },
    setUser: () => void 0,
    login: async () => false,
    logout: async () => false
})

export default AuthContext
