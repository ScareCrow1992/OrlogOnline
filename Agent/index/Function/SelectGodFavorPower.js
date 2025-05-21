import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
// import * as ZMQ from "../../DeepLearning/zmq.js"
import GodFavorAction from "./GodFavorAction.js";
import GodFavorPower from "./GodFavorPower.js"
import Parse_PlayerInfo from "./Parse_PlayerInfo.js";

const random = new Random();

const need_extra_input = [5, 9, 11, 16]


function Get_After_Token(players_info) {
    let players_info_ = JSON.parse(JSON.stringify(players_info))


    let first = players_info_[2][0]
    let second = players_info_[2][1]

    let first_info = players_info_[first]
    let second_info = players_info_[second]


    // Mark

    let first_mark_cnt = 0, second_mark_cnt = 0

    first_info.mark.forEach(mark => {
        if (mark)
            first_mark_cnt++
    })

    second_info.mark.forEach(mark => {
        if (mark)
            second_mark_cnt++
    })

    first_info.token = Math.min(first_info.token + first_mark_cnt, 50)
    second_info.token = Math.min(second_info.token + second_mark_cnt, 50)



    // Steal

    let first_steal_cnt = 0, second_steal_cnt = 0

    first_info.weapon.forEach(weapon => {
        if (weapon == "steal")
            first_steal_cnt++
    })

    second_info.weapon.forEach(weapon => {
        if (weapon == "steal")
            second_steal_cnt++
    })

    // 선공 스틸
    let steal_cnt = first_steal_cnt
    steal_cnt = Math.min(steal_cnt, second_info.token)
    steal_cnt = Math.min(steal_cnt, 50 - first_info.token)

    first_info.token += steal_cnt
    second_info.token -= steal_cnt


    steal_cnt = second_steal_cnt
    steal_cnt = Math.min(steal_cnt, first_info.token)
    steal_cnt = Math.min(steal_cnt, 50 - second_info.token)

    first_info.token -= steal_cnt
    second_info.token += steal_cnt

    // 후공 스틸

    players_info[0].after_token = players_info_[0].token
    players_info[1].after_token = players_info_[1].token


    // let ret = [players_info[0].token, players_info[1].token]
    // console.log(ret)

    // return ret
}



const CheckAvailable = (afterDecision, cost, token, after_token) => {
    return (afterDecision && (cost <= after_token)) || (!afterDecision && (cost <= token))
}


function AvailableGodFavors_(godFavor_index, godFavor_stat, token, after_token) {
    let ret = []
    godFavor_stat.cost.forEach((cost, level) => {
        if (CheckAvailable(godFavor_stat.afterDecision, cost, token, after_token)) {
            // if(cost <= token){                    
            let info = {}
            info.index = godFavor_index
            info.level = level
            info.cost = cost
            ret.push(info)
        }
    })

    return ret
}


// ret = [{index : 12, level : 0, cost : 5}, {index : 12, level : 1, , cost : 8}, ...]
function AvailableGodFavors(agent_index, players_info) {
    let ret = []

    Get_After_Token(players_info)

    let godFavors = players_info[agent_index].godFavors
    let token = players_info[agent_index].token
    let after_token = players_info[agent_index].after_token
    after_token = token

    // console.log(players_info)
    // console.log(godFavors)

    // console.log(godFavors)
    // godFavors = [11]

    godFavors.forEach(godFavor_index => {

        let godFavor_name = global.godFavorIndexDict[godFavor_index]
        let godFavor_stat = global.GodFavorStats[`${godFavor_name}`]

        // if(godFavor_stat.afterDecision){

        let infos = AvailableGodFavors_(godFavor_index, godFavor_stat, token, after_token)
        ret.push(...infos)


    })
    // console.log(ret)
    return ret
}



