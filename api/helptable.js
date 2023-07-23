const path = require("path");
const fs = require('fs'); 

const public_dir = path.join(process.cwd(), 'public');
const commands = JSON.parse(fs.readFileSync(public_dir + '/commands.json', 'utf8'));

const inaccessible_cmds = ['uwu', 'debug']

/**
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {

    var return_table = `<table><tr><th>command <3</th><th>description <3</th><th>arguments <3</th></tr>\n`

    // `<table>
    //     <tr>
    //         <td><code>/help</code></td>
    //         <td>help menu <3</td>
    //         <td>none <3></td>
    //     </tr>
    // </table>`

    for (const command of commands) {
        if (!inaccessible_cmds.includes(command.name)) {

        var args

        if (command.options == undefined) { args = 'none'} else {
            args = command.options.map((item) => item.name).join(', ');
        }

        return_table += `<tr><td><code>/${command.name}</code></td><td>${command.description.replace(new RegExp(' <3' + '$'), '')}</td><td>${args}</td></tr>\n`
        }
    }

    response.status(200).send(return_table+`</table>`); 
    return
}