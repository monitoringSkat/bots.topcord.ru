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
import ip from './middlewares/checkIP.middleware'
import dotenv from 'dotenv'
import compression from 'compression'
import swagger from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import usersRouter from './routes/users.route'
import tagsRouter from './routes/tags.route'
import cookieParser from 'cookie-parser'
import commentsRouter from './routes/comments.route'

dotenv.config()
const PORT = Number(process.env.PORT || 5000)
const mode = process.env.NODE_ENV

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

const openapiSpecification = swaggerJSDoc(swaggerOptions)

orm.createConnection()
    .then(async () => {
        const app = express()
        const client = await bootstrapBot()
        passport.use(DiscordStrategy)

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
                    httpOnly: true,
                    secure: false
                }
            })
        )
        app.use(passport.initialize())
        app.use(passport.session())
        passport.serializeUser((user, done) => done(null, user))
        passport.deserializeUser((obj, done) => done(null, obj as any))
        // Decorate bot client for routes
        app.use((req, res, next) => {
            ;(req as any).client = client
            next()
        })
        if (mode !== 'development') {
            app.use(ip)
        }
        app.use(
            cors({
                origin: (origin, cb) => {
                    const isWhiteList = checkOrigin(origin)
                    cb(
                        isWhiteList ? null : new Error('Bad request'),
                        isWhiteList
                    )
                },
                credentials: true
            })
        )

        app.use('/users', usersRouter)
        app.use('/tags', tagsRouter)
        app.use('/bots', botsRouter)
        app.use('/comments', commentsRouter)
        app.use('/auth/discord', authRouter)
        app.use('/docs', swagger.serve, swagger.setup(openapiSpecification))

        app.listen(PORT, () => {
            console.log(`[NODEJS]: http://localhost:${PORT}`)
        })
    })
    .catch(e => console.log(e))
