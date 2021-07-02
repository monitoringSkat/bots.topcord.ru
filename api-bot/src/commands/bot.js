const { MessageEmbed } = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons')
const fetch = require('node-fetch')

module.exports = {
    name: 'bot',
    description: 'Topcord API',
    async execute(client, message, args) {
        if (!args.length) return message.channel.send(`Укажите ID бота с TopCord`)
        try {
            const bot = args[0]
            const res = await fetch(`https://bots.topcord.ru/api/${bot}`)
            const info = await res.json()
            console.log(info)
            // const botid= await client.users.fetch(bot)
        } catch(e) {
            console.log(e)
            message.channel.send('Some errors')
        }
    }
}