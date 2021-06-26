import { HttpStatus } from "../enums";
import Exception from "./exception";

class RateLimitException extends Exception {
    constructor(
        message: string = "Rate limit!",
    ) {
        super(message, HttpStatus.TOO_MANY_REQUESTS)
    }
}

export default RateLimitException