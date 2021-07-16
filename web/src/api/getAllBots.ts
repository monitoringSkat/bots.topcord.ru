import Bot from "../interfaces/bot.interface"
import http from "./http"

async function getAllBots(): Promise<Bot[]> {
    const { data } = await http.get('/bots?c=all')
    return data || []
}

const UserController = { getAllBots }

export default UserController