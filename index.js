const { Client, Intents, Permissions, MessageEmbed } = require("discord.js");
const config = require('./config.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const stopPhishing = require('stop-discord-phishing')
const token = config.token;
const logch = config.logchannel;

async function checkMessage(message) {
    let isGrabber = await stopPhishing.checkMessage(message) //https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/txt/domain-list.txt
    let isSuspicious = await stopPhishing.checkMessage(message, true) //also check for suspicious link list. https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/txt/suspicious-list.txt
    return [isGrabber, isSuspicious]
}


client.on("ready", () => {
    client.user.setActivity("for phishing link", { type: 'WATCHING' });
    console.log(`Logged in. I'm ${client.user.tag}!`);
});

client.on("guildCreate", guild => {
    if (!guild.channels.cache.find(channel => channel.name === logch)) {
        guild.channels.create(logch, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
                {
                    id: client.user.id,
                    allow: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ]
        });
    }
    let channel = guild.systemChannel
    let embed = new MessageEmbed()
        .setTitle("Hi, I'm Atp.")
        .setURL("https://github.com/gxjakkap/discordATP")
        .setColor('#00b3ff')
        .setDescription(`I'm a bot that prevents phishing link from being posted. When people get kicked from posting phishing link, I will log it at #${logch}. If you find any bug, please report them on my Github issues. Link in my bio. If you find any link that I missed, please report them to nikolaischunk/discord-phishing-links on Github.`)
        .setFooter({ text: "Made by GuntxJakka" })
        .setTimestamp()
    channel.send({ embeds: [embed] })

})

client.on("messageCreate", message => {
    if (message.author.bot) return;

    checkMessage(message.content).then(result => {
        if (result[0]) {
            if (!message.member.kickable) {
                message.delete();
            } else {
                let log = message.member.guild.channels.cache.find(channel => channel.name === logch)
                let user = message.author
                let embed = new MessageEmbed()
                    .setTitle("User has been kicked")
                    .setColor('#00b3ff')
                    .setDescription(`${user} has been kicked by Atp.`)
                    .addFields(
                        { name: 'Id', value: `${user.id}` },
                        { name: 'Discord Tagline', value: `${user.tag}` }
                    )
                    .setTimestamp()
                    .setThumbnail(message.author.avatarURL())
                log.send({ embeds: [embed] })
                message.delete();
                message.member.kick('Phishing Link')
            }
        } else if (result[1]) {
            message.reply('This message contains link that has been flagged as suspicious. Be careful!')
            //message.delete();
        }
    })
});

client.login(token);