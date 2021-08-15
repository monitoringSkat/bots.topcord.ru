import { HttpStatus } from '../enums'
import Exception from './exception'

class PermissionsDenied extends Exception {
    constructor(message: string = 'Permissions denied') {
        super(message, HttpStatus.NOT_ACCEPTABLE)
    }
}

export default PermissionsDenied
