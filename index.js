const { Client, Intents, Guild } = require("discord.js");
const credentials = require('./credentials.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const stopPhishing = require('stop-discord-phishing')
//const prefix = credentials.prefix;
const token = credentials.token;

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
    guild.createChannel("atp-log", "text");
})

client.on("messageCreate", message => {
    if (message.author.bot) return;

    checkMessageFull(message.content).then(isGrabber => {
        if (isGrabber) {
            if (!message.member.kickable) {
                message.delete();
            } else {
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