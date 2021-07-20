import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import BlackList from '../entities/BlackList'
import User from '../entities/User'

async function getUser(req: Request, res: Response) {}

async function getUserBots(req: Request, res: Response) {}

async function getUserFollowers(req: Request, res: Response) {}

async function getUserFollowings(req: Request, res: Response) {}

async function getUserComments(req: Request, res: Response) {}

async function ban(req: Request, res: Response) {
    const userId = req.params.id
    const user = await User.findOne(userId, { select: ['id', 'ip', 'banned'] })
    if (user.banned) return res.send(200)
    user.banned = true
    await user.save()
    if (!user.ip) return res.send(200)
    await BlackList.create({
        user_id: user.id,
        ip: user.ip
    })
    res.send(200)
}

async function unban(req: Request, res: Response) {
    const userId = req.params.id
    const user = await User.findOne(userId, { select: ['id', 'ip', 'banned'] })
    user.banned = false
    await user.save()
    if (!user.ip) return res.send(200)
    const inList = await BlackList.findOne({ user_id: user.id, ip: user.ip })
    await inList.remove()
    res.send(200)
}

export default {
    getUser,
    getUserBots,
    getUserComments,
    getUserFollowers,
    getUserFollowings,
    ban,
    unban
}
