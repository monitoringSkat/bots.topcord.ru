import { Router, Request, Response } from 'express'
import Tag from '../entities/Tag'

const tagsRouter = Router()

// GET
// tagsRouter.get('/', TagController.getAllTags)
// tagsRouter.get('/:name', TagController.getBotsByTag)

tagsRouter.get('/', async (req: Request, res: Response) => {
    const tags = await Tag.find({
        relations: ['bots']
    })
    const result = tags.map(tag => ({ tag: tag.name, count: tag.bots.length }))
    res.send(result)
})

tagsRouter.get('/:name', async (req: Request, res: Response) => {
    const { name } = req.params
    const data = await Tag.find({
        where: { name },
        relations: ['bots', 'bots.comments']
    })
    res.send({ bots: data[0]?.bots || [] })
})

export default tagsRouter
