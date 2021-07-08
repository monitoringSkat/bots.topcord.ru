import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import User from '../entities/User'
import AuthException from '../exceptions/auth.exception'

async function checkAuth(req: Request, res: Response, next: Function) {
    if (!req.headers.authorization) return res.send(new AuthException())

    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.send(new AuthException())
    
    const data = verify(token, 'secret-key')
    if (!data) return res.send(new AuthException())
    
    const user = await User.findOne(data as string)
    ;(req.user as any) = user
    return next()
}

export default checkAuth
