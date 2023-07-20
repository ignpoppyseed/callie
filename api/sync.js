const axios = require("axios");

async function find_old_commands(local_commands, discord_commands) {
    const missingKeys = [];
  
    discord_commands.forEach((discord_commands) => {
        const name = discord_commands['name'];
        const id = discord_commands['id'];
        const matchingDict = local_commands.find((local_commands) => local_commands['name'] === name);
    
        if (matchingDict) {
            Object.keys(discord_commands).forEach((key) => {
            matchingDict[key] = discord_commands[key];
            });
        } else {
            missingKeys.push({name, id});
        }
    });
  
    return missingKeys;
}

const commands = [
    {
        "name": "help",
        "type": 1,
        "description": "help menu <3"
    },
    {
        "name": "uwu",
        "type": 1,
        "description": "uwu <3"
    },
    {
        "name": "credits",
        "type": 1,
        "description": "credits for callie <3"
    },
    {
        "name": "invite",
        "type": 1,
        "description": "invite callie <3"
    },
    {
        "name": "moomin",
        "type": 1,
        "description": "moomin <3"
    },
    {
        "name": "blahaj",
        "type": 1,
        "description": "random blahaj <3"
    },
    {
        "name": "cat-fact",
        "type": 1,
        "description": "random cat fact <3"
    },
    {
        "name": "flip",
        "type": 1,
        "description": "flip a coin <3"
    },
    {
        "name": "avatar",
        "type": 1,
        "description": "fetch a user's avatar <3",
        "options": [
            {
                "name": "user",
                "description": "the user to get the avatar of",
                "type": 6,
                "required": false
            }
        ]
    },
    {
        "name": "mc-skin",
        "type": 1,
        "description": "fetch someone's minecraft skin <3",
        "options": [
            {
                "name": "username",
                "description": "the username of the skin's wearer",
                "type": 3,
                "required": false
            }
        ]
    }
    // {
    //     "name": "Bookmark",
    //     "type": 3
    // }
]

// axios.delete('https://httpbin.org/delete')

/**
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
    const message = request.body;

    if (process.env.TOKEN == request.query.auth) {

        const config = {
            headers: {
                Authorization: 'Bot '+process.env.TOKEN,
            }
        };

        var existing_commands = []

        await axios('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', config)
        .then( async (response) => {
            existing_commands = response.data
        }).catch( async (error) => {
            response.status(500).send({ error: error });
            return
        })

        // console.log(existing_commands)
        // response.status(200).send({ response: api })

        // put logic for handling existing commands here
        // make sure to delete commands that exist on discord but not here
        // make an api request for each new command after delete unused legacy ones

        var old_commands = await find_old_commands(commands, existing_commands)
        console.log(old_commands)
        if (old_commands.length != 0) {
            // only run if there are any old commands
            old_commands.forEach( async (command) => {
                // console.log("\"running code\"....  axios.delete('https://discord.com/api/v10/applications/958956806875529246/commands/"+command.id+"')")
                console.log('deleting ', command.id)
                await axios.delete('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands/'+command.id, config)
            })
        }
        console.log('done deleting old cmds')
        commands.forEach( async (command) => {
            console.log(`creating ${command.name}`)
            axios.post('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', command, config)
            .then( async (response) => {
                console.log(`created ${command.name}`)
                console.log(response.data)
            }).catch( async (error) => {
                console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
                console.log(error)
            })
        })
        console.log('done creating cmds')

        response.status(200).send({ request: 'done'})
        return
    } else if (request.query.auth == undefined || request.query.auth == null) {
        response.status(401).send({ error: "auth was found but was invalid :<" }); 
        return
    } else { response.status(401).send({ error: "no auth found! ?auth=xxxxx" }); return }

}