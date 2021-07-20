import fs from 'fs'
import path from 'path'
import { Client } from 'discord.js'
import { config } from 'dotenv'
import Command from '../interfaces/bot/command.interface'
import Event from '../interfaces/bot/event.interface'

const { parsed } = config()

const prefix = parsed.DISCORD_BOT_PREFIX

const bootstrapBot = async () => {
    const client = new Client()
    const commandsFiles = fs.readdirSync(path.join(__dirname, 'commands'))
    const eventsFiles = fs.readdirSync(path.join(__dirname, 'events'))
    const commands = new Map<string, Command>()
    const events = new Map<string, Event>()
 
    for (const file of commandsFiles) {
        const command = require(`./commands/${file}`).default
        if (command?.name) commands.set(command.name, command)
    }

    for (const file of eventsFiles) {
        const event = require(`./events/${file}`).default
        if (event?.name) {
            client.on(event.name, event.execute)
            events.set(event.name, event)
        }
    }

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command = commands.has(commandName)
        if (!command) return
        try {
            commands.get(commandName).execute(client, message, args)
        } catch (error) {
            console.error(error)
            message.reply('there was an error trying to execute that command!')
        }
    })

    client.login(parsed.DISCORD_BOT_TOKEN)
    return client
}

export default bootstrapBot
