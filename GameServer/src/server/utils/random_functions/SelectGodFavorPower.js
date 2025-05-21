import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
import * as ZMQ from "../../DeepLearning/zmq.js"

const random = new Random();




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
    return (afterDecision && (cost <= token)) || (!afterDecision && (cost <= after_token))
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
    // console.log(arguments)
    
    // console.log(global.godFavorIndexDict)
    let avaialable_godFavors = AvailableGodFavors(agent_index, players_info)
    // avaialable_godFavors = []

    // console.log(dices_dir)
    // console.log(avatars_info)
    // console.log("\n\n========================================\n\n")

    let ret = [
        "BellPushed",
        [
            "client", {godFavorIndex: random.integer(0, 0), level: 0}, "godfavor",
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
    
    // let dice_info = ret[1][3][index].dicesState

    let length_= avaialable_godFavors.length
    let use_index = random.integer(0, length_)
    let power
    

    if(use_index == length_){
        power = null
    }
    else{
        let selected_godFavor = avaialable_godFavors[use_index]
        let index_ = 0
        for (let i = 0; i < 3; i++) {
            if(players_info[agent_index].godFavors[i] == selected_godFavor.index){
                index_ = i
                break;
            }
        }
        power = { godFavorIndex: index_, level: selected_godFavor.level }
    }

    
    // power = {godFavorIndex: 1, level: 0}


    let promise = new Promise(res => {

        // let power = null

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
        
        res(ret)
        
        // global.zmq.Request_DicePick(avatars_info, dices_dir, index)
        //     .then((dices_index) => {
        //         dices_index.forEach(index => {
        //             dice_info[index] = "chosen"
        //         })
        //         res(ret)
        //     })


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