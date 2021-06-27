import { Router, Request, Response } from 'express'
import User from '../entities/User'
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
    res.send(user)
})

export default usersRouter
