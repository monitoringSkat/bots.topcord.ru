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
import checkOrigin from './utils/checkOrigin'
import dotenv from 'dotenv'
import compression from 'compression'
import swagger from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import usersRouter from './routes/users.route'
import tagsRouter from './routes/tags.route'
import cookieParser from 'cookie-parser'
import DiscordJS from 'discord.js'
import cats from './routes/cats'

dotenv.config()
const PORT = Number(process.env.PORT || 5000)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0'
        }
    },
    apis: ['./src/routes/*.route.ts']
}
const corsOptions = {
    origin: 'https://dev.topcord.ru',
    optionsSuccessStatus: 200 
  }

const openapiSpecification = swaggerJSDoc(swaggerOptions)

orm.createConnection()
    .then(async () => {
        const app = express()
        const upvotes = new DiscordJS.Collection<string, number>()
        const reports = new DiscordJS.Collection<string, number>()
        const client = await bootstrapBot()
        passport.use(DiscordStrategy)

        app.use(cors(corsOptions))
        app.use(compression())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        app.use(cookieParser())
        app.use(
            session({
                resave: false,
                saveUninitialized: false,
                secret: 'very very secret key',
                cookie: {
                    httpOnly: false,
                    secure: true
                }
            })
        )
        app.use(passport.initialize())
        app.use(passport.session())
        passport.serializeUser((user, done) => done(null, user))
        passport.deserializeUser((obj, done) => done(null, obj as any))
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
        app.use('/docs', swagger.serve, swagger.setup(openapiSpecification))
        app.use('/cats', cats)

        app.listen(PORT, () => {
            console.log(`[NODEJS]: http://localhost:${PORT}`)
        })
    })
    .catch(e => console.log(e))
