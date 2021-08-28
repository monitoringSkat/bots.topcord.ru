import Bot from '../../entities/Bot'
import dotenv from 'dotenv'
import { MessageEmbed } from 'discord.js'
import Command from '../../interfaces/bot/command.interface'
import BotNotFoundException from '../../exceptions/bot-not-found.exception'
const { parsed } = dotenv.config()

const cancelApprove: Command = {
    name: 'decline',
    async execute(client, message, [id, ...reason]) {
        const bot = await Bot.findOne(id, { relations: ['owner'] })
        if (!bot)
            return message.channel.send(
                JSON.stringify(new BotNotFoundException())
            )
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

        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)

        const havePermission = message.member.roles.cache.find(role =>
            ['Модератор'].includes(role.name)
        )

        if(!havePermission) {
            return message.channel.send('<a:no:784090411081531412>' + ` Иди нахуй`)
        }

        channel.send(embed)
        client.guilds.cache
            .get('761596363795988561')
            .member(bot.owner.id)
            .send(embedmember)
        return message.reply('<a:yes:784090427934244865>' + ` Успешно :)`)
        bot.verified = false
        await bot.save()
    }
}
export default cancelApprove
