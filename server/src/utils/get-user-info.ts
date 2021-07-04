import { config } from "dotenv"
import CreateUser from "../interfaces/user/create-user.interface"

const { parsed } = config()

async function getUserInfo(id: string): Promise<CreateUser | null> {
    try {
        const url = `https://discordapp.com/api/users/${id}`
        const res = await fetch(url, {
            headers: {
                Authorization: `Bot ${parsed.DISCORD_BOT_TOKEN}`
            }
        })
        const info = await res.json()
        return info
    } catch(e) {
        return null
    }
}

export default getUserInfo