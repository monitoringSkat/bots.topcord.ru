import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import BlackList from '../entities/BlackList'
import User from '../entities/User'
import AuthException from '../exceptions/auth.exception'
import BanException from '../exceptions/ban-exception.exception'
import getUserIP from '../utils/getUserIP'

async function checkAuth(req: Request, res: Response, next: Function) {
    const authError = new AuthException()

    if (!req.headers.authorization) return res.send(authError)

    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.send(authError)

    const data = verify(token, 'secret-key')
    if (!data) return res.send(authError)

    const user = await User.findOne(data as string)
    if (!user) return res.send(authError)

    const ipAddress = getUserIP(req)
    const users = await BlackList.find({ where: { ip: ipAddress } })

    if (user.banned || (users.length && ipAddress))
        return res.send(new BanException())
    ;(req.user as any) = user
    return next()
}

export default checkAuth
