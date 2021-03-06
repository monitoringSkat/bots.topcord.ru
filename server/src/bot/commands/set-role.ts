import Command from '../../interfaces/bot/command.interface'
import PermissionsDenied from '../../exceptions/permissions-denied.exception'
import User from '../../entities/User'
import { UserRoles } from '../../enums'
import { MessageEmbed } from 'discord.js'
const NotFound = new MessageEmbed()
    .setAuthor('TopCord', 'https://bots.topcord.ru/favicon.png')
    .setTitle('Ошибка')
    .setDescription('`Авторизуйся гандон`')
    .setTimestamp()
    .setColor('#7289DA')

const Done = new MessageEmbed()
    .setAuthor('TopCord', 'https://bots.topcord.ru/favicon.png')
    .setDescription('`Успешно!`')
    .setTimestamp()
    .setColor('#7289DA')

const setRole: Command = {
    name: 'set-role',
    async execute(client, message, [userId, userRole]) {
        const user = await User.findOne(userId)
        const havePermission = message.member.roles.cache.find(role =>
            ['Developer'].includes(role.name)
        )
        if (!havePermission)
            return message.channel.send(JSON.stringify(new PermissionsDenied()))
        if (!user) return message.channel.send(NotFound)
        user.role = UserRoles[userRole.toUpperCase()]
        await user.save()
        message.channel.send(Done)
    }
}

export default setRole
