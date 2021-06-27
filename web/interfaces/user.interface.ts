import Bot from "./bot.interface";

interface User {
    id: string
    username: string
    discriminator: string | number
    verified: boolean
    email: string
    role: string
    avatar: string
    bots?: Bot[]
    comments: Comment[]
}

export default User