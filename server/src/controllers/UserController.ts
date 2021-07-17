import { Request, Response } from 'express'

async function getUser(req: Request, res: Response) {}

async function getUserBots(req: Request, res: Response) {}

async function getUserFollowers(req: Request, res: Response) {}

async function getUserFollowings(req: Request, res: Response) {}

async function getUserComments(req: Request, res: Response) {}

export {
    getUser,
    getUserBots,
    getUserComments,
    getUserFollowers,
    getUserFollowings
}
