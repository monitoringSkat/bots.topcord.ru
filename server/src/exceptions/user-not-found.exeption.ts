import { HttpStatus } from "../enums";
import Exception from "./exception";

class UserNotFoundException extends Exception {
    constructor(
        m: string = "User not found!"
    ) {
        super(m, HttpStatus.NOT_FOUND)
    }
}

export default UserNotFoundException