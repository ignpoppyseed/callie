const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = require("discord-interactions");
const getRawBody = require("raw-body");
const axios = require("axios");
  
const invite_url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&permissions=8&scope=bot%20applications.commands`;
const poppy_id = 402569003903483904
const callie_color = parseInt('#202225'.replace('#', ''), 16)
const callie_footer_img = 'https://cdn.discordapp.com/attachments/1128934435211976865/1128939260284772362/icon.gif'
const footer = {
    "footer": {
        "text": "callie <3",
        "icon_url": callie_footer_img
    },
    "timestamp": `${new Date().toISOString()}`
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

/**
* i miss you callie
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
  if (request.method === "POST") {
    const signature = request.headers["x-signature-ed25519"];
    const timestamp = request.headers["x-signature-timestamp"];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
        rawBody,
        signature,
        timestamp,
        process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
        console.error("Invalid Request");
        return response.status(401).send({ error: "Bad request signature " });
    }

    const message = request.body;

    if (message.type === InteractionType.PING) {
        console.log("Handling Ping request");
        response.send({
            type: InteractionResponseType.PONG,
        });
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      // Handle our Slash Commands
      // switch (message.data.name.toLowerCase()) {
      //   case SLAP_COMMAND.name.toLowerCase():
      //     response.status(200).send({
      //       type: 4,
      //       data: {
      //         content: "Hello!",
      //       },
      //     });
      //     console.log("Slap Request");
      //     break;
      //   case INVITE_COMMAND.name.toLowerCase():
      //     response.status(200).send({
      //       type: 4,
      //       data: {
      //         content: INVITE_URL,
      //         flags: 64,
      //       },
      //     });
      //     console.log("Invite request");
      //     break;
      //   default:
      //     response.status(200).send({
      //         type: 4,
      //         data: {
      //           content: INVITE_URL,
      //           flags: 64,
      //         },
      //       });
      //     break;
      // }
      switch (message.data.name.toLowerCase()) {
            case 'help':
                console.log('help')
                response.status(200).send({
                    type: 4,
                    // data: {
                    //     "content": "cuntent",
                    //     "embeds": [
                    //       {
                    //         "title": "title",
                    //         "description": "desc",
                    //         "color": 5814783,
                    //         "fields": [
                    //           {
                    //             "name": "f1",
                    //             "value": "fv"
                    //           }
                    //         ],
                    //         "author": {
                    //           "name": "auth"
                    //         },
                    //         "footer": {
                    //           "text": "foot"
                    //         }
                    //       }
                    //     ],
                    //     "attachments": []
                    // }
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": "***callie's help menu <3***",
                                "color": callie_color,
                                "fields": [
                                {
                                    "name": "callie",
                                    "value": "- </help:1128959988426096721>\n- </credits:1128959988329615441>\n- </invite:1128959988296069170>",
                                    "inline": true
                                },
                                {
                                    "name": "fun",
                                    "value": "- </moomin:1128959988530950164>\n- </blahaj:1129230593574572032>\n- </cat-fact:1129319466153562164>",
                                    "inline": true
                                },
                                {
                                    "name": "utilities",
                                    "value": "- </avatar:1128960380497055764>\n- </flip:1129319420305604618>\n- </mc-skin:1129319301866868838>",
                                    "inline": true
                                }
                                ],
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`,
                                "image": {
                                "url": "https://cdn.discordapp.com/attachments/1128934435211976865/1128934865224605838/banner.png"
                                }
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'credits':
                console.log('credits')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": "***credits for callie <3***\ncreated by [poppy](https://emmaline.app)\nwith the help of [littlemercury](https://www.youtube.com/@littlemercury4463)",
                                "color": callie_color,
                                // "fields": [
                                // {
                                //     "name": "all cmds",
                                //     "value": "- </moomin:1128779998799605882>\n- </help:1128764103851249727>\n- </uwu:1128767765239570562>",
                                //     "inline": true
                                // }
                                // ],
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`,
                                // "image": {
                                // "url": "https://cdn.discordapp.com/attachments/1128934435211976865/1128934865224605838/banner.png"
                                // }
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'invite':
                console.log('invite')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***invite callie here <3***\n[invite](${invite_url})`,
                                "color": callie_color,
                                // "fields": [
                                // {
                                //     "name": "all cmds",
                                //     "value": "- </moomin:1128779998799605882>\n- </help:1128764103851249727>\n- </uwu:1128767765239570562>",
                                //     "inline": true
                                // }
                                // ],
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`,
                                // "image": {
                                // "url": "https://cdn.discordapp.com/attachments/1128934435211976865/1128934865224605838/banner.png"
                                // }
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'moomin':
                console.log('moomin')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                        {
                            "color": callie_color,
                            "image": {
                            "url": "https://cdn.discordapp.com/attachments/951027740256137229/1128776600905842729/mu1.png"
                            }
                        }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'uwu':
                console.log('uwu')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***uwu***`,
                                "color": callie_color,
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`,
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'avatar':
                console.log('avatar')

                var resolved = message.data.resolved
                if (resolved == undefined) {
                    var user = message.member.user
                } else {
                    var user = resolved.users
                    user = Object.values(user)[0]
                }

                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                        {
                            // "description": `${user.username}'s avatar <3\n\`\`\`${JSON.stringify(message)}\`\`\`\n<3\n\`\`\`${JSON.stringify(resolved)}\`\`\`\n<3\n\`\`\`${JSON.stringify(user)}\`\`\``,
                            "description": `***${user.username}'s avatar <3***`,
                            "color": callie_color,
                            "image": {
                                "url": `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`
                            },
                            "footer": {
                                "text": "callie <3",
                                "icon_url": callie_footer_img
                            },
                            "timestamp": `${new Date().toISOString()}`,
                        }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'blahaj':
                console.log('blahaj')
                await axios('https://blahaj.transgirl.dev/images/random')
                .then( async (blahaj_raw_response) => {
                    var blahaj_data = blahaj_raw_response.data
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***blahaj <3***\nimage credit: [${blahaj_data.author}](https://www.reddit.com/${blahaj_data.author})`,
                                    "color": callie_color,
                                    "image": {
                                        "url": blahaj_data.url
                                    },
                                    "footer": {
                                        "text": "callie <3",
                                        "icon_url": callie_footer_img
                                    },
                                    "timestamp": `${new Date().toISOString()}`,
                                }
                            ],
                            "attachments": []
                        }
                    });
                }).catch( async (error) => {
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***there was an issue getting a blahaj </3***\nerror:\`\`\`${error}\`\`\``,
                                    "color": callie_color,
                                    "footer": {
                                        "text": "callie <3",
                                        "icon_url": callie_footer_img
                                    },
                                    "timestamp": `${new Date().toISOString()}`,
                                }
                            ],
                            "attachments": []
                        }
                    });
                })
                break;
            case 'cat-fact':
                console.log('cat-fact')
                await axios('https://catfact.ninja/fact')
                .then( async (catfact_raw_response) => {
                    var cat_data = catfact_raw_response.data
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***random cat fact <3***\n${cat_data.fact}`,
                                    "color": callie_color,
                                    "footer": {
                                        "text": "callie <3",
                                        "icon_url": callie_footer_img
                                    },
                                    "timestamp": `${new Date().toISOString()}`
                                }
                            ],
                            "attachments": []
                        }
                    });
                }).catch( async (error) => {
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***there was an issue getting cat fact </3***\nerror:\`\`\`${error}\`\`\``,
                                    "color": callie_color,
                                    "footer": {
                                        "text": "callie <3",
                                        "icon_url": callie_footer_img
                                    },
                                    "timestamp": `${new Date().toISOString()}`,
                                }
                            ],
                            "attachments": []
                        }
                    });
                })
                break;
            case 'flip':
                console.log('flip')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***coin flip <3***\nresult: **${['heads', 'tails'].random()}** 🪙`,// the thing on the end is a coin, for some reason its not rendering :<
                                "color": callie_color,
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            case 'mc-skin':
                console.log('mc-skin')
                console.log(message.data)
                var username = message.data.options[0].value
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***${username}'s minecraft skin <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": `https://minotar.net/skin/${username}.png`
                                },
                                "footer": {
                                    "text": "callie <3",
                                    "icon_url": callie_footer_img
                                },
                                "timestamp": `${new Date().toISOString()}`
                            }
                        ],
                        "attachments": []
                    }
                });
                break;
            default:
                console.log('default')
                response.status(200).send({
                    type: 4,
                    data: {
                        content: "<3\ncmd invoked: `"+message.data.name.toLowerCase()
                    }
                });
                break;
      }
    } else {
        console.error("no command");
        response.status(400).send({ error: "command not found" });
    }
  }
};