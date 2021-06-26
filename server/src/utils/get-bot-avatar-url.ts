
import { config } from "dotenv"
import fetch from "node-fetch"

const { parsed } = config()

async function getBotAvatarURL(id: string): Promise<string> {
    try {
        const res = await fetch(`https://discordapp.com/api/users/${id}`, {
            headers: {
                Authorization: `Bot ${parsed.DISCORD_BOT_TOKEN}`,
            },
        })
        const data = await res.json()
        return `https://cdn.discordapp.com/avatars/${id}/${data.avatar}`
    } catch (e) {
        console.log(e)
        return ''
    }
}

export default getBotAvatarURL