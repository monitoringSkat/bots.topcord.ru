import { config } from 'dotenv'
import User from '../entities/User'
import UserService from '../services/user.service'

const { parsed } = config()

async function getUserInfo(id: string): Promise<User | null> {
    try {
        const url = `https://discordapp.com/api/users/${id}`
        const res = await fetch(url, {
            headers: {
                Authorization: `Bot ${parsed.DISCORD_BOT_TOKEN}`
            }
        })
        const info = await res.json()
        return await UserService.findOrCreate(info)
    } catch (e) {
        return null
    }
}

export default getUserInfo
