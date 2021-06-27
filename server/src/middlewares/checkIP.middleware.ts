import { Request, Response } from 'express'
import BlackList from '../entities/BlackList'
import { HttpStatus } from '../enums'
import BanException from '../exceptions/ban-exception.exception'
import getUserIP from '../utils/getUserIP'

async function checkIP(req: Request, res: Response, next: Function) {
    const ipAddress = getUserIP(req)
    const users = await BlackList.find({ where: { ip: ipAddress } })
    if (!users.length && ipAddress) return next()
    res.status(HttpStatus.NOT_ACCEPTABLE).send(new BanException())
}

export default checkIP
