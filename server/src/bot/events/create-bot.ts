import { Client, MessageEmbed } from 'discord.js'
import Bot from '../../entities/Bot'
import User from '../../entities/User'
import Event from '../../interfaces/bot/event.interface'

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
        const channel: any = client.channels.cache.get('846093367485923348')
        channel.send(embed)
    }
}

export default createBot
