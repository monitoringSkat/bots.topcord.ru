import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import Bot from '../entities/Bot'
import Tag from '../entities/Tag'
import User from '../entities/User'
import BotNotFoundException from '../exceptions/bot-not-found.exception'
import getUserInfo from '../utils/get-user-info'

async function getAllBots(req: Request, res: Response) {
    const { limit } = req.query
    const bots = await Bot.find({
        relations: [ "comments" ]
    })
    if (limit) return res.send(bots.slice(0, +limit))
    res.send(bots)
}

async function getBot(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, {
        relations: [ 'owner', 'comments', 'comments.author', 'tags', 'developers' ]
    })
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

async function getBotGuilds(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id)
    res.send({ guildsCount: bot?.guildsCount })
}

async function getTopBots(req: Request, res: Response) {
    const { limit } = req.query
    const bots = await Bot.find({
            where: { verified: true },
            relations: ['comments'],
            order: { votes: 'DESC' }
        })
    if (limit) return res.send(bots.slice(0, 20))
    res.send(bots)
}

async function getNewBots(req: Request, res: Response) {
    const { limit = 20 } = req.query
    const bots = (await Bot.find({
        where: { verified: true },
        relations: ['comments'],
        order: { createdAt: 'DESC' }
    })).slice(0, +limit)
    res.send(bots)
}

async function create(req: Request, res: Response) {}

async function update(req: Request, res: Response) {
    console.log(req.body)
    const developers: User[] = await Promise.all(
        req.body.developers
            ?.filter(Boolean)
            .map(async userId => await getUserInfo(userId))
    )

    const tags: Tag[] = await Promise.all(
        req.body.tags.map(async name => {
            const oldTag = await Tag.find({ where: { name } })
            if (oldTag.length) return oldTag[0]
            else {
                const newTag = Tag.create({ name })
                await newTag.save()
                return newTag
            }
        })
    )
    const bot = await Bot.findOne(req.body.id)
    bot.name = req.body.name
    bot.prefix = req.body.prefix
    bot.shortDescription = req.body.shortDescription
    bot.longDescription = req.body.longDescription
    bot.websiteURL = req.body.websiteURL
    bot.githubURL = req.body.githubURL
    bot.supportServerURL = req.body.supportServerURL
    bot.library = req.body.library
    bot.tags = tags
    bot.developers = developers
    bot.backgroundURL = req.body.backgroundURL
    bot.inviteURL = req.body.inviteURL
    await bot.save()
    res.send(bot)
}

async function vote(req: Request, res: Response) {}

async function unvote(req: Request, res: Response) {}

async function remove(req: Request, res: Response) {
    const bot = (req as any).bot
    await bot.remove()
    res.send(200)
}

async function report(req: any, res: Response) {
    req.client.emit(
        'report-bot',
        req.client,
        req.bot,
        req.user,
        req.body.message
    )
    res.send(200)
}


async function getBotsByQuery(req: Request, res: Response) {
    const { q } = req.query
    const bots = await getConnection()
            .getRepository(Bot)
            .createQueryBuilder()
            .select()
            .where('name ILIKE :q', { q: `%${q}%` })
            .getMany()
    res.send(bots)
}

async function setBotGuilds(req: Request, res: Response) {

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
    report,
    getBotsByQuery,
    setBotGuilds
}


