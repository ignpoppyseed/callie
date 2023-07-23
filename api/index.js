const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = require("discord-interactions");
const getRawBody = require("raw-body");
const axios = require("axios");

axios.defaults.headers.common['Authorization'] = 'Bot '+process.env.TOKEN;
  
const invite_url = `https://canary.discord.com/api/oauth2/authorize?client_id=953858283893035019&permissions=1222656781543&scope=bot%20applications.commands`;
const poppy_id = 402569003903483904
const callie_color = parseInt('#202225'.replace('#', ''), 16)
const callie_footer_img = 'https://cdn.discordapp.com/attachments/1128934435211976865/1128939260284772362/icon.gif'
const discord_api_root_url = 'https://discord.com/api/v10'
const axois_config = { headers: { Authorization: 'Bot '+process.env.TOKEN, }};

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function convert_options(list) {
    return list.reduce((result, item) => {
        result[item.name] = item.value;
        return result;
    }, {});
}

async function add_reaction(channel_id, message_id, emoji) {
    // /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
    await axios.put(discord_api_root_url+`/channels/${channel_id}/messages/${message_id}/reactions/${encodeURIComponent(emoji)}/@me`, axois_config)
    return 200
}

async function get_original_interaction_response(interaction_token) {
    var func_response
    await axios(`https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${interaction_token}/messages/@original`, axois_config)
    .then( async (axios_response) => {
        func_response = axios_response
    }).catch( async (error) => {
        func_response = error
    })
    return func_response
}

async function send_followup(interaction_token) {

    var followup_content = {
        type: 4,
        data: {
            content: "<3"//+message.data.name.toLowerCase()
        }
    }

    axios.post(discord_api_root_url+`/webhooks/${process.env.APPLICATION_ID}/${interaction_token}`, followup_content, axois_config)
    .then( async (response) => {
        console.log(response.data)
    }).catch( async (error) => {
        console.log('THREW ERROR, POPPY NEEDS TO LOOK INTO THIS')
        console.log(error)
    })
    return
}

async function SRA(endpoint, args={}) {
    var parsed_args = convert_dict_to_query(args)
    var sra_response
    await axios('https://some-random-api.com/'+endpoint+'?'+parsed_args)
    .then( async (raw_res) => {
        sra_response = raw_res.data
    }).catch( async (error) => {
        sra_response = error
    })
    return sra_response
}

async function SRA_canvas(endpoint, args={}) {
    var parsed_args = convert_dict_to_query(args)
    var sra_response = {}
    var request_url = 'https://some-random-api.com/canvas/'+endpoint+'?'+parsed_args
    await axios(request_url, {timeout: 1000})
    .then( async (raw_res) => {
        var data = raw_res.data
        // console.log(data)
        if (typeof data === "string") {
            sra_response['image'] = request_url
        } else {
            sra_response = data
            // console.log(data)
        }
    }).catch( async (error) => {
        if (error.code === 'ECONNABORTED') {
            sra_response = {'error': 'request timed out. are your supplied URLs valid?'}
        } else {
            sra_response = error.response.data
        }
        // console.log(sra_response)
    })
    return sra_response
    // return 'https://some-random-api.com/canvas/'+endpoint+'?'+parsed_args
}

function convert_dict_to_query(dictionary) {
    if (typeof dictionary !== 'object' || dictionary === null) { throw new Error('input is not dict'); }
    const key_values = [];
    for (const [key, value] of Object.entries(dictionary)) {
        const encoded_key = encodeURIComponent(key);
        const encoded_value = encodeURIComponent(value);
        key_values.push(`${encoded_key}=${encoded_value}`);
    }
    return key_values.join('&');
}

// async function UWU() {
//     const response = await axios(discord_api_root_url+`/webhooks/${process.env.APPLICATION_ID}/aW50ZXJhY3Rpb246MTEzMTU5NzM5NjY4MjQ4MTY5OTpydVN5VUdiWlpQSHpuN2dzWEdsekphSG00WGlEQUU4YjZWZDZ5UmU3clNHbHkxTmU1UVFuR1ZiWUpRQmNKa3JEaHFJNkt5QWFhbHdraEVEYzFjMjBhT3RKNTBiR1NPQTJEQjZEeTJWMk5ZS213V0VMQ1diNWU3VFBPR1B4TzhzQw/messages/@original`, axois_config)
//     interaction_response = response.data
//     return interaction_response
// }

