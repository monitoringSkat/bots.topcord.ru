import { Router, Request, Response } from 'express'
import { getConnection } from 'typeorm'
import { body, validationResult } from 'express-validator'
import Bot from '../entities/Bot'
import checkAuth from '../middlewares/checkAuth.middleware'
import findBot from '../middlewares/findBot.middleware'
import getBotAvatarURL from '../utils/get-bot-avatar-url'
import Comment from '../entities/Comment'
import TooManyCommentsPerUserException from '../exceptions/too-many-comments-per-user'
import { verify } from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../entities/User'
import BotNotFoundException from '../exceptions/bot-not-found.exception'
import Minutes from '../enums/minutes.enum'
import Tag from '../entities/Tag'
import SameBotException from '../exceptions/same-bot.exception'
import getUserInfo from '../utils/get-user-info'
import { libraries } from '../constants'
import BotController from '../controllers/BotController'

const botsRouter = Router()

// GET
botsRouter.get('/all', BotController.getAllBots)
botsRouter.get('/top', BotController.getTopBots)
botsRouter.get('/new', BotController.getNewBots)
botsRouter.get('/search', BotController.getBotsByQuery)
botsRouter.get('/:id', BotController.getBot)
botsRouter.get('/:id/owner', BotController.getBotOwner)
botsRouter.get('/:id/developers', BotController.getBotDevelopers)
botsRouter.get('/:id/comments', BotController.getBotComments)
botsRouter.get('/:id/stats', BotController.getBotStats)
botsRouter.get('/:id/votes', BotController.getBotVotes)
botsRouter.get('/:id/rating', BotController.getBotRating)
botsRouter.get('/:id/guilds', BotController.getBotGuilds)

// POST
botsRouter.post('/', BotController.create)
botsRouter.post('/:id/vote', BotController.vote)
botsRouter.post('/:id/unvote', BotController.unvote)
botsRouter.post('/:id/report', [checkAuth, findBot()], BotController.report)

// PUT
botsRouter.put('/', [ checkAuth, findBot() ], BotController.update)
botsRouter.put('/:id/guilds', BotController.setBotGuilds)

// DELETE
botsRouter.delete('/:id', [checkAuth, findBot()], BotController.remove)

// POST

botsRouter.post(
    '/',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 100
        }),

        body('name').notEmpty().isString(),

        body('id').notEmpty().isString(),

        body('prefix').notEmpty().isString(),

        body('longDescription').notEmpty().isString(),

        body('shortDescription').notEmpty().isString(),

        body('tags').isArray().notEmpty(),

        body('inviteURL').notEmpty().isString().isURL(),

        body('library').notEmpty().isString().isIn(libraries),

        body('backgroundURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL(),

        body('developers').optional({ nullable: true }).isArray(),

        body('supportServerURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL(),

        body('githubURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.send({ errors: errors.array() })
        const owner = await User.findOne((req.user as any).id)
        const sameBot = await Bot.findOne(req.body.id)
        if (sameBot) return res.send(new SameBotException())

        const avatar = await getBotAvatarURL(req.body.id)
        const developers: User[] = await Promise.all(
            req.body.developers
                ?.filter(Boolean)
                .map(async userId => await getUserInfo(userId))
        )
        const bot = Bot.create({
            name: req.body.name,
            id: req.body.id,
            prefix: req.body.prefix,
            longDescription: req.body.longDescription,
            shortDescription: req.body.shortDescription,
            supportServerURL: req.body.supportServerURL || null,
            websiteURL: req.body.websiteURL || null,
            githubURL: req.body.githubURL || null,
            inviteURL: req.body.inviteURL || null,
            library: req.body.library || null,
            backgroundURL: req.body.backgroundURL || null,
            developers: [owner, ...developers],
            owner,
            avatar
        })
        const tags: Tag[] = await Promise.all(
            req.body.tags.map(async name => {
                const oldTag = await Tag.find({ where: { name } })
                if (oldTag.length) return oldTag[0]
                else {
                    const newTag = Tag.create({ name })
                    await newTag.save()
                    return newTag
                }
            })
        )
        bot.tags = tags
        await bot.save()
        ;(req as any).client.emit('create-bot', (req as any).client, bot, owner)
        res.send(bot)
    }
)

botsRouter.post(
    '/:id/vote',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 200
        }),
        findBot()
    ],
    async (req: Request, res: Response) => {
        const bot = (req as any).bot
        const userId = (req.user as any).id
        if (bot.votes.includes(userId)) return res.send(true)
        const votes = [...bot.votes, userId]
        bot.votes = votes
        await bot.save()
        res.send(true)
    }
)

botsRouter.post(
    '/:id/unvote',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 200
        }),
        findBot()
    ],
    async (req: Request, res: Response) => {
        const bot = (req as any).bot
        bot.votes = bot.votes.filter(userId => userId !== (req.user as any).id)
        await bot.save()
        res.send(true)
    }
)

botsRouter.post(
    '/:id/comment',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        }),
        findBot({
            relations: ['comments', 'comments.author']
        }),
        body('text').notEmpty().isString(),
        body('rating').isNumeric()
    ],
    async (req: Request, res: Response) => {
        const bot = (req as any).bot
        const user = (req as any).user
        const commentsPerUser = bot.comments.filter(
            ({ author }) => author.id === user.id
        )
        if (commentsPerUser.length >= 5)
            return res.send(new TooManyCommentsPerUserException())

        const comment = Comment.create({
            text: req.body.text,
            rating: req.body.rating,
            date: new Date().toLocaleDateString(),
            author: user,
            bot
        })
        await comment.save()

        res.send(comment)
    }
)

botsRouter.put(
    '/:id/comment',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        }),
        body('id').notEmpty().isString(),
        body('text').notEmpty().isString(),
        body('rating').isNumeric()
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.body.id)
        comment.text = req.body.text
        await comment.save()
        res.send(200)
    }
)

botsRouter.post(
    '/:id/guilds',
    [
        rateLimit({
            windowMs: Minutes.HOUR,
            max: 50
        }),
        findBot(),
        body('token').isString().notEmpty(),
        body('guilds').isInt().notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) res.send({ errors: errors.array() })
        const { token, guilds } = req.body
        const { botId }: any = verify(token, 'secret-key')
        if (!botId) res.send('token is not valid')
        const bot = await Bot.findOne(botId)
        if (!bot) res.send(new BotNotFoundException())
        bot.guildsCount = guilds
        bot.save()
        res.send('Done')
    }
)

// PUT

// botsRouter.put(
//     '/:id',
//     [
//         checkAuth,
//         rateLimit({
//             windowMs: Minutes.HOUR,
//             max: 100
//         }),
//         body('name').notEmpty().isString(),
//         body('id').notEmpty().isString(),
//         body('prefix').notEmpty().isString(),
//         body('description').notEmpty().isString(),
//         body('tags').isArray().notEmpty()
//     ],
//     async (req: Request, res: Response) => {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) return res.send({ errors: errors.array() })
//         await Bot.update({ id: req.params.id }, req.body)
//         res.send(true)
//     }
// )

export default botsRouter
