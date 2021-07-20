import Command from '../../interfaces/bot/command.interface'
import PermissionsDenied from '../../exceptions/permissions-denied.exception'
import User from '../../entities/User'
import { UserRoles } from '../../enums'

const setRole: Command = {
    name: 'set-role',
    async execute(client, message, [ userId, userRole ]) {
        const user = await User.findOne(userId)
        const havePermission = message.member.roles.cache.find(role => ["Developer"].includes(role.name))
        if (!havePermission) return message.channel.send(JSON.stringify(new PermissionsDenied()))
        if (!user) return message.channel.send('User not found!')
        user.role = UserRoles[userRole.toUpperCase()]
        await user.save()
        message.channel.send("Done!")
    }
}

export default setRole
