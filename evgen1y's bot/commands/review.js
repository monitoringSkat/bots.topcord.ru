const Bots = require("../models/bot")

const Discord = require("discord.js");

const list = require('../mods.json')

module.exports = {
	name: 'review',
	description: 'Команда для верификации/отклонения бота',
    async execute(client, message, args) {

        if(!args[0]) {
          
            message.channel.send(`<:db_red:816728953661161542> Напишите allow/deny/delete.`)
        }


        if(args[0] == "allow") {
            if(!list.mods.includes(message.author.id)) return;
            if(!args[1]) return message.channel.send(`<:db_red:816728953661161542> Укажитете бота`)
            const getMember = require("../utils/member");
            const botid = await getMember(args[1]);
            const bot = await Bots.findOne({ id: botid })
            if(!bot) return message.channel.send(`<:db_red:816728953661161542> Этот бот не ждет проверки`)
            await Bots.findOneAndUpdate({ id: botid }, { $set: { state: "approved" } })
            message.channel.send(`<:db_ok:816728953594839070> Бот был успешно верифицирован`)
            const embedApprove = new Discord.MessageEmbed()
            .setTitle(`Бот \`${bot.tag}\` был принят :tada:`)
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setThumbnail(bot.avatarURL)
            .setColor("#51F59C")
            return client.channels.cache.get('815869798000361502').send(`<@${bot.developer}>`, embedApprove)
            } if(args[0] == "deny") {
                if(!list.mods.includes(message.author.id)) return;

                if(!args[1]) return message.channel.send(`<:db_red:816728953661161542> Укажите бота`)
                const getMember = require("../utils/member.js");
                const botid = await getMember(args[1]);
                if(!args[2]) return message.channel.send(`<:db_red:816728953661161542> Укажите причину выговора`)
                const bot = await Bots.findOne({ id: botid })
                let reasonDeny = args.slice(2).join(" ");
                if(!bot) return message.channel.send(`<:db_red:816728953661161542> Этот бот не ждет проверки`)
                await Bots.findOneAndUpdate({ id: botid }, { $set: { state: "denied" } })
                message.channel.send(`<:db_ok:816728953594839070> Бот был успешно отклонен`)
                const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setColor("#F93737")
                .setThumbnail(bot.avatarURL)
                .setTitle(`Бот \`${bot.tag}\` был отклонен по причине:`)
                .setDescription(`\`\`\`json\n${reasonDeny}\`\`\``)
                return client.channels.cache.get('815869798000361502').send(`<@${bot.developer}>`, embed)
        } if(args[0] == "delete") {
            if(!list.mods.includes(message.author.id)) return;

            if(!args[1]) return message.channel.send(`<:db_red:816728953661161542> Укажите бота`)
            const getMember = require("../utils/member.js");
            const botid = await getMember(args[1]);
            if(!args[2]) return message.channel.send(`<:db_red:816728953661161542> Укажите причину удаления`)
            let reasonDelete = args.slice(2).join(" ");
            const bot = await Bots.findOne({ id: botid })
            if(!bot) return message.channel.send(`<:db_red:816728953661161542> Такого бота нет ¯\_(ツ)_/¯`)
            await Bots.findOneAndDelete({ id: botid })
            message.channel.send(`<:db_ok:816728953594839070> Бот был успешно удален`)
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setColor("#F93737")
            .setThumbnail(bot.avatarURL)
            .setTitle(`Бот \`${bot.tag}\` был удален по причине:`)
            .setDescription(`\`\`\`json\n${reasonDelete}\`\`\``)
            return client.channels.cache.get('815869798000361502').send(`<@${bot.developer}>`, embed)
    }

    },
};