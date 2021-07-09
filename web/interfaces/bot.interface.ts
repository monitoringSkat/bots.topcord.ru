import Tag from './tag.interface'
import User from './user.interface'

interface Bot {
    id: string
    name: string
    prefix: string
    tags: Tag[]
    owner: User
    comments: Comment[]
    library: string
    githubURL?: string
    supportServerURL?: string
    inviteURL: string
    createdAt: string
    updateAt: string
    avatar: string
    shortDescription: string
    longDescription: string
    guildsCount: number
    websiteURL?: string
    backgroundURL?: string
    votes: {
        user_id: string
        mark: number
    }[]
}

export default Bot
