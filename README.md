# DiscordATP

Simple Discord Anti Phishing message bot.

## Feature

Simple enough, It only removes message that contains link reconized as a phishing link and report it to the log channel (#atp-log).


 ![gif](https://i.imgur.com/cYnzucF.gif)
 

## Prerequisite

* NodeJs 16

## Setup

### 1. Install Dependencies

```bash
$ yarn install
```

### 2. Fill in token in credentials-example.js and rename to credentials.js

```js
const token = ""
//const prefix = ""

module.exports = {
    token,
    //prefix
}

```

### 3. Run the bot

```bash
$ node .
```

### 4. Invite the bot to the server

Permission: 1099511638070

## License

[MIT License](https://github.com/gxjakkap/discordatp/blob/main/LICENSE)