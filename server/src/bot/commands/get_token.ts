import Bot from '../../entities/Bot'
import Command from '../../interfaces/bot/command.interface'
import { sign } from 'jsonwebtoken'
import BotNotFoundException from '../../exceptions/bot-not-found.exception'
import PermissionsDenied from '../../exceptions/permissions-denied.exception'

const getToken: Command = {
    name: 'get-token',
    async execute(client, message, [id]) {
        const bot = await Bot.findOne(id, { relations: ['owner'] })
        const authorId = message.author.id
        if (!bot)
            return message.channel.send(
                JSON.stringify(new BotNotFoundException(), null, 2)
            )
        if (!(bot.owner.id === authorId))
            return message.channel.send(JSON.stringify(new PermissionsDenied()))
        const token = sign({ botId: bot.id }, 'secret-key', {
            expiresIn: '365days'
        })
        message.author.send(`Token for ${bot.name}: ${token}`)
    }
}

export default getToken