function Get_CandidateReturns(agent_index, avaialable_godFavors, avatar_info, opponent_info, situation_info) {
    let rets = []
    let candidate_godFavors = []

    avatar_info.heal = 0
    avatar_info.damage = 0

    opponent_info.heal = 0
    opponent_info.damage = 0

    avaialable_godFavors.forEach((godfavor_info) => {
        // godfavor_info = {index ( 0 ~ 19) , level ( 0 ~ 2) , cost}

        let name_ = global.godFavorIndexDict[godfavor_info.index]
        let level_ = godfavor_info.level

        let tmp_avatar_info = Parse_PlayerInfo(avatar_info)
        let tmp_opponent_info = Parse_PlayerInfo(opponent_info)

        // let tmp_avatar_info = JSON.parse(JSON.stringify(avatar_info))
        // let tmp_opponent_info = JSON.parse(JSON.stringify(opponent_info))

        let ret = GodFavorPower[`${name_}`].effect(tmp_avatar_info, tmp_opponent_info, level_)

        if (Array.isArray(ret) == true) {

            ret[0].forEach((cmd_) => {
                cmd_.situation = JSON.parse(JSON.stringify(situation_info))
            })

            rets.push(...ret[0])

            ret[1].forEach(input_ => {
                let new_info = JSON.parse(JSON.stringify(godfavor_info))
                new_info.input = input_
                candidate_godFavors.push(new_info)
            })

        }
        else {
            ret.situation = JSON.parse(JSON.stringify(situation_info))
            rets.push(ret)
            let new_info = JSON.parse(JSON.stringify(godfavor_info))
            candidate_godFavors.push(new_info)
        }

        // console.log("===================================================")
        // console.log(ret)
        // console.log(name_, level_)
        // console.log(avatar_info)
        // console.log(opponent_info)


    })

    return [rets, candidate_godFavors]
}


function Model_Predict(candidate_cmds, depth) {
    return global.TensorModel.Predict(candidate_cmds, "godfavor", depth)

}


/*

players_info =
[
    {
        godFavors: [0, 1, 5],
        health: 15,
        token: 25,
        weapon: [Array],
        mark: [Array],
        state: [Array]
    },
    {
        godFavors: [Array],
        health: 15,
        token: 25,
        weapon: [Array],
        mark: [Array],
        state: [Array]
    },
    [1, 0]  // order
]

 */


