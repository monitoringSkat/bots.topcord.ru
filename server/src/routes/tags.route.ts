import { Router, Request, Response } from 'express'
import Bot from '../entities/Bot'
import Tag from '../entities/Tag'

const tagsRouter = Router()

tagsRouter.get('/', async (req: Request, res: Response) => {
    const tags = await Tag.find({
        relations: ['bots']
    })
    const result = tags.map(tag => ({ tag: tag.name, count: tag.bots.length }))
    res.send(result)
})

tagsRouter.get('/:name', async (req: Request, res: Response) => {
    const { name } = req.params
    const [{ bots }] = await Tag.find({
        where: { name },
        relations: ['bots']
    })
    res.send({ bots })
})

export default tagsRouter
