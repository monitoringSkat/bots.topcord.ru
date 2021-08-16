import 'reflect-metadata'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import * as orm from 'typeorm'
import cors from 'cors'
import bodyParser from 'body-parser'
import DiscordStrategy from './strategies/discord.strategy'
import botsRouter from './routes/bots.route'
import authRouter from './routes/auth.route'
import bootstrapBot from './bot'
import dotenv from 'dotenv'
import compression from 'compression'
import usersRouter from './routes/users.route'
import tagsRouter from './routes/tags.route'
import cookieParser from 'cookie-parser'
import DiscordJS from 'discord.js'
import User from './entities/User'
import BlackList from './entities/BlackList'
import Bot from './entities/Bot'
import Comment from './entities/Comment'
import Tag from './entities/Tag'

dotenv.config()
const PORT = Number(process.env.PORT || 5000)
const __prod__ = process.env.NODE_ENV === 'development'

const corsOptions = {
    origin: !__prod__ ? 'http://localhost:3000' : 'https://bots.topcord.ru',
    optionsSuccessStatus: 200
}


orm.createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '13092005',
    database: 'topcord',
    synchronize: true,
    logging: false,
    entities: [User, BlackList, Bot, Comment, Tag]
})
    .then(async () => {
        const app = express()
        const upvotes = new DiscordJS.Collection<string, number>()
        const reports = new DiscordJS.Collection<string, number>()

        const client = await bootstrapBot()

        passport.use(DiscordStrategy)
        // app.use(cors(corsOptions))
        app.use(compression())

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        app.use(cookieParser())
        app.use(
            session({
                name: 'tcid',
                secret: 'very very secret key',
                cookie: {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 365 * 10
                }
            })
        )
        app.use(passport.initialize())
        app.use(passport.session())
        passport.serializeUser((user, done) => {
            console.log('Serializing: ', user)
            done(null, (user as User).id)
        })
        passport.deserializeUser(async (id, done) => {
            console.log('Deserializing: ', id)
            const user = await User.findOne(id)
            if (user) done(null, user)
        })
        // Decorate some global variables
        app.use((req, res, next) => {
            ;(req as any).client = client
            ;(req as any).upvotes = upvotes
            ;(req as any).reports = reports
            next()
        })
        app.use('/users', usersRouter)
        app.use('/tags', tagsRouter)
        app.use('/bots', botsRouter)
        app.use('/auth/discord', authRouter)
        app.listen(PORT, () => {
            console.log(`[NODEJS]: http://localhost:${PORT}`)
        })
    })
    .catch(e => console.log(e))
