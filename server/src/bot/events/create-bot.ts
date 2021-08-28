import { Client, MessageEmbed } from 'discord.js'
import Bot from '../../entities/Bot'
import User from '../../entities/User'
import Event from '../../interfaces/bot/event.interface'
import { config } from 'dotenv'
const { parsed } = config()

const createBot: Event = {
    name: 'create-bot',
    execute(client: Client, bot: Bot, owner: User) {
        const embed = new MessageEmbed()
            .addField('Бот', bot.name)
            .addField('ID', bot.id, true)
            .addField('Префикс', bot.prefix, true)
            .addField('Владелец', `<@${owner.id}>`, true)
            .setThumbnail(bot.avatar)
            .setTimestamp()
            .setTitle('Добавлен бот')
            .setColor('#008000')
        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)
        const modchannel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)
        modchannel.send("<@761596581145083914> Бот " + bot.name + " был добавлен. **t!queue " + bot.id + "**" )
        channel.send(embed)
        
    }
}

export default createBot
