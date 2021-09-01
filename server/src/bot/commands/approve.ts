import Bot from '../../entities/Bot'
import dotenv from 'dotenv'
import { MessageEmbed } from 'discord.js'
import Command from '../../interfaces/bot/command.interface'
import BotNotFoundException from '../../exceptions/bot-not-found.exception'
import botsRouter from '../../routes/bots.route'

const { parsed } = dotenv.config()

const approve: Command = {
    name: 'approve',
    async execute(client, message, [id]) {
        const bot = await Bot.findOne(id, { relations: ['owner'] })

        const embed = new MessageEmbed()
            .addField('Бот', bot.name)
            .addField('ID', bot.id, true)
            .addField('Префикс', bot.prefix, true)
            .addField('Владелец', `<@${bot.owner.id}>`, true)
            .setThumbnail(bot.avatar)
            .setTimestamp()
            .setTitle('Проверен бот')
            .setColor(' #1abc9c ')

        const embedmember = new MessageEmbed()
            .setAuthor('TopCord')
            .setTitle('Ваш бот был проверен')
            .addField('Бот', bot.name, true)
            .setThumbnail(bot.avatar)
            .setDescription(
                '`Спасибо за добавление бота. Удачного продвижения)`'
            )
            .setURL(`${parsed.WEB_URL}/bots/${bot.id}`)
            .setColor(' #1abc9c ')
            .setTimestamp()

        const channel: any = client.channels.cache.get(parsed.BOT_ADD_CHANNEL)

        const havePermission = message.member.roles.cache.find(role =>
            ['Модератор'].includes(role.name)
        )
        if (!bot)
            return message.channel.send(
                JSON.stringify(new BotNotFoundException())
            )

        if (!havePermission) {
            return message.channel.send(
                '<a:no:784090411081531412>' + ` Иди нахуй`
            )
        }

        if (!id) {
            return message.channel.send(
                '<a:no:784090411081531412>' + ` Аргумент id бота пропущен.`
            )
        }

        if (bot.verified === true) {
            return message.reply(
                '<a:no:784090411081531412>' + ` Бот уже проверен!`
            )
        }
        bot.verified = true
        await bot.save()
        client.guilds.cache
            .get('761596363795988561')
            .member(bot.owner.id)
            .send(embedmember)
        client.guilds.cache.get('776944438383214620').member(bot.id).kick()
        channel.send(embed)
        return message.reply('<a:yes:784090427934244865>' + ` Успешно :)`)
    }
}
export default approve
