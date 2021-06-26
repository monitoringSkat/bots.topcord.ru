import { Router, Request, Response } from "express"
import User from "../entities/User"
import checkAuth from "../middlewares/checkAuth.middleware"

const profileRouter = Router()


profileRouter.get(
    "/me", 
    [ checkAuth ], 
    async (req: Request, res: Response) => {
        const userId = (req.user as any).id
        const user = await User.findOne(userId, { relations: ['bots'] })
        res.send(user)
    }
)

export default profileRouter