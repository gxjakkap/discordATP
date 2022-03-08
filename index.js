const { Client, Intents, Guild, Permissions, MessageEmbed } = require("discord.js");
const config = require('./config.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const stopPhishing = require('stop-discord-phishing')
//const prefix = config.prefix;
const token = config.token;
const logch = config.logchannel;

/**async function checkMessage(message) {
    //check string on confirmed Phishing Domains
    let isGrabber = await stopPhishing.checkMessage(message)
    //Now you can do something with the Boolean Value
    console.log(isGrabber)
    return isGrabber
}**/

async function checkMessageFull(message) {
    let isGrabber = await stopPhishing.checkMessage(message)
    return isGrabber
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
        .setDescription("I'm a bot that prevents phishing link from being posted. When people get kicked from posting phishing link, I will log it at #atp-log. If you find any bug, please report them on my Github issues. Link in my bio. If you find any link that I missed, please report them to nikolaischunk/discord-phishing-links on Github.")
        .setFooter({ text: "Made by GuntxJakka" })
        .setTimestamp()
    channel.send({ embeds: [embed] })

})

client.on("messageCreate", message => {
    if (message.author.bot) return;

    checkMessageFull(message.content).then(isGrabber => {
        if (isGrabber) {
            if (!message.member.kickable) {
                message.delete();
            } else {
                let log = message.member.guild.channels.cache.find(channel => channel.name === logch)
                let user = message.author
                log.send(`${user} (${user.tag}) has been kicked by ATP for sending Phishing messages.`)
                message.delete();
                message.member.kick('Phishing Link')
            }
        }
    })

    //if (message.content.indexOf(prefix) !== 0) return;

    /**const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();**/

});

client.login(token);