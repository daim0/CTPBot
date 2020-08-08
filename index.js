const Discord = require('discord.js');
const client = new Discord.Client();

// import json.
const fileName = './List.json';
const { prefix, token } = require('./config.json');
const fs = require('fs');
const spriteList = require(fileName);
const thingy = " | ";

// On startup.
client.once('ready', () => {
	console.log('Ctp Bot running.\nContact Daim if help is needed.\n Current list length: ' + `${spriteList.length}`);
});

// Read messages.
client.on('message', message => {
    // Check if the message starts with our prefix.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // Check for arguments + ignore capitalisation.
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    // Info on sprite command.
    if (command === 'info') {
        // If user doesn't specify a sprite ID.
        if (!args.length) {
            return message.channel.send(`You need to specify a Sprite ID, ${message.author}`);
        }
        // If there is a sprite ID.
        else {
            // Iterate through every variable in the list.
            for(var i = 0; i < spriteList.length; i++)
            {
                // If the sprite ID inputed is the same as one in the list.
                if(args[0] === spriteList[i].Name)
                {
                    // Declare message variable and iterate through each of the sprites.
                    var m = "";
                    for(var j = 0; j < spriteList[i].Sprites.length; j++)
                    {
                        m += spriteList[i].Sprites[j].Type + thingy + spriteList[i].Sprites[j].FileName + thingy + 
                        (spriteList[i].Sprites[j].Sprited ? "Sprited.": "Not Sprited.") + "\n";
                    } 
                    message.channel.send("```" + m + "```");

                    // Send images.
                    for(var k = 0; k < spriteList[i].Sprites.length; k++)
                    {
                        if(spriteList[i].Sprites[k].Sprited)
                        {
                            message.channel.send(spriteList[i].Sprites[k].Type, {
                                files: [
                                    "./Images/" + spriteList[i].Sprites[k].FileName + ".png"
                                ]
                            });
                        }
                    }
                    return;
                }
            }
            // If the user doesn't input a correct ID.
            return message.channel.send(`Invalid Sprite ID (${args[0]}), ${message.author}`);
        }
    }
    // status command.
    else if(command === 'status')
    {
        var yourping = new Date().getTime() - message.createdTimestamp;

        return message.channel.send("```" + 
        'Bot is currently on.\n' + 
        `Your ping: ${yourping}ms.\n` + 
        "```");
    }
    else if(command === 'uptime')
    {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        return message.channel.send("```" + `Uptime:\n${days}d ${hours}h ${minutes}m ${seconds}s` + "```");
    }
    // Modify list command.
    else if(command === 'edit')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {
        // Check for sprite ID.
        if (!args.length) {
            return message.channel.send(`You need to specify a Sprite ID, ${message.author}`);
        }
        // Check ammount of args.
        else if(args.length < 3)
        {
            return message.channel.send(`Incorrect sytanx, usage: "!edit Name SheetNumber(1,2...) Status(true/false)"`);
        }
        else {
            // Check if both the second and third arguments are either true or false.
            if(!isNaN(args[1]) && parseInt(args[1],10) > 0)
            {
                if(args[2] == 'true' || args[2] == 'false')
                {
                    // Iterate through every variable in the list.
                    for(var i = 0; i < spriteList.length; i++)
                    {
                        if(args[0] === spriteList[i].Name)
                        {
                            // Override the variables.
                            if(parseInt(args[1], 10) > spriteList[i].Sprites.length)
                            {
                                return message.channel.send(`The argument inputted (${args[1]}) is bigger than the ammount of sprites(${(spriteList[i].Sprites.length)}).`)
                            } 
                            else
                            {
                                spriteList[i].Sprites[args[1] - 1].Sprited = args[2] == 'true' ? true : false;
                                                            // Write to the json file, this was pain.
                                fs.writeFile(fileName, JSON.stringify(spriteList, null, 2), function writeJSON(err) {
                                if (err) return console.log(err);
                                console.log('writing to ' + fileName);
                                });
                                return message.channel.send(`Edited ${spriteList[i].Name} succesfully.`);                                
                            }
                        }
                    }
                    return message.channel.send(`Invalid Sprite ID (${args[0]}), ${message.author}.`);
                }
                else return message.channel.send(`The string inputted (${args[2]}) is not true or false.`);
            }
            else return message.channel.send(`The string inputted (${args[1]}) is not a number or isn't bigger than 0.`);
        }
    }else return message.channel.send("Only administrators can use this command.");
    }
    // Help command.
    else if(command === 'help')
    {
        return message.channel.send("```" +
         "List of commands:\n" +
         "!help: displays a list of commands.\n" + 
         "!info: displays info on a sprite, usage: !info SpriteName.\n" + 
         "!edit: administrator command, modifies the info on a sprite, usage: !edit textureNumber true/false.\n" + 
         "!status: checks if the bot is on.\n" + 
         "!botinfo: displays basic bot info.\n" +
         "!uptime: displays the uptime of the bot.\n" + 
         "!random: displays a random sprite.\n" + 
         "!task: displays a random sprite that has not been finished" + 
         "```");
    }
    // Botinfo command.
    else if(command === 'botinfo')
    {
        return message.channel.send("```" + 
        "CTP Bot:\n" +
        "Current version: 0.2.2\n" + 
        "Bot github: https://github.com/daim0/CTPBot\n" +
        "If you come across any errors notify daimgamer#6490 on discord." +
        "```");
    }
    // Random command.
    else if(command === 'random')
    {
        // Gen random number between 0 and spriteList.Length
        // No idea why it has to be so hard, but javascript just likes it this way ig.
        var n = Math.floor((Math.random() * spriteList.length));
        // Declare message variable and iterate through each of the sprites.
        var m = "";
        for(var j = 0; j < spriteList[n].Sprites.length; j++)
        {
            m += spriteList[n].Sprites[j].Type + thingy + spriteList[n].Sprites[j].FileName + thingy + 
            (spriteList[n].Sprites[j].Sprited ? "Sprited.": "Not Sprited.") + "\n";
        } 
        message.channel.send("```" + m + "```");

        // Send images.
        for(var k = 0; k < spriteList[n].Sprites.length; k++)
        {
            if(spriteList[n].Sprites[k].Sprited)
            {
                message.channel.send(spriteList[n].Sprites[k].Type, {
                    files: [
                        "./Images/" + spriteList[n].Sprites[k].FileName + ".png"
                    ]
                });
            }
        }
        return;
    }
    // random not finished sprite command.
    else if(command === 'task')
    {
        let notSprited = []
        for (let i = 0; i < spriteList.length; i++) {
            let tempArr = spriteList[i].Sprites.filter(s => !s.Sprited)
            if (tempArr.length > 0) {
              notSprited.push(spriteList[i])
            }
        }
        if(notSprited.length >= 1)
        {
            let index = Math.floor(Math.random() * notSprited.length)

            var m = "";
            for(var j = 0; j < notSprited[index].Sprites.length; j++)
            {
                m += notSprited[index].Sprites[j].Type + thingy + notSprited[index].Sprites[j].FileName + thingy + 
                (notSprited[index].Sprites[j].Sprited ? "Sprited.": "Not Sprited.") + "\n";
            } 
            message.channel.send("```"+`${notSprited[index].Name}:\n` + m + "```");
    
            for(var k = 0; k < notSprited[index].Sprites.length; k++)
            {
                if(notSprited[index].Sprites[k].Sprited)
                {
                    message.channel.send(notSprited[index].Sprites[k].Type, {
                        files: [
                            "./Images/" + notSprited[index].Sprites[k].FileName + ".png"
                        ]
                    });
                }
            }
            return;
        } else return message.channel.send("All current sprites are done!");


    }

    else if(command === 'search')
    {  
        var test = fs.readFileSync("b.txt", "utf-8"); 
        var WordArr = test.split('\n');
        console.log(WordArr);
        var lista = difflib.getCloseMatches(args[0], WordArr, n=20, cutoff=0.5);
        return message.channel.send(lista);     
    }
});

// Login to discord true hackerman style :sugnlasses.
client.login(process.env.token);