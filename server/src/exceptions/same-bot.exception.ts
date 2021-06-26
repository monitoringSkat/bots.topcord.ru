import { HttpStatus } from "../enums";
import Exception from "./exception";

class SameBotException  extends Exception {
    constructor(
        m: string = "Bot with the same ID!"
    ) {
        super(m, HttpStatus.CONFLICT)
    }
}