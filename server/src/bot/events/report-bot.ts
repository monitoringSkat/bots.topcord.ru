import Event from '../../interfaces/bot/event.interface'
import dotenv from 'dotenv'
import { Client } from 'discord.js'
import User from '../../entities/User'
import Bot from '../../entities/Bot'

const { parsed } = dotenv.config()

const ready: Event = {
    name: 'report-bot',
    execute(client: Client, bot: Bot, user: User, message: string) {
        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)
        channel.send(message)
    }
}

export default ready
