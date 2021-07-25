import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify } from 'jsonwebtoken'
import { getConnection } from 'typeorm'
import Bot from '../entities/Bot'
import Tag from '../entities/Tag'
import User from '../entities/User'
import BotNotFoundException from '../exceptions/bot-not-found.exception'
import SameBotException from '../exceptions/same-bot.exception'
import getUserInfo from '../utils/get-user-info'
import Comment from '../entities/Comment'
import TooManyCommentsPerUserException from '../exceptions/too-many-comments-per-user'
import PermissionsDenied from '../exceptions/permissions-denied.exception'
import UserService from '../services/user.service'
import { Collection } from 'discord.js'
import Minutes from '../enums/minutes.enum'

async function getAllBots(req: Request, res: Response) {
    const { limit } = req.query
    const bots = await Bot.find({
        relations: ['comments']
    })
    if (limit) return res.send(bots.slice(0, +limit))
    res.send(bots)
}

async function getBot(req: Request, res: Response) {
    const bot = await Bot.findOne(req.params.id, {
        relations: [
            'owner',
            'comments',
            'comments.author',
            'tags',
            'developers'
        ]
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
        votesCount: bot.votes,
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
        count: bot.votes,
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
    if (limit) return res.send(bots.slice(0, +limit))
    res.send(bots)
}

async function getNewBots(req: Request, res: Response) {
    const { limit } = req.query
    const bots = await Bot.find({
        where: { verified: true },
        relations: ['comments'],
        order: { createdAt: 'DESC' }
    })

    if (limit) return res.send(bots.slice(0, +limit))
    res.send(bots)
}



async function create(req: Request, res: Response) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.send({ errors: errors.array() })
    const owner = await User.findOne((req.user as any).id)
    const sameBot = await Bot.findOne(req.body.id)
    if (sameBot) return res.send(new SameBotException())
    const data = await getUserInfo(req.body.id)
    if (!data.bot) return res.send(new BotNotFoundException())
    const developers: User[] = await Promise.all(
        req.body.developers
            ?.map(async userId => await UserService.findOrCreate(await getUserInfo(userId)))
    )
    const bot = Bot.create({
        name: req.body.name,
        id: req.body.id,
        prefix: req.body.prefix,
        longDescription: req.body.longDescription,
        shortDescription: req.body.shortDescription,
        supportServerURL: req.body.supportServerURL || null,
        websiteURL: req.body.websiteURL || null,
        githubURL: req.body.githubURL || null,
        inviteURL: req.body.inviteURL || null,
        library: req.body.library || null,
        backgroundURL: req.body.backgroundURL || null,
        developers: [owner, ...developers],
        owner,
        avatar: `https://cdn.discordapp.com/avatars/${req.body.id}/${data.avatar}`
    })
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
    bot.tags = tags
    await bot.save()
    ;(req as any).client.emit('create-bot', (req as any).client, bot, owner)
    res.send(bot)
}

async function update(req: Request, res: Response) {
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
    const bot = await Bot.findOne(req.body.id, { relations: ['owner'] })
    if (bot.owner.id !== (req.user as any).id)
        return res.send(new PermissionsDenied('You are not owner!'))
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

async function vote(req: Request, res: Response) {
    const bot = (req as any).bot
    const userId = (req.user as any).id 
    const date = Date.now()
    const ISO = new Date().toISOString().slice(0, 10);
    const id = `${bot.id}__${userId}__${ISO}`
    const lastUpvote = (req as any).upvotes.get(id)
    if (lastUpvote) {
        const threeHours = Minutes.HOUR * 3
        const timeDiff = Date.now() - lastUpvote;
        if(timeDiff < threeHours) return res.send(false);
    }
    (req as any).upvotes.set(id, date)
    bot.votes = bot.votes + 1    
    await bot.save()
    res.send(true)
}

async function remove(req: Request, res: Response) {
    const bot = (req as any).bot
    if (bot.owner.id !== (req.user as any).id)
        return res.send(new PermissionsDenied('You are not owner!'))
    await bot.remove()
    res.send(200)
}

async function report(req: any, res: Response) {
    const bot = (req as any).bot
    const userId = (req.user as any).id 
    const date = Date.now()
    const ISO = new Date().toISOString().slice(0, 10);
    const id = `${bot.id}__${userId}__${ISO}`
    const lastReport = req.report.get(id)
    if (lastReport) {
        const threeHours = Minutes.HOUR * 3
        const timeDiff = Date.now() - lastReport;
        if(timeDiff < threeHours) return res.send(false);
    }
    req.reports.set(id, date)
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.send({ errors: errors.array() })
    const { token, guilds } = req.body
    const { botId }: any = verify(token, 'secret-key')
    if (!botId) res.send('token is not valid')
    const bot = await Bot.findOne(botId)
    if (!bot) res.send(new BotNotFoundException())
    bot.guildsCount = guilds
    bot.save()
    res.send('Done')
}

async function createComment(req: Request, res: Response) {
    const bot = (req as any).bot
    const user = (req as any).user
    const commentsPerUser = bot.comments.filter(
        ({ author }) => author.id === user.id
    )
    if (commentsPerUser.length >= 5)
        return res.send(new TooManyCommentsPerUserException())
    if (req.body.rating > 5 || req.body.rating <= 0)
        return res.send(`Max rating: 5. Min rating: 1`)

    const comment = Comment.create({
        text: req.body.text,
        rating: req.body.rating,
        date: new Date().toLocaleDateString(),
        author: user,
        bot
    })
    await comment.save()

    res.send(comment)
}

async function updateComment(req: Request, res: Response) {
    const comment = await Comment.findOne(req.params.commentId, {
        relations: ['author']
    })
    if (comment.author.id !== (req.user as any).id)
        return res.send(new PermissionsDenied('You are not owner!'))
    comment.text = req.body.text
    await comment.save()
    res.send(200)
}

async function removeComment(req: Request, res: Response) {
    const comment = await Comment.findOne(req.params.commentId, {
        relations: ['author']
    })
    if (comment.author.id !== (req.user as any).id)
        return res.send(new PermissionsDenied('You are not owner!'))
    await comment.remove()
    res.send(200)
}

async function likeComment(req: Request, res: Response) {
    const comment = await Comment.findOne(req.params.commentId, {
        relations: ['author']
    })
    if (comment.likes.includes((req.user as any).id)) {
        comment.likes = comment.likes.filter(c => c !== (req.user as any).id)
    } else {
        comment.likes = [...comment.likes, (req.user as any).id]
    }
    await comment.save()
    res.send(200)
}

async function dislikeComment(req: Request, res: Response) {
    const comment = await Comment.findOne(req.params.commentId, {
        relations: ['author']
    })
    if (comment.dislikes.includes((req.user as any).id)) {
        comment.dislikes = comment.dislikes.filter(
            c => c !== (req.user as any).id
        )
    } else {
        comment.dislikes = [...comment.dislikes, (req.user as any).id]
    }
    await comment.save()
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
    remove,
    report,
    getBotsByQuery,
    setBotGuilds,
    createComment,
    updateComment,
    likeComment,
    dislikeComment,
    removeComment
}
