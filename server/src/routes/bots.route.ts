import { Router } from 'express'
import { body } from 'express-validator'
import checkAuth from '../middlewares/checkAuth.middleware'
import findBot from '../middlewares/findBot.middleware'
import rateLimit from 'express-rate-limit'
import Minutes from '../enums/minutes.enum'
import { libraries } from '../constants'
import BotController from '../controllers/BotController'

const botsRouter = Router()

botsRouter.get('/all', BotController.getAllBots) // ✔️
botsRouter.get('/top', BotController.getTopBots) // ✔️
botsRouter.get('/new', BotController.getNewBots) // ✔️
botsRouter.get('/search', BotController.getBotsByQuery) // ✔️
botsRouter.get(
    '/:id', 
    [findBot({ relations: ['owner', 'comments', 'comments.author', 'tags', 'developers'] })], 
    BotController.getBot
) // ✔️
botsRouter.get('/:id/owner', 
[findBot({relations: ["owner"]})],
BotController.getBotOwner) // ✔️

botsRouter.get('/:id/tags', 
[findBot({ relations: ["tags"] })],
BotController.getBotTags) // ✔️

botsRouter.get('/:id/developers', 
[findBot({ relations: ["developers"] })],
BotController.getBotDevelopers) // ✔️

botsRouter.get('/:id/comments',
[findBot({ relations: ["comments"] })],
BotController.getBotComments) // ✔️

botsRouter.get('/:id/stats', 
[findBot({ relations: ["comments"] })],
BotController.getBotStats) // ✔️

botsRouter.get('/:id/votes',
[findBot()],
BotController.getBotVotes) // ✔️


botsRouter.get('/:id/rating', 
[findBot({ relations: ["comments"] })],
BotController.getBotRating) // ✔️

botsRouter.get('/:id/guilds', 
[findBot()],
BotController.getBotGuilds) // ✔️

// POST
botsRouter.post(
    '/',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 100
        }),
        body('id').notEmpty().isString(),
        body('prefix').notEmpty().isString(),
        body('longDescription').notEmpty().isString().isLength({ min: 300 }),
        body('shortDescription').notEmpty().isString().isLength({ min: 0, max: 220 }),
        body('tags').isArray().notEmpty(),
        body('inviteURL').notEmpty().isString().isURL(),
        body('library').notEmpty().isString().isIn(libraries),
        body('backgroundURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL(),
        body('developers')
            .isArray()
            .optional({ nullable: true, checkFalsy: true })
            .custom(value => {
                const isFromStrings = value?.every(
                    elem => typeof elem === 'string'
                )
                if (isFromStrings) return true
                return Promise.reject('Array is not from strings!')
            }),
        body('supportServerURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL(),
        body('githubURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL()
    ],
    BotController.create
) // ✔️

botsRouter.post(
    '/:id/report',
    [body('message').notEmpty().isString(), checkAuth, findBot()],
    BotController.report
) // ✔️
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
    BotController.vote
) // ✔️

botsRouter.post(
    '/:id/comments',
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
        body('rating').isNumeric().notEmpty()
    ],
    BotController.createComment
) // ✔️

// PUT
botsRouter.put('/:id/guilds', BotController.setBotGuilds) // ✔️
botsRouter.put(
    '/:id/comments/:commentId/like',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    BotController.likeComment
) // ✔️

botsRouter.put(
    '/:id/comments/:commentId/dislike',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    BotController.dislikeComment
) // ✔️

botsRouter.put(
    '/:id',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 100
        }),
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

        body('developers')
            .isArray()
            .optional({ nullable: true, checkFalsy: true })
            .custom(value => {
                const isFromStrings = value?.every(
                    elem => typeof elem === 'string'
                )
                if (isFromStrings) return true
                return Promise.reject('Array is not from strings!')
            }),

        body('supportServerURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL(),

        body('githubURL')
            .optional({ nullable: true, checkFalsy: true })
            .isString()
            .isURL()
    ],
    BotController.update
) // ✔️

botsRouter.put(
    '/:id/comments/:commentId',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        }),
        body('text').notEmpty().isString()
    ],
    BotController.updateComment
) // ✔️

// DELETE
botsRouter.delete(
    '/:id',
    [checkAuth, findBot({ relations: ['owner'] })],
    BotController.remove
) // ✔️

botsRouter.delete(
    '/:id/comments/:commentId',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    BotController.removeComment
) // ✔️

export default botsRouter
