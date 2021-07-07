import Bot from './bot.interface'

interface User {
    id: string
    username: string
    discriminator: string | number
    verified: boolean
    role: string
    avatar: string
    bots: Bot[]
    bio: string
}

export default User
