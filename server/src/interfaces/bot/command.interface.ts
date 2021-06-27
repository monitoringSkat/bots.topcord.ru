import { Client, Message } from 'discord.js'

interface Command {
    name: string
    execute: (
        client: Client,
        message: Message,
        args: Array<string>
    ) => void | any
}

export default Command