// async function get_original_interaction_response(interaction_token) {
//     console.log('1')
//     // /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me
//     var interaction_response = {}
//     console.log('2')
//     await axios(discord_api_root_url+`/webhooks/${process.env.APPLICATION_ID}/${interaction_token}/messages/@original`, axois_config)
//     .then( async (response) => {
//         interaction_response = response.data
//         console.log('3')
//         return 'uwu'
//     }).catch( async (error) => {
//         console.log(error)
//         return 'owo'
//     })
//     console.log('4')
//     console.log(interaction_response)
//     return interaction_response
// }

/**
* i miss you callie
* @param {VercelRequest} request
* @param {VercelResponse} response
*/
module.exports = async (request, response) => {
  if (request.method === "POST") {
    const signature = request.headers["x-signature-ed25519"];
    const timestamp = request.headers["x-signature-timestamp"];
    const rawBody = JSON.stringify(request.body);

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

    // console.log(message)

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
                                    "name": "fun",
                                    // "value": "- </moomin:1128959988530950164>\n- </blahaj:1129230593574572032>\n- </cat-fact:1129319466153562164>\n- </achievement:1132025550769229934>",
                                    "value": "- </blahaj:1129230593574572032>\n- </cat-fact:1129319466153562164>\n- </achievement:1132025550769229934>\n- </tweet:1132183230829822043>",
                                    "inline": true
                                },
                                {
                                    "name": "utilities",
                                    "value": "- </avatar:1128960380497055764>\n- </flip:1129319420305604618>\n- </mc-skin:1129319301866868838>\n- </qr:1132577391139618907>",
                                    "inline": true
                                },
                                {
                                    "name": "animals",
                                    "value": "- </cat:1132025538341515485>\n- </dog:1132025541130735738>\n- </raccoon:1132025544561668236>\n- </panda:1132025547778703432>",
                                    "inline": true
                                },
                                {
                                    "name": "callie",
                                    "value": "- </help:1128959988426096721>\n- </credits:1128959988329615441>\n- </invite:1128959988296069170>\n- </website:1132579034908336148>",
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
            case 'website':
                console.log('website')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***visit callie's website here <3***\nhttps://callie.rest/`,
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

                var avatar_url

                var resolved = message.data.resolved
                if (resolved == undefined) {
                    var user = message.member.user
                } else {
                    var user = resolved.users
                    user = Object.values(user)[0]
                }

                if (user.avatar == null) {
                    avatar_url = `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator)%5}.png`
                } else {
                    avatar_url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`
                }

                // console.log(user)

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
                                "url": avatar_url
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
            case 'achievement':
                console.log('achievement')
                console.log(message.data)

                var text = message.data.options[0].value
                var block = message.data.options[1].value
                var achievementget 
                if (message.data.options[2] == undefined) { achievementget = 'Achievement Get!' } else { achievementget = message.data.options[2].value }

                var image_url = `https://skinmc.net/en/achievement/${block}/${encodeURIComponent(achievementget)}/${encodeURIComponent(text)}`
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***achievement get! <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": image_url
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
            case 'cat':
                console.log('cat')
                var somedata = await SRA('animal/cat')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***kitty! <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": somedata.image
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
            case 'raccoon':
                console.log('raccoon')
                var somedata = await SRA('animal/raccoon')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***raccoon! <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": somedata.image
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
            case 'dog':
                console.log('dog')
                var somedata = await SRA('animal/dog')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***doggy! <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": somedata.image
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
            case 'panda':
                console.log('panda')
                var somedata = await SRA('animal/panda')
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***pamda bear! <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": somedata.image
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
            case 'tweet':
                console.log('tweet')
                var options = convert_options(message.data.options)
                console.log(options)
                // var username = options.username
                
                // displayname - required
                // username - required
                // comment - required
                // avatar - optional
                // replies - optional
                // retweets - optional
                // theme - optional
                // console.log(avatar = message.data.options[3].value)
                var avatar
                if (options.avatar == undefined) { avatar = `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png?size=1024` } else { 
                    avatar = options.avatar
                    if (avatar.endsWith('.png') || avatar.endsWith('.jpg') || avatar.endsWith('.gif')) { } else {
                        response.status(200).send({
                            type: 4,
                            data: {
                                "content": null,
                                "embeds": [
                                    {
                                        "description": `***seems like the image you provided was invalid </3***`,
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
                        return
                    }
                    if (!avatar.startsWith('https://') && !avatar.startsWith('https://')) {
                        avatar = 'https://'+avatar
                    }
                }
                var replies
                if (options.replies == undefined) { replies = get_random_int(10, 754).toString() } else { replies = options.replies }
                var retweets
                if (options.retweets == undefined) { retweets = get_random_int(10, 754).toString() } else { retweets = options.retweets }
                var likes
                if (options.likes == undefined) { likes = get_random_int(10, 754).toString() } else { likes = options.likes }
                var theme
                if (options.theme == undefined) { theme = `dark` } else { theme = options.theme }

                // var somedata = await SRA_canvas('misc/tweet', {
                //     displayname: message.data.options[0].value,
                //     username: message.data.options[1].value,
                //     comment: message.data.options[2].value,
                //     avatar: avatar,
                //     replies: replies,
                //     retweets: retweets,
                //     theme: theme
                // })
                var somedata = await SRA_canvas('misc/tweet', {
                    displayname: options.displayname,
                    username: options.username,
                    comment: options.content,
                    avatar: avatar,
                    replies: replies,
                    retweets: retweets,
                    likes: likes,
                    theme: theme
                })
                // console.log(somedata)
                // return
                if (somedata.image != undefined) {
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***woah!! a hit tweet!! <3***`,
                                    "color": callie_color,
                                    "image": {
                                        "url": somedata.image
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
                } else {
                    response.status(200).send({
                        type: 4,
                        data: {
                            "content": null,
                            "embeds": [
                                {
                                    "description": `***something went wrong while generating the tweet </3***\nerror:\`\`\`${somedata.error}\`\`\``,
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
                }
                break;
            case 'qr':
                console.log('qr')
                var options = convert_options(message.data.options)
                console.log(options)
                var qr_size
                if (options.size == undefined) { qr_size = '512x512' } else { qr_size = options.size }
                response.status(200).send({
                    type: 4,
                    data: {
                        "content": null,
                        "embeds": [
                            {
                                "description": `***generated qr code <3***`,
                                "color": callie_color,
                                "image": {
                                    "url": `https://chart.googleapis.com/chart?chs=${encodeURIComponent(qr_size)}&cht=qr&chl=${encodeURIComponent(options.url)}`
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
            // case 'poll':
                // console.log('poll')
                // console.log(message.data)
                // var raw_poll_question = message.data.options[0].value
                // var raw_poll_options = message.data.options[1].value

                // var desc = `***poll!!! <3***\n**${raw_poll_question}**\n`

                // var poll_options = raw_poll_options.split(', ')
                // // console.log(poll_options)
                // if (poll_options.length == 1) {
                //     poll_options = ""+raw_poll_options.split(',')
                // }

                // var options_length = poll_options.length
                // if (poll_options.length > 8) { options_length = 8 } 

                // for (let i = 0; i < options_length; i++) {
                //     desc += (i+1).toString()+'. '+poll_options[i]+'\n'
                // }

                // // response.status(200).send({
                // //     type: 4,
                // //     data: {
                // //         "content": null,
                // //         "embeds": [
                // //             {
                // //                 "description": desc,
                // //                 "color": callie_color,
                // //                 "footer": {
                // //                     "text": "callie <3",
                // //                     "icon_url": callie_footer_img
                // //                 },
                // //                 "timestamp": `${new Date().toISOString()}`
                // //             }
                // //         ],
                // //         "reactions": [
                // //             {
                // //                 "emoji": "U+1F44D",
                // //                 "count": 1
                // //             }
                // //         ],
                // //         "attachments": []
                // //     }
                // // });
                // // await add_reaction(message.channel.id, )
                // // console.log(response)

                // console.log(message.token)
                // console.log(typeof message.token)
                // // console.log(await get_original_interaction_response(message.token))

                // // console.log(await get_original_interaction_response(message.token))
                // // console.log(await UWU())
                // // await add_reaction(message.channel.id, await get_original_interaction_response(message.token).id, '✨')
                // // console.log('uwu')
                // // await send_followup(message.token)
                // // const aaaaaaaaaaaa = await axios(discord_api_root_url+`/webhooks/${process.env.APPLICATION_ID}/${message.token}/messages/@original`, axois_config)
                // // interaction_response = aaaaaaaaaaaa.data
                // // console.log('3')
                // // return 'uwu'
                // // console.log('returned')
                // // await axios(discord_api_root_url+`/webhooks/${process.env.APPLICATION_ID}/${message.token}/messages/@original`, axois_config)
                // var followup_content = {
                //     type: 4,
                //     data: {
                //         content: "<   3"//+message.data.name.toLowerCase()
                //     }
                // }
                // // console.log(await axios.post(discord_api_root_url+`/interactions/${message.id}/${message.token}/callback`, followup_content, axois_config).status)
                // console.log(await axios.post(discord_api_root_url+`/interactions/${message.id}/${message.token}/callback`, followup_content))//, axois_config).status)
                // console.log('uwu')
                // // var rahhh = await axios(`https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}/messages/@original`)//, axois_config)
                // // var rahhh = await axios(`https://discord.com/api/v10/webhooks/958956806875529246/aW50ZXJhY3Rpb246MTEzMTYzNjM5NzA5NTI1NjE2NDpGd3RhMDJ3cWE4ckZxOUNLZnpxU29CeHJRNjI3VGVMOXEyd1VFOVRyY0JQWTh2WkVvSTM4WHNoVHpuVDJnOHNPOFRrZTVqRFVqR2xmeE5lRk0wZVRyZmxzT3JCMzVxejhkWXdUNWhudmFlcUZCUW9zQ2YxbkNlYmltVjFFdnA5MQ/messages/@original`, axois_config)
                // // console.log(rahhh)
                // var url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}/messages/@original`
                // // var url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/aW50ZXJhY3Rpb246MTEzMTY0MDk1MDEwNDUzMDk2NTpWenV1Y2FDQmdEVDROSmRNMDdtTjdKZXpyQkgwc3Y4dWU4NGFTQ01GQlFxbFBWWjZabmczUEZodnJwNEVNekh0THRHd2JtZ3BQaEFzWHFtZVZuY1BsRUlVRVd2emloU2J4NldSM2M2bXNyQ1BQdnNFWnJqTE1OS25jZm53WVR6bg/messages/@original`
                // // var url = `https://discord.com/api/v10/webhooks/958956806875529246/aW50ZXJhY3Rpb246MTEzMTYzNjM5NzA5NTI1NjE2NDpGd3RhMDJ3cWE4ckZxOUNLZnpxU29CeHJRNjI3VGVMOXEyd1VFOVRyY0JQWTh2WkVvSTM4WHNoVHpuVDJnOHNPOFRrZTVqRFVqR2xmeE5lRk0wZVRyZmxzT3JCMzVxejhkWXdUNWhudmFlcUZCUW9zQ2YxbkNlYmltVjFFdnA5MQ/messages/@original`
                // var apiresponse = await fetch(url, axois_config);
                // var data = await apiresponse.json();
                // console.log(data.id)
                // var apiresponse = await fetch(url, axois_config);
                // var data = await apiresponse.json();
                // console.log(data.id)
                // // console.log(await axios.put(discord_api_root_url+`/channels/${message.channel.id}/messages/${data.id}/reactions/${encodeURIComponent('❤')}/@me`, axois_config))
                // console.log(await axios.put(discord_api_root_url+`/channels/${message.channel.id}/messages/${data.id}/reactions/${encodeURIComponent('❤')}/@me`, axois_config))
                // // console.log(await axios.put(discord_api_root_url+`/channels/951027740256137229/messages/1131640957100630026/reactions/%E2%9D%A4/@me`))
                // // console.log(await axios.put(discord_api_root_url+`/channels/951027740256137229/messages/${await get_original_interaction_response(message.token)}/reactions/${encodeURIComponent('❤')}/@me`, axois_config).status)
                // // await add_reaction(message.channel.id, await get_original_interaction_response(message.token).id, '✨')
                // // response.status(200).send({
                // //     type: 4,
                // //     data: {
                // //         "content": '<3',
                // //     }
                // // });

                // break;
            default:
                console.log('default')
                response.status(200).send({
                    type: 4,
                    data: {
                        content: "<3\ncmd invoked: `"+message.data.name.toLowerCase()+'`'
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