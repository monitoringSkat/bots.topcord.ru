import { Router, Request, Response } from "express"
import Bot from "../entities/Bot"
import Tag from "../entities/Tag"

const tagsRouter = Router()


tagsRouter.get(
    "/", 
    async (req: Request, res: Response) => {
        const tags = await Tag.find({ relations: ["bots"] })
        res.send(tags)
    }
)

tagsRouter.get(
    "/:name", 
    async (req: Request, res: Response) => {
        const { name } = req.params
        const bots = await Tag.findAndCount({where: { name }, relations: ["bots"]})
        res.send({ count: bots[bots.length - 1], bots: bots[0] })
    }
)

export default tagsRouter