import Bot from '../../entities/Bot'
import { MessageEmbed } from 'discord.js'
import Command from '../../interfaces/bot/command.interface'
import BotNotFoundException from '../../exceptions/bot-not-found.exception'

const cancelApprove: Command = {
    name: 'cancel-approve',
    async execute(client, message, [id, ...reason]) {
        const bot = await Bot.findOne(id, { relations: ['owner'] })
        if (!bot)
            return message.channel.send(
                JSON.stringify(new BotNotFoundException())
            )
        bot.verified = false
        await bot.save()
        const embed = new MessageEmbed()
            .addField('Причина', reason.join(' ') || 'Причины нету')
            .addField('Бот', bot.name)
            .addField('ID', bot.id, true)
            .addField('Префикс', bot.prefix, true)
            .addField('Владелец', `<@${bot.owner.id}>`, true)
            .setThumbnail(bot.avatar)
            .setTimestamp()
            .setTitle('Бот отклонен')
            .setColor('#e74c3c')
        const embedmember = new MessageEmbed()
            .addField('Причина', reason.join(' ') || 'Причины нету')
            .addField('Бот', bot.name)
            .setThumbnail(bot.avatar)
            .setTimestamp()
            .setTitle('Ваш бот был отклонен')
            .setColor('#e74c3c')
            .setAuthor('TopCord')
            .setThumbnail(bot.avatar)


        const channel: any = client.channels.cache.get('846093367485923348')

        channel.send(embed)
        client.guilds.cache.get('761596363795988561').member(bot.owner.id).send(embedmember)
    }
}
export default cancelApprove
