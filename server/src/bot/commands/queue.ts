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
        const searchedbot = await Bot.findOne(id)
        const havePermission = message.member.roles.cache.find(role =>
            ['Модератор'].includes(role.name)
        )

        if(!havePermission) {
            return message.channel.send('<a:no:784090411081531412>' + ` Иди нахуй`)
        }
        if(id) {
            const embed = new MessageEmbed()
                .setTitle("Бот " + searchedbot.name )
                .addFields(
                    { name: 'ID', value: searchedbot.id, inline: true },
                    { name: 'Name', value:  searchedbot.name, inline: true },
                    { name: 'Prefix', value:   searchedbot.prefix, inline: true },
                    { name: 'Invite', value:  searchedbot.inviteURL, inline: true },
                )
                .setColor(" #2F3136")
                .setTimestamp();
            message.reply(embed)
        } else {
            const embed = new MessageEmbed()
                .setTitle("Очередь")
                .addFields(
                    { name: 'ID', value: bots.map((bot) => bot.id), inline: true }
                )
                .setColor(" #2F3136")
                .setTimestamp();
            message.reply(embed)
        }

    }
}
export default approve
