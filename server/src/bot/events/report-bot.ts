import Event from '../../interfaces/bot/event.interface'
import dotenv from "dotenv"
import { Client } from 'discord.js'
import User from '../../entities/User'
import Bot from '../../entities/Bot'
import { MessageEmbed } from 'discord.js'
import { use } from 'passport'

const { parsed } = dotenv.config()

const ready: Event = {
    name: 'report-bot',
    execute(client: Client, bot: Bot, user: User, message: string) {
        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)
        const embed = new MessageEmbed()
            .setTimestamp()
            .setDescription(`Жалоба на бота: **${bot.name}** \`${bot.id}\` \n Жалобу отправил: **${user.username}#${user.discriminator}** \`${user.id}\` \n Причина: \n\`\`\`${message}\`\`\``)
            .setTitle('Новая жалоба.')
            .setColor('#ED4245')
        channel.send(embed)
    }
}

export default ready