import Bot from './bot.interface'
import User from './user.interface'

interface Comment {
    id: number | string
    text: string
    author: User
    date: string
    bot?: Bot
    rating: number
    likes: string[]
    dislikes: string[]
}

export default Comment
