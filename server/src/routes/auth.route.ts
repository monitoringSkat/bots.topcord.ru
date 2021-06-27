import { config } from "dotenv"
import { Router, Request, Response } from "express"
import passport from "passport"
import User from "../entities/User"
import checkAuth from "../middlewares/checkAuth.middleware"
import getUserIP from "../utils/getUserIP"

const authRouter = Router()
const { parsed } = config()

authRouter.get(
    '/', 
    passport.authenticate('discord')
)
authRouter.get(
    '/callback', 
    passport.authenticate('discord', {
        failureRedirect: '/'
    }), 
    function(req, res) {
        const ip = getUserIP(req)
        const user = req.user as User
        user.ip = ip // write user IP
        user.save()
        res.redirect(parsed.SUCCESSFUL_AUTH_URL) // Successful auth
    }
)

authRouter.get(
    '/logout',
    [ checkAuth ],
    (req: Request, res: Response) => {
        req.logOut()
        res.redirect(parsed.CLIENT_URL)
    }
)

export default authRouter