import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import User from '../entities/User'
import UserNotFoundException from '../exceptions/user-not-found.exeption'
import checkAuth from '../middlewares/checkAuth.middleware'
import UserController from '../controllers/UserController'
import checkPermissions from '../middlewares/checkPermissions'

const usersRouter = Router()

// GET
// usersRouter.get('/(:id|me)', UserController.getUser)

// POST
// usersRouter.post('/:id/follow', UserController.follow)
// usersRouter.post('/:id/unfollow', UserController.unfollow)
// usersRouter.post('/update', UserController.update)
usersRouter.post(
    '/:id/ban',
    [checkAuth, checkPermissions(['member'])],
    UserController.ban
)
usersRouter.post(
    '/:id/unban',
    [checkAuth, checkPermissions(['member'])],
    UserController.unban
)

usersRouter.get('/me', [checkAuth], async (req: Request, res: Response) => {
    const userId = (req.user as any).id
    const user = await User.findOne(userId, {
        relations: ['bots', 'following', 'followers', 'bots.comments']
    })
    res.send(user)
})

usersRouter.get('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await User.findOne(userId, {
        relations: ['bots', 'following', 'followers', 'bots.comments']
    })
    if (!user) return res.send(new UserNotFoundException())
    res.send(user)
})

usersRouter.post('/:id/follow', [checkAuth], async (req, res) => {
    const me = await User.findOne(req.user.id, { relations: ['following'] })
    const user = await User.findOne(req.params.id)
    const isFollowing = !!me.following.find(follower => follower.id === user.id)
    if (isFollowing) return res.send(200)
    me.following = [...me.following, user]
    await me.save()
    res.send(200)
})

usersRouter.post('/:id/unfollow', [checkAuth], async (req, res) => {
    const me = await User.findOne(req.user.id, { relations: ['following'] })
    me.following = me.following.filter(
        following => following.id !== req.params.id
    )
    await me.save()
    res.send(200)
})

usersRouter.put(
    '/me',
    [
        checkAuth,
        body('bio').notEmpty().optional({ nullable: true, checkFalsy: true }),
        body('github')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('twitter')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('reddit')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('steam')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('twitch')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('telegram')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('vk')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('facebook')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('instagram')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true }),
        body('youtube')
            .isURL()
            .notEmpty()
            .optional({ nullable: true, checkFalsy: true })
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })
        const user = req.user as User
        const { bio, ...social } = req.body
        user.bio = bio
        user.social = social
        await user.save()
        res.send(true)
    }
)

export default usersRouter
