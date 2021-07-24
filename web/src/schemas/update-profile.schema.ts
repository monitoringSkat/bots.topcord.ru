import { object, string } from 'yup'

export default object().shape({
    bio: string(),

    github: string().url()
    .test("Should be Github URL", "Should be Github URL!", value => !!(value?.startsWith("https://github.com"))),
    
    reddit: string().url()
    .test("Should be Reddit URL", "Should be Reddit URL!", value => !!(value?.startsWith("https://www.reddit.com/user"))),

    telegram: string().url()
    .test("Should be Telegram URL", "Should be Telegram URL!", value => !!(value?.startsWith("https://t.me"))),
    
    vk: string().url()
    .test("Should be VK URL", "Should be VK URL!", value => !!(value?.startsWith("https://vk.com/"))),
    
    youtube: string().url()
    .test("Should be YouTube URL", "Should be YouTube URL!", value => !!(value?.startsWith("https://www.youtube.com/channel/"))),
    
    twitch: string().url()
    .test("Should be Twitch URL", "Should be Twitch URL!", value => !!(value?.startsWith("https://www.twitch.tv"))),
    
    steam: string().url()
    .test("Should be Steam URL", "Should be Steam URL!", value => !!(value?.startsWith("https://steamcommunity.com/id/"))),
    
    twitter: string().url()
    .test("Should be Twitter URL", "Should be Twitter URL!", value => !!(value?.startsWith("https://twitter.com/"))),

    instagram: string().url()
    .test("Should be Instagram URL", "Should be Instagram URL!", value => !!(value?.startsWith("https://www.instagram.com/"))),
    
    spotify: string().url()
    .test("Should be Spotify URL", "Should be Spotify URL!", value => !!(value?.startsWith("http://open.spotify.com/user/"))),
    
    facebook: string().url()
    .test("Should be Facebook URL", "Should be Facebook URL!", value => !!(value?.startsWith("https://www.facebook.com"))),
})
