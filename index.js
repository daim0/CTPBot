const Discord = require('discord.js');
const client = new Discord.Client();

// import json.
const fileName = './List.json';
const { prefix, token } = require('./config.json');
const fs = require('fs');
const spriteList = require(fileName);
const thingy = " | ";
var difflib = require('difflib');
const { time } = require('console');


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
                    const embed = new Discord.MessageEmbed()
                    .setTitle(args[0])
                    .setDescription("```" + m + "```")
                    .setColor(7909985)
                    .setTimestamp()
                    message.channel.send({embed}); 

                    var spritesnumber = 0;
                    //if the number of sprites exceeds 3 the bot will send a zip folder with the files instead of posting them
                    for(var l = 0; l < spriteList[i].Sprites.length; l++)
                    {
                        if(spriteList[i].Sprites[l].Sprited)
                        {
                            spritesnumber++;
                        }
                    }
                    if(spritesnumber > 3)
                    {
    
                        //function to stop the bot and load the zip folder
                        function sendzip(){
                            message.channel.send({ files: ['Sprites.zip'] })
                        }
                        
                        //function to stop the bot and load the zip folder
                        function makezip(){
                            var archiver = require('archiver');

                        //declaring the name for the zip folder
                        var output = fs.createWriteStream('Sprites.zip');
                        var archive = archiver('zip');

                        archive.on('error', function(err){
                        throw err;
                        });

                        archive.pipe(output);
                        //copying all the files from "ZipArchiverTemp" folder into the final zip folder
                        archive.directory('./ZipArchiverTemp', false);

                        archive.finalize();
                        }

                        //function to stop the bot and copy the files from "./Images" folder
                        function Copy(){
                            var path = require('path');
                            for(var k = 0; k < spriteList[i].Sprites.length; k++)
                            {
                                if(spriteList[i].Sprites[k].Sprited)
                                {   
                                    //declaring the variables for the location of the sprite image file and it's destination
                                    var oldPath = path.join('./Images', spriteList[i].Sprites[k].FileName + '.png');
                                    var newPath = path.join('./ZipArchiverTemp', spriteList[i].Sprites[k].FileName + '.png');
                                    
                                    //copying the image to the temporary folder
                                    fs.copyFile(oldPath, newPath, function(err) {
                                        if (err) {
                                        throw err
                                        }
                                    });
                            
                                }
                            }
                        }

                        var path = require('path');
                        var directory = './ZipArchiverTemp';

                        //removing the previous file from "ZipArchiverTemp" folder 
                        fs.readdir(directory, (err, files) => {
                        if (err) throw err;

                        for (const file of files) {
                        fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                        });
                        }
                        });

                        //function to work after 1s for the issue declared above
                        setTimeout(Copy, 1000);

                        //function to work after 1.5s for the issue declared above
                        setTimeout(makezip, 1500);   

                        //function to work after 2s for the issue declared above
                        setTimeout(sendzip, 2000);

                        return
                    }

                    else 
                    {
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
                        return 
                    }   
                }
            }
            // If the user doesn't input a correct ID.
            var test = fs.readFileSync("b.txt", "utf-8"); 
            var WordArr = test.split('\r');
            var list = difflib.getCloseMatches(args[0], WordArr, n=10, cutoff=0.5);
            if (list.length == 0)
            {
                const embed = new Discord.MessageEmbed()
                .setTitle("Invalid Sprite ID")
                .setColor(7909985)
                .setTimestamp()
                return message.channel.send({embed});  
            }
            else
            {
                const embed = new Discord.MessageEmbed()
                .setTitle("Invalid Sprite ID (" + args[0] + "), did you mean:")
                .setDescription("```" + list + "\n```")
                .setColor(7909985)
                .setTimestamp()
                return message.channel.send({embed});  
            }   
        
        }
    }
    // status command.
    else if(command === 'status')
    {
        var yourping = new Date().getTime() - message.createdTimestamp;

        const embed = new Discord.MessageEmbed()
        .setTitle("Status")
        .setDescription("```" + 
        'Bot is currently on.\n' + 
        `Your ping: ${yourping}ms.\n` + 
        "```")
        .setColor(7909985)
        .setTimestamp()
        return message.channel.send({embed});
    }
    else if(command === 'uptime')
    {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        const embed = new Discord.MessageEmbed()
        .setTitle("Uptime")
        .setDescription("```" + `Uptime:\n${days}d ${hours}h ${minutes}m ${seconds}s` + "```")
        .setColor(7909985)
        .setTimestamp()
        return message.channel.send({embed});
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
        const embed = new Discord.MessageEmbed()
        .setTitle("List of commands:")
        .setDescription("**!help:** displays a list of commands.\n" + 
        "**!info:** displays info on a sprite, usage: !info SpriteName.\n" + 
        "**!search:** displays a list of close matches between the input and the list content, usage: !search similar SpriteName.\n" + 
        "**!edit:** administrator command, modifies the info on a sprite, usage: !edit textureNumber true/false.\n" + 
        "**!status:** checks if the bot is on.\n" + 
        "**!botinfo:** displays basic bot info.\n" +
        "**!uptime:** displays the uptime of the bot.\n" + 
        "**!random:** displays a random sprite.\n" + 
        "**!task:** displays a random sprite that has not been finished")
        .setColor(7909985)
        .setTimestamp()
        return message.channel.send({embed});
        
    }
    // Botinfo command.
    else if(command === 'botinfo')
    {
        const embed = new Discord.MessageEmbed()
        .setTitle("Bot Info")
        .setDescription("```" + 
        "CTP Bot:\n" +
        "Current version: 1.0.0\n" + 
        "Bot github: https://github.com/daim0/CTPBot\n" +
        "If you come across any errors notify daim#6490 or Felipe350#5384 on discord." +
        "```")
        .setColor(7909985)
        .setTimestamp()
        return message.channel.send({embed});
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
        const embed = new Discord.MessageEmbed()
        .setTitle(spriteList[n].Name)
        .setDescription("```" + m + "```")
        .setColor(7909985)
        .setTimestamp()
        message.channel.send({embed}); 

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
            const embed = new Discord.MessageEmbed()
            .setTitle(notSprited[index].Name)
            .setDescription("```" + m + "```")
            .setColor(7909985)
            .setTimestamp()
            message.channel.send({embed}); 
    
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
    // Search command.
    else if(command === 'search')
    {  
        var test = fs.readFileSync("b.txt", "utf-8"); 
        var WordArr = test.split('\r');
        var list = difflib.getCloseMatches(args[0], WordArr, n=20, cutoff=0.5);
        if (list.length == 0)
        {
            const embed = new Discord.MessageEmbed()
            .setTitle("There's no iternal name similar to the one you enterd")
            .setColor(7909985)
            .setTimestamp()
            return message.channel.send({embed});  
        }
        else
        {
            const embed = new Discord.MessageEmbed()
            .setTitle('Were you looking for:')
            .setDescription("```" + list + "\n```")
            .setColor(7909985)
            .setTimestamp()
            return message.channel.send({embed});  
        }   
    }

});


// Login to discord true hackerman style :sugnlasses.
client.login(process.env.token);