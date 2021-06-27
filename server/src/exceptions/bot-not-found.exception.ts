import { HttpStatus } from '../enums'
import Exception from './exception'

class BotNotFoundException extends Exception {
    constructor(message: string = 'Bot not found!') {
        super(message, HttpStatus.NOT_FOUND)
    }
}

export default BotNotFoundException
