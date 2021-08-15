import { HttpStatus } from '../enums'
import Exception from './exception'

class BanException extends Exception {
    constructor(m: string = 'You have been banned!') {
        super(m, HttpStatus.NOT_ACCEPTABLE)
    }
}

export default BanException
