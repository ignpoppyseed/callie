const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
    // const message = request.body;
    if (process.env.TOKEN == request.query.auth && request.method == 'POST') {

        var command = request.body
        // var threw_error = false
        var discord_response = {}
        var gerror = ''
        var errors = []

        // var cmd = {}

        if (Array.isArray(command)) {
            // handle array (use loop) (cmd is dict)
            for (let i = 0; i < command.length; i++) {
                // console.log(command[i].name)
                console.log(`creating ${command[i].name}`)
                await axios.post('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', command[i], {headers: { Authorization: 'Bot '+process.env.TOKEN }})
                .then( async (d_raw_response) => {
                    console.log(`created ${command[i].name}`)
                    discord_response = d_raw_response.data
                    console.log(discord_response)
                    errors.push({name: command[i].name, error: false, status: 'success', discord_response: discord_response, axios_error: '', request_type: 'list'})
                }).catch( async (error) => {
                    console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
                    errors.push({name: command[i].name, error: true, status: 'failed', discord_response: discord_response, axios_error: error, request_type: 'list'})
                })
                await sleep(500);
                // if (threw_error) {
                    //     response.status(500).send({ request: 'done', error: gerror})
                    // } else {
                        //     response.status(201).send({ request: 'done', raw_command: command, discord_response: discord_response})
                        // }
            } 
            response.status(201).send({ status: "done", error: errors }); 
        } else if (typeof command === 'object' && command !== null) {
            // handle single command (cmd is list)
            console.log(`creating ${command.name}`)
            await axios.post('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', command, {headers: { Authorization: 'Bot '+process.env.TOKEN }})
            .then( async (d_raw_response) => {
                console.log(`created ${command.name}`)
                discord_response = d_raw_response.data
                console.log(discord_response)
                errors.push({name: command.name, error: false, status: 'success', discord_response: discord_response, axios_error: '', request_type: 'single'})
            }).catch( async (error) => {
                console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
                errors.push({name: command.name, error: true, status: 'failed', discord_response: discord_response, axios_error: error, request_type: 'single'})
            })
            response.status(201).send({ status: "done", error: errors }); 
        } else {
            response.status(400).send({ status: "failed", error: "request body must be cmd or list of cmds" }); 
            return
        }

        // console.log(`creating ${command.name}`)
        // await axios.post('https://discord.com/api/v10/applications/'+ process.env.APPLICATION_ID +'/commands', command, {headers: { Authorization: 'Bot '+process.env.TOKEN }})
        // .then( async (response) => {
        //     console.log(`created ${command.name}`)
        //     console.log(response.data)
        //     discord_response = response.data
        //     threw_error = false
        // }).catch( async (error) => {
        //     console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
        //     gerror = error
        //     threw_error = true
        // })
        // if (threw_error) {
        //     response.status(500).send({ request: 'done', error: gerror})
        // } else {
        //     response.status(201).send({ request: 'done', raw_command: command, discord_response: discord_response})
        // }
        return
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