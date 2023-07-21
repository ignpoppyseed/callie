const axios = require("axios");
const fs = require('fs'); 

// fs.open('commands.json', 'r', function (err, f) {
//     console.log(f.read())
//     commands = f
// });

var commands

fs.readFile('commands.json', 'utf8', (err, f) => {
    if (err) {
        console.error(err);
        return;
    }
    commands = JSON.parse(f)
});

function find_index_by_name(input_name, dictionary_list) {
    for (let i = 0; i < dictionary_list.length; i++) {
        if (dictionary_list[i].name === input_name) {
            return i;
        }
    }
    return null;
}

// function check_array_equivalence(arr1, arr2) {
//     if (arr1 == undefined && arr2 == undefined) { return true; } else if (arr1 == undefined || arr2 == undefined) { return false; }
    
//     if (arr1.length !== arr2.length) {
//         return false;
//     }
//     for (let i = 0; i < arr1.length; i++) {
//         if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
//         return false;
//         }
//     }
//     return true;
// }

function check_array_equivalence(list1, list2) {
    if (list1 == undefined && list2 == undefined) { return true; } else if (list1 == undefined || list2 == undefined) { return false; }
    if (list1.length !== list2.length) {
        return false;
    }

    // Helper function to check if two objects are equal
    function areObjectsEqual(obj1, obj2) {
        return obj1.name === obj2.name && obj1.value === obj2.value;
    }

    // Sort the lists by name to ensure elements are in the same order
    const sortedList1 = list1.slice().sort((a, b) => a.name.localeCompare(b.name));
    const sortedList2 = list2.slice().sort((a, b) => a.name.localeCompare(b.name));

    // Compare the sorted lists element by element
    for (let i = 0; i < sortedList1.length; i++) {
        if (!areObjectsEqual(sortedList1[i], sortedList2[i])) {
            return false;
        }
    }

    return true;
}

