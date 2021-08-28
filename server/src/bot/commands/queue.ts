import Bot from '../../entities/Bot'
import dotenv from 'dotenv'
import { MessageEmbed } from 'discord.js'
import Command from '../../interfaces/bot/command.interface'
import botsRouter from '../../routes/bots.route'
import BotController from "../../controllers/BotController";
const { parsed } = dotenv.config()

const approve: Command = {
    name: 'queue',
    async execute(client, message, [id]) {
        const bots = await Bot.find({
            where: { verified: false }
        })
        const havePermission = message.member.roles.cache.find(role =>
            ['Модератор'].includes(role.name)
        )

        if(!havePermission) {
            return message.channel.send('<a:no:784090411081531412>' + ` Иди нахуй`)
        }
        const embed = new MessageEmbed()
            .setTitle("Очередь")
            .addFields(
                { name: 'ID', value: bots.map((bot) => bot.id), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Name', value: bots.map((bot) => bot.name), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Prefix', value: bots.map((bot) => bot.name), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Invite', value: bots.map((bot) => bot.inviteURL), inline: true },
            )
            .setColor(" #2F3136")
            .setTimestamp();
        message.reply(embed)
    }
}
export default approve
