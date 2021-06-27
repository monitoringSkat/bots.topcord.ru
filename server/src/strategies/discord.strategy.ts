import { config } from 'dotenv'
import { Strategy } from 'passport-discord'
import User from '../entities/User'

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
            try {
                const createdUser = await User.findOne(profile.id)
                if (createdUser) {
                    createdUser.avatar = profile.avatar
                    await createdUser.save()
                    return cb(null, createdUser)
                }
                const user = User.create({
                    id: profile.id,
                    discriminator: profile.discriminator,
                    username: profile.username,
                    email: profile.email,
                    verified: profile.verified,
                    avatar: profile.avatar,
                    bots: [],
                    comments: []
                })
                await user.save()
                return cb(null, user)
            } catch (e) {
                return cb(e, null)
            }
        })
    }
)

export default DiscordStrategy
