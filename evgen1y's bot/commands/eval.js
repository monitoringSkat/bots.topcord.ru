const list = require('../mods.json')

module.exports = {
	name: 'eval',
	description: 'Eval comanda hyle nado ¯\_(ツ)_/¯',
    async execute(client, message, args) {
        const Bots = require("../models/bot")
        const { inspect } = require("util");
        const Discord = require("discord.js");
        const token = client.token.split("").join("[^]{0,2}");
        const rev = client.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        const code = args.join(" ");
        if (
          list.own.includes(message.author.id)
        ) {
          try {
            if (!code) return message.channel.send("Пиши код");
            let hrDiff;
            const hrStart = process.hrtime();
            hrDiff = process.hrtime(hrStart);
            let output = eval(`${code}`);
            let type = typeof output;
            if (
              output instanceof Promise ||
              (Boolean(output) &&
                typeof output.then === "function" &&
                typeof output.catch === "function")
            )
              output = await output;
    
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "[TOKEN]");
            output = clean(output);
            if (
              output === undefined ||
              output === "undefined" ||
              output === null ||
              output === "null"
            )
              output = "Empty response: " + output;
            if (output.length < 1950) {
              message.channel.send(`\`\`\`js\n${output}\`\`\``);
            } else {
              message.author.send(`${output}`, { split: "\n", code: "js" });
            }
          } catch (error) {
            message.channel.send(`\`\`\`js\n${error}\`\`\``);
          }
        }
    
        function clean(text) {
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        }
      },
    };