export default function (agent_index, players_info) {
    let avaialable_godFavors = AvailableGodFavors(agent_index, players_info)
    let ret = null

    let order__ = players_info[2][0]

    let turn_ = undefined
    if (agent_index == order__)
        turn_ = 0
    else
        turn_ = 1


    let tmp_avatar_info = DataParse(players_info[agent_index])
    let tmp_opponent_info = DataParse(players_info[1 - agent_index])
    let tmp_situation = {
        order: [order__, 1 - order__],
        phase: 1,
        round: 0,
        turn: turn_
    }

    
    // console.log()
    // console.log(tmp_situation.order)
    // console.log(`[ ${agent_index} ] : ${tmp_situation.order[turn_]}`)

    let state = {
        "avatar": tmp_avatar_info,
        "opponent": tmp_opponent_info,
        "situation": tmp_situation
    }


    let promise_ = new Promise(res => {
        let action_size = avaialable_godFavors.length
        

        if (action_size == 0) {

            // console.log()
            // console.log("action size : ", action_size)

            let power_ = null

            let ret = [
                "BellPushed",
                [
                    "client", power_, "godfavor",
                    [
                        {
                            "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                            health: 15,
                            token: 5
                        }, {
                            "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                            health: 15,
                            token: 10
                        }
                    ]
                ]
            ]
            res(ret)

        }
        else {
            if (this.machine == null) {
                let length_ = avaialable_godFavors.length
                let use_index = random.integer(0, length_)
                let power = { godFavorIndex: 1, level: 0 }

                if (use_index == length_) {
                    power = null
                }
                else {
                    let selected_godFavor = avaialable_godFavors[use_index]
                    let index_ = 0
                    for (let i = 0; i < 3; i++) {
                        if (players_info[agent_index].godFavors[i] == selected_godFavor.index) {
                            index_ = i
                            break;
                        }
                    }
                    power = { godFavorIndex: index_, level: selected_godFavor.level }
                }


                if (power != null && need_extra_input.includes(players_info[agent_index].godFavors[power.godFavorIndex])) {
                    let godFavor_index = players_info[agent_index].godFavors[power.godFavorIndex]

                    let godFavor_name = global.godFavorIndexDict[godFavor_index]
                    let godFavor_stat = global.GodFavorStats[`${godFavor_name}`]

                    ret = GodFavorAction(agent_index, godFavor_stat, players_info, power, godFavor_index, selected_godFavor.input)

                }
                else {
                    ret = [
                        "BellPushed",
                        [
                            "client", power, "godfavor",
                            [
                                {
                                    "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                                    health: 15,
                                    token: 5
                                }, {
                                    "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                                    health: 15,
                                    token: 10
                                }
                            ]
                        ]
                    ]
                }

                res(ret);
            }
            else {

                this.machine.Playout(state, null, 23, agent_index, 1, action_size).then(playout_ret => {


                    // console.log()
                    // console.log("action size : ", action_size)

                    if (this.isAgent == true) {
                        this.logs.godfavor.state.push(playout_ret[0])
                        this.logs.godfavor.action.push(playout_ret[3])
                        this.logs.godfavor.value.push(playout_ret[4])
                        this.logs.godfavor.mask.push(playout_ret[5])

                    }

                    let action_index = playout_ret[2]

                    let power_ = null


                    // if(action_index == 60)
                    //     console.log("god favor action is none")
                    // else
                    //     console.log("used : ", action_index)



                    // console.log("action index : ", action_index)
                    // console.log(playout_ret[1].preparedGodFavor)
                    let prepared_godfavor = playout_ret[1].preparedGodFavor

                    // console.log(prepared_godfavor.godfavorIndex , action_index)

                    if (action_index == 60 || prepared_godfavor.godfavorIndex == -1)
                        power_ = null
                    else {
                        power_ = {
                            godFavorIndex: prepared_godfavor.godfavorIndex,
                            level: prepared_godfavor.level
                        }

                        // console.log(power_)
                        // delete power_.probability
                    }

                    // console.log(power_, prepared_godfavor)

                    let ret = [
                        "BellPushed",
                        [
                            "client", power_, "godfavor",
                            [
                                {
                                    "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                                    health: 15,
                                    token: 5
                                }, {
                                    "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
                                    health: 15,
                                    token: 10
                                }
                            ]
                        ]
                    ]
                    res(ret)
                })
            }




        }

    })


    return promise_



    // // let dice_info = ret[1][3][index].dicesState
    // let length_ = avaialable_godFavors.length
    // let use_index = random.integer(0, length_)
    // let power
    // let selected_godFavor

    // if (use_index == length_) {
    //     power = null
    // }
    // else {
    //     selected_godFavor = avaialable_godFavors[use_index]
    //     let index_ = 0
    //     for (let i = 0; i < 3; i++) {
    //         if (players_info[agent_index].godFavors[i] == selected_godFavor.index) {
    //             index_ = i
    //             break;
    //         }
    //     }
    //     power = { godFavorIndex: index_, level: selected_godFavor.level }
    // }



    // power = {godFavorIndex: 1, level: 0}
    // let promise = new Promise(res => {

    //     if (power != null && need_extra_input.includes(players_info[agent_index].godFavors[power.godFavorIndex])) {
    //         let godFavor_index = players_info[agent_index].godFavors[power.godFavorIndex]

    //         let godFavor_name = global.godFavorIndexDict[godFavor_index]
    //         let godFavor_stat = global.GodFavorStats[`${godFavor_name}`]


    //         ret = GodFavorAction(agent_index, godFavor_stat, players_info, power, godFavor_index, selected_godFavor.input)


    //     }
    //     else {
    //         ret = [
    //             "BellPushed",
    //             [
    //                 "client", power, "godfavor",
    //                 [
    //                     {
    //                         "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
    //                         health: 15,
    //                         token: 5
    //                     }, {
    //                         "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
    //                         health: 15,
    //                         token: 10
    //                     }
    //                 ]
    //             ]
    //         ]
    //     }

    //     console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    //     console.log(power)
    //     console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")


    //     // res(ret)

    //     // global.zmq.Request_DicePick(avatars_info, dices_dir, index)
    //     //     .then((dices_index) => {
    //     //         dices_index.forEach(index => {
    //     //             dice_info[index] = "chosen"
    //     //         })
    //     //         res(ret)
    //     //     })
    // })

    // return promise
    // let tray_dices_index = []
    // dices_dir.forEach((dice_dir, index) => {
    //     if (dice_dir != null) {
    //         tray_dices_index.push(index)
    //         dice_info[index] = "tray"
    //         // test
    //         const value = random.integer(0, 1);
    //         dice_info[index] = value == 0 ? "tray" : "chosen"
    //     }
    //     else {
    //         dice_info[index] = "chosen"
    //     }
    // })
    // return [ret, AgentHTTP.Request_DicePick(avatars_info, dices_dir, index)]
    // return ret


}


function DataParse(info_) {
    let info = JSON.parse(JSON.stringify(info_))


    info.dices = { axe: 0, arrow: 0, helmet: 0, shield: 0, steal: 0, empty: 0, mark: 0 }

    info.weapon.forEach(weapon_ => {
        info.dices[`${weapon_}`]++
    })

    info.dices.empty = 6 - (
        info.dices.axe + info.dices.arrow + info.dices.helmet + info.dices.shield + info.dices.steal
    )

    info.mark.forEach(mark_ => {
        if (mark_ == true)
            info.dices.mark++
    })

    info.dices_ = {
        weapon: info.weapon,
        mark: info.mark
    }



    delete info.weapon
    delete info.mark
    delete info.state
    delete info.after_token

    return info
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
