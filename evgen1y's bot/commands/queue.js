const { MessageEmbed } = require('discord.js')
const Bots = require("../models/bot")
const list = require('../mods.json')
module.exports = {
    name: 'queue',
    description: 'OCHERED',
    async execute(client, message, args) {

      if(!list.mods.includes(message.author.id)) return;

    const id = "8";
    let queue = "";
    let bots = await Bots.find({ state: "queue" })
  bots.forEach(bot => { queue += `**${bot.tag}** \`${bot.id}\` : [Invite](https://discord.com/api/oauth2/authorize?client_id=${bot.id}&permissions=${bot.invite}&scope=bot) & [View](http://localhost:3080/bots/${bot.id})\n ` })
    if (bots.length === 0) queue = "Очередь пуста";
      let embed = new MessageEmbed()
        .setTitle('Очередь')
        .setColor(0x6b83aa)
        .setDescription(queue)
    message.channel.send(embed)
    

    }}