import Event from "../../interfaces/bot/event.interface";

const ready: Event = {
    name: "ready",
    execute() {
        console.log("Client is ready!")
    }
}

export default ready