import Bot from './bot.interface'

interface User {
    id: string
    username: string
    discriminator: string | number
    verified: boolean
    role: "admin" | "member" | "moderator" | "developer"
    avatar: string
    bots: Bot[]
    bio: string
    followers: User[]
    following: User[]
    banned: boolean
    social: {
        github?: string | null
        vk?: string | null
        youtube?: string | null
        twitch?: string | null
        reddit?: string | null
        twitter?: string | null
        instagram?: string | null
        steam?: string | null
        facebook?: string | null
        telegram?: string | null
        spotify?: string | null
    }
}

export default User
