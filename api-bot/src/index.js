require('dotenv').config()
const { Client , Collection} = require("discord.js")
const discordButtons = require('discord-buttons')
const fs = require("fs")
const path = require("path")

const client = new Client()
discordButtons(client)
client.commands = new Collection()

const cwd = process.cwd()
const { TOKEN, PREFIX } = process.env


client.on('ready', () => {
    client.user.setActivity('!bot ID', { type: "WATCHING" })
    console.log(`[OK] DISCORD BOT | ${client.user.tag}!`)
})


const commandFiles = fs.readdirSync(path.join(cwd, 'src', 'commands')).filter(file => file.match(/.js$/i))

for (const file of commandFiles) {
	const command = require(path.join(cwd, 'src', 'commands', file))
	client.commands.set(command.name, command)
    console.log(`Loaded cmd: ${command.name}`)  
}

client.on('message', message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = client.commands.get(args.shift().toLowerCase());
  if(!command) return;

  return command.execute(client, message, args);
});

const bannedWords = ['elemelkya', "елемелька", "https://discord.gg/netherlands", "discord.gg/netherlands", "элемелька",]

client.on("message", async message => {
    if (bannedWords.some(word => message.toString().toLowerCase().includes(word))) {
        try {
            await message.delete()
            const msg = await message.reply(`Данное слово запрещённо!`)
            if (msg) msg.delete({ timeout: 1000 })
        } catch(e) {
            console.error("Не смог удалить сообщение.")
        }
    }
});

client.login(TOKEN)