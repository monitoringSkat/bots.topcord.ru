import { Request, Response } from "express"

async function getAllBots(req: Request, res: Response) {
    res.send("Bots")
}

const UserController = { getAllBots }

export default UserController