const { MessageEmbed } = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons')
const fetch = require('node-fetch')

module.exports = {
    name: 'bot',
    description: 'Topcord API',
    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send(`Укажите ID бота с TopCord`)
        } else {
            const bot = args[0]

            fetch(`https://topcord.ru/api/${bot}`)
                .then(res => res.json())
                .then(info => {
                    if (info.error == 'Unknown bot') {
                        return message.channel.send(`Бот \`${bot}\` не найден.`)
                    }

                    if (429 == 'Too Many Requests') {
                        return message.channel.send(`Too Many Requests`)
                    }

                    client.users.fetch(bot).then(botid => {
                        const link = `https://cdn.discordapp.com/avatars/${bot}/${botid.avatar}.png?size=1280`

                        const tags = info.botTags

                        const tagsTr = {
                            moderation: 'Модерация',
                            utility: 'Утилиты',
                            fun: 'Веселье',
                            anime: 'Аниме',
                            economy: 'Экономика',
                            leveling: 'Система уровней',
                            music: 'Музыка',
                            meme: 'Мемы'
                        }

                        const tagsArr = []
                        tags.forEach(tag => {
                            tags.push(tagsTr[tag])
                            tagsArr.push(tagsTr[tag])
                        })

                        const tagsString = tagsArr.join(', ')

                        const embed = new MessageEmbed()

                        embed.setTitle(info.bot.username)
                        embed.setDescription(
                            `\`\`\`json\n${info.shortDesc}\`\`\`\nРазработчик: <@${info.owner.id}>\n Апов: **${info.upvotes}**\nПрефикс: **${info.prefix}**\n Бот добавлен на сайт: **${info.date.addedAt}** \n Бот создан: **${info.date.createdAt}**`
                        )
                        embed.setFooter(`Теги: ${tagsString}.`)
                        embed.setColor('#7289da')
                        embed.setThumbnail(link)

                        const button = new MessageButton()
                        button.setStyle('url')
                        button.setURL(`https://topcord.ru/bots/${bot}`)
                        button.setLabel('Бот на TopCord')
                        button.setEmoji('858744916720353340')

                        const button2 = new MessageButton()
                        button2.setStyle('url')
                        button2.setURL(info.customInvite)
                        button2.setLabel('Пригласить Бота')
                        button2.setEmoji('858744623055503370')

                        const row = new MessageActionRow()
                            .addComponent(button)
                            .addComponent(button2)

                        if (!info.botWebsite) {
                            message.channel.send({
                                embed: embed,
                                components: [row]
                            })
                        } else {
                            const button3 = new MessageButton()
                            button3.setStyle('url')
                            button3.setURL(info.botWebsite)
                            button3.setLabel('Сайт')
                            button3.setEmoji('858761530770456606')

                            const row2 = new MessageActionRow()
                                .addComponent(button)
                                .addComponent(button2)
                                .addComponent(button3)

                            message.channel.send({
                                embed: embed,
                                components: [row2]
                            })
                        }
                    })
                })
        }
    }
}
