import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import User from '../entities/User'
import UserNotFoundException from '../exceptions/user-not-found.exeption'
import checkAuth from '../middlewares/checkAuth.middleware'

const usersRouter = Router()

usersRouter.get('/me', [checkAuth], async (req: Request, res: Response) => {
    const userId = (req.user as any).id
    const user = await User.findOne(userId, { relations: ['bots'] })
    res.send(user)
})

usersRouter.get('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await User.findOne(userId, { relations: ['bots'] })
    if (!user) return res.send(new UserNotFoundException())
    res.send(user)
})

usersRouter.put(
    '/me', 
    [ 
        checkAuth,
        body("bio").isURL().notEmpty(),
        body("github").isURL().notEmpty().optional({ nullable: true }),
        body("twitter").isURL().notEmpty().optional({ nullable: true }),
        body("reddit").isURL().notEmpty().optional({ nullable: true }),
        body("steam").isURL().notEmpty().optional({ nullable: true }),
        body("twitch").isURL().notEmpty().optional({ nullable: true }),
        body("telegram").isURL().notEmpty().optional({ nullable: true }),
        body("vk").isURL().notEmpty().optional({ nullable: true }),
        body("facebook").isURL().notEmpty().optional({ nullable: true }),
        body("instagram").isURL().notEmpty().optional({ nullable: true }),
        body("youtube").isURL().notEmpty().optional({ nullable: true }),
    ], 
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
    }
)

export default usersRouter
