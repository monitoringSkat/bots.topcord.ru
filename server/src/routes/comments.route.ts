import { Router, Request, Response } from 'express'
import checkAuth from '../middlewares/checkAuth.middleware'
import rateLimit from 'express-rate-limit'
import Minutes from '../enums/minutes.enum'
import Comment from '../entities/Comment'
import { body } from 'express-validator'
import TooManyCommentsPerUserException from '../exceptions/too-many-comments-per-user'
import Bot from '../entities/Bot'

const commentsRouter = Router()

// GET
// commentsRouter.get('/:id', CommentController.getById)
// commentsRouter.get('/:id/author', CommentController.getCommentAuthor)

// POST
// commentsRouter.post('/', CommentController.create)
// commentsRouter.post('/update', CommentController.update)
// commentsRouter.post('/like', CommentController.like)
// commentsRouter.post('/dislike', CommentController.dislike)

// DELETE
// commentsRouter.delete('/:id', CommentController.remove)

commentsRouter.delete(
    '/:id',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.params.id)
        await comment.remove()
        res.send(200)
    }
)

commentsRouter.post(
    '/',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        }),
        body('text').notEmpty().isString(),
        body('text').notEmpty().isNumeric(),
        body('rating').notEmpty().isNumeric()
    ],
    async (req: Request, res: Response) => {
        const bot = await Bot.findOne(req.body.botId, {
            relations: ['comments', 'comments.author']
        })
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

commentsRouter.put(
    '/:id',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        }),
        body('text').notEmpty().isString(),
        body('rating').isNumeric()
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.params.id)
        comment.text = req.body.text
        await comment.save()
        res.send(200)
    }
)

commentsRouter.put(
    '/:id/like',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.params.commentId, {
            relations: ['author']
        })
        if (comment.likes.includes(req.user.id)) {
            comment.likes = comment.likes.filter(c => c !== req.user.id)
        } else {
            comment.likes = [...comment.likes, req.user.id]
        }
        await comment.save()
        res.send(200)
    }
)

commentsRouter.put(
    '/:id/dislike',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.params.commentId, {
            relations: ['author']
        })
        if (comment.dislikes.includes(req.user.id)) {
            comment.dislikes = comment.dislikes.filter(c => c !== req.user.id)
        } else {
            comment.dislikes = [...comment.dislikes, req.user.id]
        }
        await comment.save()
        res.send(200)
    }
)

export default commentsRouter
