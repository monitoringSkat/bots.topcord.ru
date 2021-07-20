import { Request, Response } from 'express'
import Bot from '../entities/Bot'
import BotNotFoundException from '../exceptions/bot-not-found.exception'

async function getAllBots(req: Request, res: Response) {
    const bots = await Bot.find()
    res.send(bots)
}

async function getBot(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id)
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send(bot)
}

async function getBotDevelopers(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['developers'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send(bot.developers)
}

async function getBotTags(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['tags'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send(bot.tags)
}

async function getBotOwner(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['owner'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send(bot.owner)
}

async function getBotComments(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['comments'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send(bot.comments)
}

async function getBotStats(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['comments'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send({
        id: bot.id,
        votesCount: bot.votes.length,
        guildsCount: bot.guildsCount,
        reviews: bot.comments.length,
        verified: bot.verified,
        createdAt: bot.createdAt,
        updatedAt: bot.updatedAt
    })
}

async function getBotVotes(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id)
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send({
        count: bot.votes.length,
        users: bot.votes
    })
}

async function getBotRating(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, { relations: ['comments'] })
    const error = new BotNotFoundException()
    if (!bot) return res.send(error)
    res.send({
        rating: bot.comments
            .map(comment => comment.rating)
            .reduce((v, c) => (c += v), 0)
    })
}

async function getBotGuilds(req: Request, res: Response) {}

async function getTopBots(req: Request, res: Response) {}

async function getNewBots(req: Request, res: Response) {}

async function create(req: Request, res: Response) {}

async function update(req: Request, res: Response) {}

async function vote(req: Request, res: Response) {}

async function unvote(req: Request, res: Response) {}

async function remove(req: Request, res: Response) {
    const bot = (req as any).bot
    await bot.remove()
    res.send(200)
}

async function report(req: Request, res: Response) {
    ;(req as any).client.emit(
        'report-bot',
        (req as any).client,
        (req as any).bot,
        req.user,
        req.body.message
    )
    res.send(200)
}

export default {
    getAllBots,
    getBot,
    getBotComments,
    getBotGuilds,
    getBotOwner,
    getBotRating,
    getBotVotes,
    getBotDevelopers,
    getBotStats,
    getBotTags,
    getTopBots,
    getNewBots,
    create,
    update,
    vote,
    unvote,
    remove,
    report
}
