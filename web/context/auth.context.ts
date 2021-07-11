import { createContext } from 'react'
import User from '../interfaces/user.interface'

interface AuthContextInterface {
    user: User
    setUser: (newData: any) => void
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextInterface>({
    user: {
        id: '',
        username: '',
        discriminator: '',
        avatar: '',
        verified: false,
        bots: [],
        role: '',
        bio: '',
        social: {}
    },
    setUser: () => void 0,
    login: () => void 0,
    logout: () => void 0
})

export default AuthContext
