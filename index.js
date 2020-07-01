const Discord = require('discord.js');
const client = new Discord.Client();

// import json.
const fileName = './List.json';
const { prefix, token } = require('./config.json');
const fs = require('fs');
const spriteList = require(fileName);

// On startup.
client.once('ready', () => {
	console.log('Ctp Bot running.\nContact Daim if help is needed.');
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
            var thingy = " | ";
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
        const m = await message.channel.send("Ping?");

        return message.channel.send("```" + 
        'Bot is currently on.\n' + 
        `Latency: ${m.createdTimestamp - message.createdTimestamp}ms.\n` + 
        `API Latency: ${Math.round(client.ping)}ms.` + "```");
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
            return message.channel.send(`Incorrect sytanx, usage: "!edit Name Item(true/false) Sheet(true/false)"`);
        }
        else {
            // Check if both the second and third arguments are either true or false.
            if(!isNaN(args[1]))
            {
                if(args[2] == 'true' || args[2] == 'false')
                {
                    // Iterate through every variable in the list.
                    for(var i = 0; i < spriteList.length; i++)
                    {
                        if(args[0] === spriteList[i].Name)
                        {
                            // Override the variables.
                            if((args[1]-1) <= spriteList[i].Sprites.length)
                            {
                                spriteList[i].Sprites[args[1] - 1].Sprited = args[2] == 'true' ? true : false;
                                                            // Write to the json file, this was pain.
                                fs.writeFile(fileName, JSON.stringify(spriteList, null, 2), function writeJSON(err) {
                                if (err) return console.log(err);
                                console.log('writing to ' + fileName);
                              });
                              return message.channel.send('Edit made succesfully.');
                            } else return message.channel.send(`The argument inputted (${args[1]}) is bigger than the ammount of sprites(${spriteList[i].Sprites.length + 1})`)
                        }
                    }
                    return message.channel.send(`Invalid Sprite ID (${args[0]}), ${message.author}`);
                }
                else return message.channel.send(`The string inputted (${args[2]}) is not true or false`);
            }
            else return message.channel.send(`The string inputted (${args[1]}) is not a number`);
        }
    }else return message.channel.send("Only administrators can use this command");
    }
    else if(command === 'help')
    {
        return message.channel.send("```" +
         "List of commands:\n" +
         "!help: displays a list of commands.\n" + 
         "!info: displays info on a sprite, usage: !info SpriteName.\n" + 
         "!edit: administrator command, modifies the info on a sprite, usage: !edit textureNumber true/false.\n" + 
         "!status: checks if the bot is on." + "```");
    }
    else if(command === 'botinfo')
    {
        return message.channel.send("```" + 
        "CTP Bot:\n" +
        "Current version: 0.1.1.\n" + 
        "If you come across any errors notify daimgamer#6490 on discord." +
        "```");
    }
});

// Login to discord true hackerman style :sugnlasses.
client.login(process.env.token);