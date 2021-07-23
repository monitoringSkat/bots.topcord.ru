import { Router } from 'express'
import { body } from 'express-validator'
import checkAuth from '../middlewares/checkAuth.middleware'
import findBot from '../middlewares/findBot.middleware'
import rateLimit from 'express-rate-limit'
import Minutes from '../enums/minutes.enum'
import { libraries } from '../constants'
import BotController from '../controllers/BotController'

const botsRouter = Router()

// GET
botsRouter.get('/all', BotController.getAllBots) // ✔️
botsRouter.get('/top', BotController.getTopBots) // ✔️
botsRouter.get('/new', BotController.getNewBots) // ✔️
botsRouter.get('/search', BotController.getBotsByQuery) // ✔️
botsRouter.get('/:id', BotController.getBot) // ✔️
botsRouter.get('/:id/owner', BotController.getBotOwner) // ✔️
botsRouter.get('/:id/tags', BotController.getBotTags) // ✔️
botsRouter.get('/:id/developers', BotController.getBotDevelopers) // ✔️
botsRouter.get('/:id/comments', BotController.getBotComments) // ✔️
botsRouter.get('/:id/stats', BotController.getBotStats) // ✔️
botsRouter.get('/:id/votes', BotController.getBotVotes) // ✔️
botsRouter.get('/:id/rating', BotController.getBotRating) // ✔️
botsRouter.get('/:id/guilds', BotController.getBotGuilds) // ✔️

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
    '/:id/unvote',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 200
        }),
        findBot()
    ],
    BotController.unvote
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
