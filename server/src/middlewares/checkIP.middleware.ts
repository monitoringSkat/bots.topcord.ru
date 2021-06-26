import { Request, Response } from "express";
import BlackList from "../entities/BlackList";
import BanException from "../exceptions/ban-exception.exception";
import getUserIP from "../utils/getUserIP";


async function checkIP(req: Request, res: Response, next: Function) {
    const ipAddress = getUserIP(req)
    const user = await BlackList.find({where: { ip: ipAddress }})
    if (!user && ipAddress) next()
    res.send(new BanException())
}

export default checkIP