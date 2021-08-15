import { HttpStatus } from '../enums'
import Exception from './exception'

class TooManyCommentsPerUserException extends Exception {
    constructor(message: string = 'You have many comments on this page') {
        super(message, HttpStatus.NOT_ACCEPTABLE)
    }
}

export default TooManyCommentsPerUserException
