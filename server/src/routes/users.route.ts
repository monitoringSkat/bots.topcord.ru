import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import User from '../entities/User'
import UserNotFoundException from '../exceptions/user-not-found.exeption'
import checkAuth from '../middlewares/checkAuth.middleware'
import UserController from '../controllers/UserController'
import checkPermissions from '../middlewares/checkPermissions'
import { supportedSocialLinks } from '../constants'
import getUserInfo from '../utils/get-user-info'

const usersRouter = Router()

usersRouter.get('/me', [checkAuth], async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id
        const { avatar } = await getUserInfo(userId)
        const user = await User.findOne(userId, {
            relations: ['bots', 'following', 'followers', 'bots.comments']
        })
        user.avatar = `https://cdn.discordapp.com/avatars/${user.id}/${avatar}?size=1024`
        await user.save()
        res.send(user)
    } catch (e) {
        res.send({})
    }
})

usersRouter.get('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await User.findOne(userId, {
        relations: ['bots', 'following', 'followers', 'bots.comments']
    })
    if (!user) return res.send(new UserNotFoundException())
    res.send(user)
})

usersRouter.get('/:id/bots', async (req: Request, res: Response) => {
    const user = await User.findOne(req.params.id, {
        relations: ['bots']
    })
    res.send(user?.bots)
})

usersRouter.get('/:id/followers', async (req: Request, res: Response) => {
    const user = await User.findOne(req.params.id, {
        relations: ['followers']
    })
    res.send(user?.followers)
})

usersRouter.get('/:id/following', async (req: Request, res: Response) => {
    const user = await User.findOne(req.params.id, {
        relations: ['following']
    })
    res.send(user?.following)
})

usersRouter.get('/:id/comments', async (req: Request, res: Response) => {
    const user = await User.findOne(req.params.id, {
        relations: ['comments']
    })
    res.send(user?.comments)
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

        const filteredSocial = Object.entries(social).filter(([key]) =>
            supportedSocialLinks.includes(key as string)
        )
        const socialObject = user.social
        filteredSocial.forEach(([key, val]) => {
            socialObject[key] = val || null
        })
        console.log(socialObject)
        user.bio = bio
        user.social = socialObject
        await user.save()
        res.send(true)
    }
)

usersRouter.post(
    '/:id/ban',
    [checkAuth, checkPermissions(['admin'])],
    UserController.ban
)
usersRouter.post(
    '/:id/unban',
    [checkAuth, checkPermissions(['admin'])],
    UserController.unban
)

export default usersRouter
