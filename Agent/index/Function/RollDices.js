// import { Random } from "random-js";
// import Cases from "../../DeepLearning/cases.js"
import Get_Cmd_Rollphase from "./Get_Cmd_Rollphase.js";
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
// import * as ZMQ from "../../DeepLearning/zmq.js"

// const random = new Random();


export default function (index, user, dices_dir, dices_cnt, token_dirs, avatars_info, current_dices, dices_state) {
    // console.log(arguments)


    if (avatars_info.First == index)
        this.order = 0
    else
        this.order = 1

    // console.log(arguments)
    // console.log(avatars_info)
    // console.log(current_dices[0])
    // console.log(current_dices[1])

    // console.log(dices_state)
    // console.log("~~~")


    // console.log(avatars_info)

    if (index != user || dices_cnt == 0)
        return null

    if (avatars_info.Round > 3)
        return null



    // console.log(this.uid)

    let promise = new Promise(res => {


        let ret = [
            "BellPushed",
            [
                "client", { user: index, godfavors: [0, 1, 2] }, "roll",
                [
                    {
                        "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
                        health: 15,
                        token: 5
                    }, {
                        "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
                        health: 15,
                        token: 10
                    }
                ]
            ]
        ]



        if (this.machine == null) {

            let dice0 = new Array(6).fill("tray")
            let dice1 = new Array(6).fill("tray")


            for (let i = 0; i < 6; i++) {
                dice0[i] = Math.random() < 0.6 ? "tray" : "chosen"
                dice1[i] = Math.random() < 0.6 ? "tray" : "chosen"
            }

            ret = [
                "BellPushed",
                [
                    "client", { user: index, godfavors: [0, 1, 2] }, "roll",
                    [
                        {
                            "dicesState": dice0,
                            health: 15,
                            token: 5
                        }, {
                            "dicesState": dice1,
                            health: 15,
                            token: 10
                        }
                    ]
                ]
            ]


            res(ret)
            // res(ret)
        }
        else {
            let [avatar, opponent, situation] = DataParse(avatars_info, index, current_dices, dices_state)
            let state = { avatar, opponent, situation }

            // console.log(index, user, avatar)

            let action_size = Math.pow(2, dices_cnt)

            // console.log("roll : ", action_size)

            this.machine.Playout(state, dices_dir, 23, index, 1, action_size).then(playout_ret => {
                // console.log(playout_ret)

                let dice_select_ = new Array(6).fill("tray")
                for (let i = 0; i < 6; i++) {
                    if (playout_ret[1].chosen[i] == true)
                        dice_select_[i] = "chosen"
                }

                ret = [
                    "BellPushed",
                    [
                        "client", { user: index, godfavors: [0, 1, 2] }, "roll",
                        [
                            {
                                "dicesState": dice_select_,
                                health: 15,
                                token: 5
                            }, {
                                "dicesState": dice_select_,
                                health: 15,
                                token: 10
                            }
                        ]
                    ]
                ]

                if (this.isAgent == true) {
                    this.logs.roll.state.push(playout_ret[0])
                    this.logs.roll.action.push(playout_ret[3])
                    this.logs.roll.value.push(playout_ret[4])
                    this.logs.roll.mask.push(playout_ret[5])
                }


                res(ret)
            })
        }

        // console.log(avatars_info)


        // let [array_data, bit_mask_arr, promise_cmd_index_] = Get_Cmd_Rollphase(avatars_info, index, dices_dir, dices_cnt, null)

        // promise_cmd_index_.then(cmd_index_ => {
        //     let bit_mask_ = bit_mask_arr[cmd_index_]
        //     // console.log(bit_mask_)

        //     this.logs.push(...array_data[cmd_index_])


        //     let ret = [
        //         "BellPushed",
        //         [
        //             "client", { user: index, godfavors: [0, 1, 2] }, "roll",
        //             [
        //                 {
        //                     "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
        //                     health: 15,
        //                     token: 5
        //                 }, {
        //                     "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
        //                     health: 15,
        //                     token: 10
        //                 }
        //             ]
        //         ]
        //     ]

        //     let dice_info = ret[1][3][index].dicesState




        //     let dice0 = new Array(6).fill("tray")
        //     let dice1 = new Array(6).fill("tray")

        //     // console.log(dice0.length)

        //     // for (let i = 0; i < 6; i++) {
        //     //     dice0[i] = Math.random() < 0.6 ? "tray" : "chosen"
        //     //     dice1[i] = Math.random() < 0.6 ? "tray" : "chosen"
        //     // }


        //     let target_dice = null
        //     if (index = 0) {
        //         target_dice = dice0
        //     }
        //     else {
        //         target_dice = dice1
        //     }

        //     bit_mask_.forEach((bit_bool, index_) => {
        //         if (bit_bool == true) {
        //             // target_dice[index_] = "chosen"
        //             dice0[index_] = "chosen"
        //             dice1[index_] = "chosen"
        //         }
        //         else {
        //             // target_dice[index_] = "tray"
        //             dice0[index_] = "tray"
        //             dice1[index_] = "tray"
        //         }
        //     })


        //     ret = [
        //         "BellPushed",
        //         [
        //             "client", { user: index, godfavors: [0, 1, 2] }, "roll",
        //             [
        //                 {
        //                     "dicesState": dice0,
        //                     health: 15,
        //                     token: 5
        //                 }, {
        //                     "dicesState": dice1,
        //                     health: 15,
        //                     token: 10
        //                 }
        //             ]
        //         ]
        //     ]

        //     res(ret)

        // })



        // global.zmq.Request_DicePick(avatars_info, dices_dir, index)
        //     .then((dices_index) => {
        //         // console.log(dices_index)
        //         dices_index.forEach(index => {
        //             dice_info[index] = "chosen"
        //         })
        //         res(ret)
        //     })
    })

    return promise

}




