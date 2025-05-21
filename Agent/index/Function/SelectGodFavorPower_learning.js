import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
// import * as ZMQ from "../../DeepLearning/zmq.js"
import GodFavorAction from "./GodFavorAction.js";
import GodFavorPower from "./GodFavorPower.js"
import Parse_PlayerInfo from "./Parse_PlayerInfo.js";

const random = new Random();

const need_extra_input = [5, 9, 11, 16]

const godfavor_stats_dict = {
    5 : {
        title : "Frigg's Sight",
        description : "Re-roll any of your, or your opponent's, dice.",
        spec : function(level){return `Re-roll ${this.effectValue[level]} dice`},
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 2,
        color : 0xd9d9d9,
        extra_input : true,
        godfavorNameIndex : 5
    },
    9 : {
        title : "Loki's Trick",
        description : "Ban opponent's dice for the Round.",
        spec : function(level){return `Ban ${this.effectValue[level]} dice`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 2,
        color : 0x999999,
        extra_input : true,
        godfavorNameIndex: 9
    },
    11 : {
        title : "Odin's Sacrifice",
        description : "Sacrifice any number of your health tokens and gain ⌘ per health token sacrificed.",
        spec : function(level){return `Gain ${this.effectValue[level]} ⌘ per health token`},
        cost : [6, 8, 10],
        afterDecision : true,
        effectValue : [3, 4, 5],
        priority : 7,
        color : 0xffffff,
        extra_input : true,
        godfavorNameIndex: 11
    },
    16 : {
        title : "Tyr's Pledge",
        description : "Sacrifice any number of your health tokens to destroy opponent's ⌘",
        spec : function(level){return `Destroy ${this.effectValue[level]} ⌘ per HP`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x9900ff,
        extra_input : true,
        godfavorNameIndex : 16
    }
}


function Get_After_Token(players_info){
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



function Get_CandidateReturns(agent_index, avaialable_godFavors, avatar_info, opponent_info, situation_info){
    let rets = []
    let candidate_godFavors = []

    avatar_info.heal = 0
    avatar_info.damage = 0

    opponent_info.heal = 0
    opponent_info.damage = 0

    avaialable_godFavors.forEach((godfavor_info)=>{
        // godfavor_info = {index ( 0 ~ 19) , level ( 0 ~ 2) , cost}

        let name_ = global.godFavorIndexDict[godfavor_info.index]
        let level_ = godfavor_info.level

        let tmp_avatar_info = Parse_PlayerInfo(avatar_info)
        let tmp_opponent_info = Parse_PlayerInfo(opponent_info)

        // let tmp_avatar_info = JSON.parse(JSON.stringify(avatar_info))
        // let tmp_opponent_info = JSON.parse(JSON.stringify(opponent_info))
        
        let ret = GodFavorPower[`${name_}`].effect(tmp_avatar_info, tmp_opponent_info, level_)

        if(Array.isArray(ret) == true){

            ret[0].forEach((cmd_)=>{
                cmd_.situation = JSON.parse(JSON.stringify(situation_info))
            })

            rets.push(...ret[0])

            ret[1].forEach(input_=>{
                let new_info = JSON.parse(JSON.stringify(godfavor_info))
                new_info.input = input_
                candidate_godFavors.push(new_info)
            })

        }
        else{
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


function Model_Predict(candidate_cmds, depth){
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
    // console.log(players_info)
    // console.log(arguments)
    
    // console.log(global.godFavorIndexDict)
    let available_godFavors = AvailableGodFavors(agent_index, players_info)
    // avaialable_godFavors = []

    // console.log(dices_dir)
    // console.log(avatars_info)
    // console.log("\n\n========================================\n\n")

    // let ret = [
    //     "BellPushed",
    //     [
    //         "client", {godFavorIndex: random.integer(0, 0), level: 0}, "godfavor",
    //         [
    //             {
    //                 "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
    //                 health: 15,
    //                 token: 5
    //             }, {
    //                 "dicesState": ["waiting", "waiting", "waiting", "waiting", "waiting", "waiting"],
    //                 health: 15,
    //                 token: 10
    //             }
    //         ]
    //     ]
    // ]

    // console.log(typeof this)
    
    // let dice_info = ret[1][3][index].dicesState

    // let use_index = random.integer(0, length_)
    let power = null

    // console.log(avaialable_godFavors)

    let avatar_index = agent_index
    let opponent_index = 1 - agent_index

    let avatar_info = players_info[avatar_index]
    let opponent_info = players_info[opponent_index]

    let tmp_situation_info = { order: this.order, roll: 0 }


    let [candidate_cmds, candidate_godFavors] = Get_CandidateReturns(agent_index, available_godFavors, avatar_info, opponent_info, tmp_situation_info)

    let tmp_avatar_info = Parse_PlayerInfo(avatar_info)
    let tmp_opponent_info = Parse_PlayerInfo(opponent_info)

    candidate_cmds.push({avatar : tmp_avatar_info, opponent : tmp_opponent_info, situation : tmp_situation_info })

    let length_= candidate_godFavors.length


    let promise = new Promise(res => {
        let [array_data, index_promise] = Model_Predict(candidate_cmds, this.force_sync_depth)
        
        index_promise.then(index_ => {

            // console.log("[[ on Agent ]]")
            // console.log(selected_godFavor)
            // console.log(array_data[index_])
            // console.log("\n\n\n")


            this.logs.push(...array_data[index_])

            // console.log(index_)
            // console.log(candidate_godFavors[index_])
            // console.log(candidate_godFavors.length, candidate_cmds.length, index_)
            let selected_godFavor = candidate_godFavors[index_]

            // console.log(candidate_cmds[index_])

            if (index_ == length_) {
                power = null
            }
            else {
                let local_index_ = 0
                for (let i = 0; i < 3; i++) {
                    if (players_info[agent_index].godFavors[i] == selected_godFavor.index) {
                        local_index_ = i
                        break;
                    }
                }
                power = { godFavorIndex: local_index_, level: selected_godFavor.level }
            }


            let ret = null

            // power = { godFavorIndex: 1, level: 0 }

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

            res(ret)
        })

    })




    
    return promise


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