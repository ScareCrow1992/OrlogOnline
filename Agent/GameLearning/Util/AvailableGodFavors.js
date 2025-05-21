import godFavorStats from "../Data/godFavorStats.js"
import GodFavorAction from "../Data/GodFavorAction.js"


let godFavorIndexDict = Object.keys(godFavorStats)



// const empty_godfavor = {
//     preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//     extra: null,
//     input: null
// }


function Get_After_Token(agent_index, state) {
    let players_info_ = JSON.parse(JSON.stringify(state))

    let first_info, second_info

    if(state.situation.order[0] == agent_index){
        first_info = players_info_.avatar
        second_info = players_info_.opponent
    }
    else{
        first_info = players_info_.opponent
        second_info = players_info_.avatar
        
    }

    // Mark
    let first_mark_cnt = first_info.dices.mark
    let second_mark_cnt = second_info.dices.mark

    first_info.token = Math.min(first_info.token + first_mark_cnt, 50)
    second_info.token = Math.min(second_info.token + second_mark_cnt, 50)


    // Steal
    let first_steal_cnt = first_info.dices.steal, second_steal_cnt = second_info.dices.steal


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


    return [first_info.token, second_info.token]


    // let ret = [players_info[0].token, players_info[1].token]
    // console.log(ret)

    // return ret
}



const CheckAvailable = (afterDecision, cost, token, after_token, local_godfavor_index, agent_index) => {
    // console.log("decision", afterDecision)
    // console.log("cost, token", cost, token)
    return (afterDecision && (cost <= after_token)) || (!afterDecision && (cost <= token))
}


const need_input_godfavors = [5, 9, 11, 16]
function AvailableGodFavors_(godFavor_index, godFavor_stat, token, after_token, local_godfavor_index, agent_index) {
    let ret = []
    godFavor_stat.cost.forEach((cost, level) => {
        if (CheckAvailable(godFavor_stat.afterDecision, cost, token, after_token)) {
            // if(cost <= token){        
            // console.log("USE!")            
            let info = {}
            info.godfavorIndex = local_godfavor_index
            info.godfavorNameIndex = godFavor_index
            info.level = level

            if(godFavor_stat.extra_input == true){
                for (let i = 0; i < 3; i++) {
                    let extra_action_ = GodFavorAction(agent_index, godFavor_stat, level, godFavor_index)

                    let action_ = {
                        preparedGodFavor : info,
                        extra: extra_action_[0],
                        input: extra_action_[1]
                    }

                    ret.push(action_)

                }
            }
            else{
                let action_ = {
                    preparedGodFavor :info,
                    extra: null,
                    input: null
                }
    
                ret.push(action_)

            }

        }
        else {
            let action_ = {
                preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
                extra: null,
                input: null
            }
            ret.push(action_)
        }
    })

    // let action_ = {
    //     preparedGodFavor: { godfavorIndex: local_index, level: ret.level, godfavorNameIndex: ret.index },
    //     extra: null,
    //     input: null
    // }

    return ret
}


function AvailableGodFavor_Single(agent_info, after_token, agent_index){
    let ret = []

    let godFavors = agent_info.godFavors
    let token = agent_info.token

    godFavors.forEach((godFavor_index, local_godfavor_index) => {

        let godFavor_name = godFavorIndexDict[godFavor_index]
        let godFavor_stat = godFavorStats[`${godFavor_name}`]

        // if(godFavor_stat.afterDecision){

        let infos = AvailableGodFavors_(godFavor_index, godFavor_stat, token, after_token, local_godfavor_index, agent_index)
        ret.push(...infos)


    })

    // console.log(ret)

    return ret

}



function AvailableGodFavors(agent_index, state) {

    let [first_token, second_token] = Get_After_Token(agent_index, state)
    let avatar_after_token, opponent_after_token

    if (state.situation.order[0] == agent_index) {
        avatar_after_token = first_token
        opponent_after_token = second_token
    }
    else {
        avatar_after_token = second_token
        opponent_after_token = first_token
    }

    let avaialable_avatar = AvailableGodFavor_Single(state.avatar, avatar_after_token, agent_index)
    let avaialable_opponent = AvailableGodFavor_Single(state.opponent, opponent_after_token, 1- agent_index)

    return [avaialable_avatar, avaialable_opponent]
}



export default function(agent_index, state){
    let [avaialable_avatar, avaialable_opponent] = AvailableGodFavors(agent_index, state)

    return [avaialable_avatar, avaialable_opponent]






}



// let state_ = {
//     avatar: {
//         godFavors: [8, 11, 14],
//         health: 15,
//         token: 5,
//         heal: 0,
//         damage: 0,
//         dices: {
//             axe: 0,
//             arrow: 4,
//             helmet: 0,
//             shield: 0,
//             steal: 2,
//             empty: 0,
//             mark: 5
//         },
//         // dices_ : {
//         //     weapon : [ ~~ ],
//         //     mark : [ ~~ ]
//         // }
//     },
//     opponent : {
//         godFavors: [8, 5, 14],
//         health: 15,
//         token: 5,
//         heal: 0,
//         damage: 0,
//         dices: {
//             axe: 0,
//             arrow: 3,
//             helmet: 0,
//             shield: 0,
//             steal: 3,
//             empty: 0,
//             mark: 4
//         },
//         // dices_ : {
//         //     weapon : [ ~~ ],
//         //     mark : [ ~~ ]
//         // }
//     },
//     situation : {
//         order : [1, 0],
//         round : 4
//     }
// }

// let [avaialable_avatar, avaialable_opponent] = AvailableGodFavors(1, state_)

// console.log("========================")
// console.log(avaialable_avatar)
// console.log("========================")
// console.log(avaialable_opponent)
// console.log("========================")

// let ret = Get_After_Token(0, state_)
// console.log(ret)