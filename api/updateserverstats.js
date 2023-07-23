const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_server_count() {
    var count
    await axios('https://discord.com/api/v10/users/@me/guilds', {headers: { Authorization: 'Bot '+process.env.TOKEN }})
    .then( async (d_raw_response) => {
        if (Array.isArray(d_raw_response.data)) {
            count = d_raw_response.data.length
        } else {
            count = undefined
        }
    }).catch( async (error) => {
        console.log(error)
        count = undefined
    })
    return count
}

/**
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
    // const message = request.body;
    if (process.env.FAKEOUT_TOKEN == request.query.auth && request.method == 'GET') {

        var guild_count = await get_server_count()

        if (guild_count == undefined) {
            response.status(201).send({ status: "done", error: stats }); 
            return
        } 

        var errors = []
        var discord_response

        await axios.post(`https://discord.bots.gg/api/v1/bots/${process.env.APPLICATION_ID}/stats`, {"guildCount": guild_count}, {headers: { Authorization: process.env.DISCORD_BOTS_GG_API }})
        .then( async (d_raw_response) => {
            console.log(`done`)
            discord_response = d_raw_response.data
            console.log(discord_response)
            errors.push({name: '', error: false, status: 'success', response: discord_response, axios_error: '', request_type: 'single'})
        }).catch( async (error) => {
            console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
            console.log(error)
            errors.push({name: '', error: true, status: 'failed', response: discord_response, axios_error: error, request_type: 'single'})
        })

        await axios.post(`https://top.gg/api/bots/${process.env.APPLICATION_ID}/stats`, {server_count: guild_count}, {headers: { Authorization: process.env.TOP_GG_API }})
        .then( async (d_raw_response) => {
            console.log(`done`)
            discord_response = d_raw_response.data
            console.log(discord_response)
            errors.push({name: '', error: false, status: 'success', response: discord_response, axios_error: '', request_type: 'single'})
        }).catch( async (error) => {
            console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
            console.log(error)
            errors.push({name: '', error: true, status: 'failed', response: discord_response, axios_error: error, request_type: 'single'})
        })
        response.status(201).send({ status: "done", error: errors }); 
        // response.status(201).send({ status: "done", error: stats }); 

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