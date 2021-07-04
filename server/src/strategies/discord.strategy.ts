import { config } from 'dotenv'
import { Strategy } from 'passport-discord'
import UserService from '../services/user.service'

const { parsed } = config()

const DiscordStrategy = new Strategy(
    {
        clientID: parsed.DISCORD_CLIENT_ID,
        clientSecret: parsed.DISCORD_CLIENT_SECRET,
        callbackURL: parsed.DISCORD_CALLBACK_URL,
        scope: parsed.DISCORD_AUTH_SCOPES.split(',')
    },
    function (accessToken, refreshToken, profile, cb) {
        process.nextTick(async () => {
            const user = await UserService.findOrCreate(profile)
            if (user) return cb(null, user)
            return cb(new Error('Something went wrong!'), null)
        })
    }
)

export default DiscordStrategy