function find_old_commands(local_commands, discord_commands) {
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

/**
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
    // this block only runs after the token has been verified and if the request is POST (temp changed to GET for debugging)
    if (process.env.TOKEN == request.query.auth && request.method == 'GET') {
    // concatenates the request protocol and url to create a url in the format of "http://localhost"
    var request_url
    if (request.headers['cf-visitor'] == undefined) { 
        request_url = 'http://'+request.headers.host
    } else {
        request_url = JSON.parse(request.headers['cf-visitor']).scheme+'://'+request.headers.host
    }
    // const message = request.body;

    const config = {
        headers: {
            Authorization: 'Bot '+process.env.TOKEN,
        }
    };

    // checks commands discord currently has on file, stores result as a list in existing_commands
    var existing_commands = []
    await axios('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', config)
    .then( async (response) => {
        existing_commands = response.data
    }).catch( async (error) => {
        response.status(500).send({ error: error });
        return
    })

    //////// THIS ISNT DONE DONT DEPLOY
    //////// NEEDS TO CHECK new cmds agains existing in discord
    //////// if type name and option match remove from list
    //////// then run create loop

    //
    // 
    //
    
    // console.log()
    // console.log(existing_commands[find_index_by_name("blahaj", existing_commands)])
    
    var commands_to_register = []

    for (const command of commands) {
        // console.log(existing_commands[find_index_by_name(command.name, existing_commands)])
        var existing_command_index = find_index_by_name(command.name, existing_commands)
        if (existing_command_index == null) {
            // console.log(command.name, 'does not exist!')
            // COMMAND NEEDS TO BE REGISTERED
            commands_to_register.push(command)
            console.log(command.name, 'NEEDS TO BE REGISTERED (doesnt exist)')
        } else {
            // console.log(command.name, 'exists!')
            var ecommand = existing_commands[existing_command_index]
            if (ecommand.options == command.options) {
                // does not have options
                // console.log(false)
                if (ecommand.name != command.name || ecommand.description != command.description) {
                // COMMAND NEEDS TO BE REGISTERED
                commands_to_register.push(command)
                console.log(command.name, 'NEEDS TO BE REGISTERED (local has no opts, fails on cmd name or desc)')
                }
            } else {
                // now check if all options match
                for (let i = 0; i < command.options.length; i++) {
                    if (!check_array_equivalence(ecommand.options[i].choices, command.options[i].choices)) {
                        commands_to_register.push(command)
                        console.log(command.name, 'NEEDS TO BE REGISTERED (choices dont match)')
                        console.log(JSON.stringify(ecommand.options[i].choices) + ' vs ' + JSON.stringify(command.options[i].choices)) 
                    } else if (ecommand.options[i].name != command.options[i].name) {
                        commands_to_register.push(command)
                        console.log(command.name, 'NEEDS TO BE REGISTERED (name doesnt match)')
                        console.log(ecommand.options[i].name + ' vs ' + command.options[i].name)
                    } else if (ecommand.options[i].description != command.options[i].description) {
                        commands_to_register.push(command)
                        console.log(command.name, 'NEEDS TO BE REGISTERED (opt description doesnt match)')
                        console.log(ecommand.options[i].description + ' vs ' + command.options[i].description)
                    } else if (ecommand.options[i].type != command.options[i].type) {
                        commands_to_register.push(command)
                        console.log(command.name, 'NEEDS TO BE REGISTERED (type doesnt match)')
                        console.log(ecommand.options[i].type + ' vs ' + command.options[i].type)
                    } else if (ecommand.options[i].required == undefined && command.options[i].required != false) {
                        commands_to_register.push(command)
                        console.log(command.name, 'NEEDS TO BE REGISTERED (required doesnt match)')
                        console.log(ecommand.options[i].required + ' vs ' + command.options[i].required)
                    }
                    // if (!check_array_equivalence(ecommand.options[i].choices, JSON.stringify(command.options[i].choices)) || 
                    // ecommand.options[i].name != command.options[i].name || 
                    // ecommand.options[i].description != command.options[i].description ||
                    // ecommand.options[i].type != command.options[i].type ||
                    // ecommand.options[i].required == undefined && command.options[i].required != false) {
                    //     // COMMAND NEEDS TO BE REGISTERED
                    //     commands_to_register.push(command)
                    //     console.log(command.name, 'NEEDS TO BE REGISTERED (opt attributes dont match)')
                        
                    //     console.log(`BEGIN ${command.name} ATTRIBUTES`)
                    //     // console.log(JSON.stringify(ecommand.options[i].choices) + ' vs ' + JSON.stringify(command.options[i].choices)) 
                    //     console.log(ecommand.options[i].name + ' vs ' + command.options[i].name)
                    //     console.log(ecommand.options[i].description + ' vs ' + command.options[i].description)
                    //     console.log(ecommand.options[i].type + ' vs ' + command.options[i].type)
                    //     console.log(ecommand.options[i].required + ' vs ' + command.options[i].required)
                    //     console.log(ecommand.options[i].choices)
                    //     console.log(command.options[i].choices)
                    //     console.log(`END ${command.name} ATTRIBUTES`)
                    // }
                }
            }
        }
    }

    var old_commands = find_old_commands(commands, existing_commands)
    console.log(old_commands)
    if (old_commands.length != 0) {
        // only run if there are any old commands
        old_commands.forEach( async (command) => {
            console.log('deleting', command.name)
            await axios.delete('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands/'+command.id, config)
        })
    } else {
        console.log('no cmds deleted')
    }
    console.log('done deleting old cmds')

    //
    // 
    // 

    // console.log(commands_to_register.length)

    if (commands_to_register === undefined || commands_to_register.length === 0) {
        response.status(200).send({ status: 'nothing to sync', response: 'none' }); 
        return
    } else {
        await axios.post(request_url+'/api/create?auth='+process.env.TOKEN, commands_to_register, {headers: { Authorization: 'Bot '+process.env.TOKEN }})
        .then( async (d_raw_response) => {
            response.status(200).send({ status: "done", response: d_raw_response.data }); 
        }).catch( async (error) => {
            response.status(500).send({ status: "failed", response: error }); 
        })
        // response.status(200).send({ status: "done", response: 'wda' })
        return
    }

    // await axios.post(request_url+'/api/create?auth='+process.env.TOKEN, commands_to_register, {headers: { Authorization: 'Bot '+process.env.TOKEN }})
    // .then( async (d_raw_response) => {
    //     response.status(200).send({ status: "done", response: d_raw_response.data }); 
    // }).catch( async (error) => {
    //     response.status(500).send({ status: "failed", response: error }); 
    // })
    // response.status(200).send({ status: "done", response: 'awd' }); 
    } else if (process.env.TOKEN != request.query.auth && request.query.auth != undefined && request.query.auth != null) {
        response.status(401).send({ status: "failed", error: "auth was found but was invalid :<" }); 
        return
    } else if (request.query.auth == undefined || request.query.auth == null) {
        response.status(401).send({ status: "failed", error: "no auth found! ?auth=xxxxx" })
        return
    } else if (request.method != 'POST') {
        response.status(405).send({ status: "failed", error: "this endpoint only accepts POST :<" }); 
        return
    }

}