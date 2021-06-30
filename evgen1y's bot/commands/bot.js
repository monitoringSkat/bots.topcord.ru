const Bots = require("../models/bot")

const Discord = require("discord.js");

const { MessageButton, MessageActionRow } = require('discord-buttons');

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
	name: 'bot',
	description: 'Информация о боте',
    async execute(client, message, args) {

            if(!args[0]) return message.channel.send(`<:db_red:816728953661161542> Укажитете бота`)
            const getMember = require("../utils/member");
            const botid = await getMember(args[0]);
            const bot = await Bots.findOne({ id: botid })
            if(!bot) return message.channel.send(`<:db_red:816728953661161542> Такого бота нет!`)
            if(bot.state == 'denied') {
                stade = 'Отклонен'
            } else if (bot.state == 'approved') {
                stade = 'На мониторинге'
            } else if (bot.state == 'queue') {
                stade = 'В очереди'
            }
            const embed = new Discord.MessageEmbed()
            .setColor("#51F59C")
            .setTitle(`**${bot.tag}**`)
            .setThumbnail(bot.avatarURL)
            .setDescription(`\`\`\`json\n${bot.shortDescription}\`\`\`\nРазработчик: <@${bot.developer}> \nАпов: **${bot.rate}**\nСтадия: **${stade}**\nДобавлен: **${formatDate(bot.addedAt)}**`)
            

            const button = new MessageButton()
            button.setStyle('url')
            button.setURL(`http://localhost:3080/bots/${bot.id}`) 
            button.setLabel('Бот на Discord Library') 
            button.setEmoji('858744916720353340')

         const button2 = new MessageButton()
            button2.setStyle('url')
            button2.setURL(`https://discord.com/api/oauth2/authorize?client_id=${bot.id}&permissions=${bot.invite}&scope=bot`)
            button2.setLabel('Пригласить Бота')
            button2.setEmoji('858744623055503370')                

            const row = new MessageActionRow()
               .addComponent(button)
               .addComponent(button2);

         message.channel.send({
             embed: embed,
             components: [row]})
    },
};