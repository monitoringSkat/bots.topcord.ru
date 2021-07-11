import { object, string } from 'yup'

export default object().shape({
    bio: string(),
    github: string().url(),
    reddit: string().url(),
    telegram: string().url(),
    vk: string().url(),
    youtube: string().url(),
    twitch: string().url(),
    steam: string().url(),
    twitter: string().url(),
    instagram: string().url(),
    spotify: string().url(),
    facebook: string().url()
})
