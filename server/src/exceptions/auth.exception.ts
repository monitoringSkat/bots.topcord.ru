import { HttpStatus } from "../enums";
import Exception from "./exception";

class AuthException extends Exception {
    constructor(
        message: string = "Unauthorized"
    ) {
        super(message, HttpStatus.UNAUTHORIZED)
    }
}

export default AuthException