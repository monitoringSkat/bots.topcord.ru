const env = require('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client();
require('discord-buttons')(client);
const fs = require("fs");
client.commands = new Discord.Collection();
client.on('ready', () => {
    client.user.setActivity('!bot ID', { type: "WATCHING" });
    console.log(`[OK] DISCORD BOT | ${client.user.tag}!`);
  });


const commandFiles = fs.readdirSync('./topcord_cmds').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../topcord_cmds/${file}`);
	client.commands.set(command.name, command);
  console.log(`Loaded cmd: ${command.name}`)  
}

client.on('message', message => {
  const prefix = process.env.PREFIX;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = client.commands.get(args.shift().toLowerCase());
  if(!command) return;

  return command.execute(client, message, args);
});

  const BannedWords = require('./words.json')

client.on("message", message => {
    if (BannedWords.some(word => message.toString().toLowerCase().includes(word))) {
      message.delete().catch(e => console.error("Не смог удалить сообщение."));
       message.reply(`Данное слово запрещённо!`).then(msg => msg.delete({ timeout: 1000 }))};
});

client.login(process.env.TOKEN3)