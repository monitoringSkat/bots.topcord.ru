import Bot from '../../entities/Bot'
import dotenv from 'dotenv'
import { MessageEmbed } from 'discord.js'
import Command from '../../interfaces/bot/command.interface'
import BotNotFoundException from '../../exceptions/bot-not-found.exception'

const { parsed } = dotenv.config()

const approve: Command = {
    name: 'approve',
    async execute(client, message, [id]) {
        const bot = await Bot.findOne(id, { relations: ['owner'] })
        if (!bot)
            return message.channel.send(
                JSON.stringify(new BotNotFoundException())
            )
        bot.verified = true
        await bot.save()
        const embed = new MessageEmbed()
            .addField('Бот', bot.name)
            .addField('ID', bot.id, true)
            .addField('Префикс', bot.prefix, true)
            .addField('Владелец', `<@${bot.owner.id}>`, true)
            .setThumbnail(bot.avatar)
            .setTimestamp()
            .setTitle('Верифицоравние бота')
            .setColor(' #1abc9c ')
        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)
        channel.send(embed)
    }
}
export default approve
