const { MessageEmbed } = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons')
const fetch = require('node-fetch')

module.exports = {
    name: 'bot',
    description: 'Topcord API',
    async execute(client, message, args) {
        if (!args.length)
            return message.channel.send(`Укажите ID бота с TopCord`)
        try {
            const botId = args[0]
            const res = await fetch(`https://bots.topcord.ru/api/${botId}`)
            if (res.status === 429) return message.channel.send(`Too Many Requests`)

            const info = await res.json()
            if (info.error == 'Unknown bot') return message.channel.send(`Бот \`${bot}\` не найден.`)
            
            const bot = await client.users.fetch(botId)
            const avatar = `https://cdn.discordapp.com/avatars/${bot}/${bot.avatar}.png?size=1280`
            console.log(info)
            const embed = new MessageEmbed()
            .setTitle(info.bot.username)
            .setDescription(
                `\`\`\`json\n${info.shortDesc}\`\`\`\nРазработчик: <@${info.owner.id}>\n Апов: **${info.upvotes}**\nПрефикс: **${info.prefix}**\n Бот добавлен на сайт: **${info.date.addedAt}** \n Бот создан: **${info.date.createdAt}**`
            )
            embed.setFooter(`Теги: ${info.botTags.join(", ")}.`)
            embed.setColor('#7289da')
            embed.setThumbnail(avatar)

            const button = new MessageButton()
            .setStyle('url')
            .setURL(`https://topcord.ru/bots/${botId}`)
            .setLabel('Бот на TopCord')
            .setEmoji('858744916720353340')

            const button2 = new MessageButton()
            .setStyle('url')
            .setURL(info.customInvite)
            .setLabel('Пригласить Бота')
            .setEmoji('858744623055503370')

            const button3 = new MessageButton()
            .setStyle('url')
            .setURL(info.botWebsite)
            .setLabel('Сайт')
            .setEmoji('858761530770456606')

            const row = new MessageActionRow()
            .addComponent(button)
            .addComponent(button2)

            info.botWebsite && row.addComponent(button3)

            message.channel.send({ embed, components: [row] })
        } catch (e) {
            console.log(e)
            message.channel.send('Some errors')
        }
    }
}
