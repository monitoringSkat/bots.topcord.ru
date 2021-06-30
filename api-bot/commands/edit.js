const Bots = require("../models/bot")
const list = require('../mods.json')
const Discord = require("discord.js");

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
  }

module.exports = {
	name: 'edit',
	description: 'Редактировать бота',
    async execute(client, message, args) {


        if(!list.mods.includes(message.author.id)) return;

        if(!args[0]) return message.channel.send(`<:db_red:816728953661161542> Укажитете бота`)
        const getMember = require("../utils/member");
        const botid = await getMember(args[0]);
        const botes = await Bots.findOne({ id: botid })
        if(!botes) return message.channel.send(`<:db_red:816728953661161542> Такого бота нет!`)

        client.users.fetch(botid).then(botaa => {

            const link = `https://cdn.discordapp.com/avatars/${botid}/${botaa.avatar}.png?size=1280`
            
    
                botes.avatarURL = link
                botes.tag = botaa.username
                botes.discriminator = botaa.discriminator
                botes.save()

                message.channel.send('<:db_ok:816728953594839070> Бот был отредактирован!')

                if(botes.state == 'denied') {
                    stade = 'Отклонен'
                } else if (botes.state == 'approved') {
                    stade = 'На мониторинге'
                } else if (botes.state == 'queue') {
                    stade = 'В очереди'
                }

                const embed = new Discord.MessageEmbed()
                .setColor("#51F59C")
                .setTitle(`**${botes.tag}**`)
                .setThumbnail(botes.avatarURL)
                .setURL(`http://localhost:3080/bots/${botes.id}`)
                .addField('Информация:', `Разработчик: <@${botes.developer}> \nАпов: **${botes.rate}**\nСтадия: **${stade}**\nДобавлен: **${formatDate(botes.addedAt)}**\nИнвайт: [\`клик\`](https://discord.com/api/oauth2/authorize?client_id=${botes.id}&permissions=${botes.invite}&scope=bot)`)
                .addField('Краткое описание:', `\`\`\`fix\n${botes.shortDescription}\`\`\``)
                message.channel.send(embed)
                

                const botTest = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setColor("BLUE")
                .setThumbnail(botes.avatarURL)
                .setTitle(`Бот \`${botes.tag}\` тестируется`)
                return client.channels.cache.get('815869798000361502').send(`<@${botes.developer}>`, botTest)

            
         });



    }}