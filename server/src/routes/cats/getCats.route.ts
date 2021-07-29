import { Request, Response } from "express"

export default {
    url: "/:name",
    method: "get",
    middleware: [
        (req: Request, res: Response, next: Function) => {
            if (req.params.name === "Bob") return next()
            res.send({ message: "Cat doesn't have name Bob!" })
        }
    ],
    handle(req: Request, res: Response) {
        res.send(`Cat!`)
    }
}