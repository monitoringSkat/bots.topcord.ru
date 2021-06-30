const env = require('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client();
require('discord-buttons')(client);
const fs = require("fs");
client.commands = new Discord.Collection();

client.on('ready', () => {
    client.user.setActivity('!bot | Library', { type: "WATCHING" });
    console.log(`[OK] DISCORD BOT | ${client.user.tag}!`);
  });


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	client.commands.set(command.name, command);
  console.log(`Loaded cmd: ${command.name}`)  
}

//fs.readdir(__dirname + "/events/", (err, files) => {
  //if (err) return console.error(err);
  //files.forEach((file) => {
    //const event = require(__dirname + `/events/${file}`);
    //let eventName = file.split(".")[0];
    //client.on(eventName, event.bind(null, client));
    //console.log("Loading Event: "+eventName)
  //});
  //});

client.on('message', message => {
  const prefix = process.env.PREFIX;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = client.commands.get(args.shift().toLowerCase());
  if(!command) return;



  return command.execute(client, message, args);
});

const webhook = new Discord.Webhook("858357490612830219", "cPmRCLQg-PJpE8DYPQpWBh5ePHPrpOGNTVCwRDSdPQd3AlHPLvnS1sa--R7Z_7W54B5W");
const webhook2 = new Discord.Webhook("856995177112535090", "lXtEfQECyB6mYdQ_6JCuFBRhBJn44IpC9qgCpgPJsNVZLON7eZKY55JatvWntjFSUVAB");


client.login(process.env.TOKEN)