function DataParse(avatars_info, avatar_index, current_dices, dices_state) {

    let roll__ = undefined
    if (avatars_info.Round < 2)
        roll__ = 1
    else
        roll__ = 0

    let opponent_index, agent_index;

    let order__ = avatars_info.First

    if (avatars_info.First == avatar_index) {
        // console.log("agent is first")
        // 자신이 선공일 경우
        agent_index = 0
        opponent_index = 1
    }
    else {
        // console.log("agent is second")
        // 자신이 후공일 경우
        agent_index = 1
        opponent_index = 0
    }

    // agent_index = avatar_index
    // opponent_index = 1 - agent_index


    // let opponent_index = 1 - avatar_index

    let tmp_info = {
        godFavors: null,
        health: 0,
        token: 0,
        dices: {
            axe: 0,
            arrow: 0,
            helmet: 0,
            shield: 0,
            steal: 0,
            empty: 0,
            mark: 0
        }

    }

    let agent_info = JSON.parse(JSON.stringify(tmp_info))
    let opponent_info = JSON.parse(JSON.stringify(tmp_info))

    let situation_info = {
        // order: [order, 1 - order],
        order: [order__, 1 - order__],
        turn: avatars_info.Round,
        phase: 0,
        round: 0
        // roll : roll__
    }

    // console.log(situation_info.turn)

    let index_ = agent_index
    agent_info.health = avatars_info[`HP-${index_}`]
    agent_info.token = avatars_info[`Token-${index_}`]
    agent_info.dices.mark = avatars_info[`Mark-${index_}`]
    agent_info.dices.axe = avatars_info[`Weapon-${index_}`][0]
    agent_info.dices.arrow = avatars_info[`Weapon-${index_}`][1]
    agent_info.dices.helmet = avatars_info[`Weapon-${index_}`][2]
    agent_info.dices.shield = avatars_info[`Weapon-${index_}`][3]
    agent_info.dices.steal = avatars_info[`Weapon-${index_}`][4]
    agent_info.dices.empty = 6 - (agent_info.dices.axe + agent_info.dices.arrow + agent_info.dices.helmet + agent_info.dices.shield + agent_info.dices.steal)
    agent_info.godFavors = avatars_info[`Card-${index_}`]

    let dices_ = {
        "weapon": new Array(6).fill(null),
        "mark": new Array(6).fill(null)
    }

    let dir_ = undefined
    for (let dice_index = 0; dice_index < 6; dice_index++) {
        if (dices_state[avatar_index][dice_index] == "waiting") {
            dir_ = current_dices[avatar_index][dice_index]
            dices_["weapon"][dice_index] = diceFaceInfo[dice_index][`${dir_}`].weapon
            dices_["mark"][dice_index] = diceFaceInfo[dice_index][`${dir_}`].token
        }
    }

    agent_info.dices_ = dices_


    // for(let i=0; i<)


    // console.log(agent_info.dices.empty)

    index_ = opponent_index
    opponent_info.health = avatars_info[`HP-${index_}`]
    opponent_info.token = avatars_info[`Token-${index_}`]
    opponent_info.dices.mark = avatars_info[`Mark-${index_}`]
    opponent_info.dices.axe = avatars_info[`Weapon-${index_}`][0]
    opponent_info.dices.arrow = avatars_info[`Weapon-${index_}`][1]
    opponent_info.dices.helmet = avatars_info[`Weapon-${index_}`][2]
    opponent_info.dices.shield = avatars_info[`Weapon-${index_}`][3]
    opponent_info.dices.steal = avatars_info[`Weapon-${index_}`][4]
    opponent_info.dices.empty = 6 - (opponent_info.dices.axe + opponent_info.dices.arrow + opponent_info.dices.helmet + opponent_info.dices.shield + opponent_info.dices.steal)
    opponent_info.godFavors = avatars_info[`Card-${index_}`]


    dices_ = {
        "weapon": new Array(6).fill(null),
        "mark": new Array(6).fill(null)
    }

    dir_ = undefined
    for (let dice_index = 0; dice_index < 6; dice_index++) {
        if (dices_state[1 - avatar_index][dice_index] == "waiting") {
            dir_ = current_dices[1 - avatar_index][dice_index]
            dices_["weapon"][dice_index] = diceFaceInfo[dice_index][`${dir_}`].weapon
            dices_["mark"][dice_index] = diceFaceInfo[dice_index][`${dir_}`].token
        }
    }

    opponent_info.dices_ = dices_

    // console.log(agent_info)
    // console.log(opponent_info)

    // if(avatar_index == 0){
    //     console.log("[ 0 ] : ", agent_info.godFavors)
    //     console.log("[ 1 ] : ", opponent_info.godFavors)
    // }

    // if(avatar_index == 1){
    //     console.log("[ 1 ] : ", agent_info.godFavors)
    //     console.log("[ 0 ] : ", opponent_info.godFavors)
    // }

    return [agent_info, opponent_info, situation_info]

}


const diceFaceInfo = [{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "arrow", token: true },
    "back": { weapon: "steal", token: true }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "steal", token: true },
    "front": { weapon: "arrow", token: false },
    "back": { weapon: "helmet", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "arrow", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "shield", token: false }
},

{
    "right": { weapon: "arrow", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: true },
    "back": { weapon: "axe", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "arrow", token: true }

},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "arrow", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "helmet", token: true }

}]
