import { Request, Response } from 'express'
import PermissionsDenied from '../exceptions/permissions-denied.exception'

type AllowedRoles = 'member' | 'developer' | 'admin' | 'moderator'

function checkPermissions(allowedRoles: AllowedRoles[]) {
    return async (req: Request, res: Response, next: Function) => {
        if (req.user && allowedRoles.includes((req.user as any).role))
            return next()
        res.send(new PermissionsDenied())
    }
}

export default checkPermissions
