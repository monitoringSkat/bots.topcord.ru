import { Request } from 'express'

function getUserIP(req: Request): string {
    let ipAddress =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress

    if (
        ipAddress &&
        typeof ipAddress === 'string' &&
        ipAddress.substr(0, 7) == '::ffff:'
    ) {
        ipAddress = ipAddress.substr(7)
    }
    return ipAddress as string
}

export default getUserIP
