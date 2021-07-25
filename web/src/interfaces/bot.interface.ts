import Tag from './tag.interface'
import User from './user.interface'
import Comment from './comment.interface'
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
    updatedAt: string
    avatar: string
    shortDescription: string
    longDescription: string
    guildsCount: number
    websiteURL?: string
    backgroundURL?: string
    votes: number
    developers: User[]
}

export default Bot
