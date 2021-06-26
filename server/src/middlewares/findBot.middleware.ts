import { Request, Response } from "express"
import { FindOneOptions } from "typeorm";
import Bot from "../entities/Bot";
import BotNotFoundException from "../exceptions/bot-not-found.exception";

/**
 * @param {FindOneOptions<Bot>} options - options for TypeORM in <Entity>.findOne method
 * @returns {(req: Request, res: Response, next: Function) => void} - middleware function
 */

function findBot(options?: FindOneOptions<Bot>) {
    return async (req: Request, res: Response, next: Function) => {
        const { id } = req.params
        const bot = await Bot.findOne(id, options)
        if (!bot) return res.send(new BotNotFoundException());
        (req as any).bot = bot
        next()
    }
}

export default findBot