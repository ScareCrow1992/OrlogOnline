import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
import * as ZMQ from "../../DeepLearning/zmq.js"

const random = new Random();




/*
godfavor_stat = {
    godfavorIndex: 0,
    level: 2,
    godfavorNameIndex: 3,
    token: -1,
    cost: [ 2, 4, 6 ],
    title: "Freyja's Plenty",
    description: 'Roll additional dice this round.',
    afterDecision: false,
    effectValue: [ 1, 2, 3 ],
    priority: 2,
    color: 16711935,
    modelName: 'FreyjaDice',
    extra_input: false,
    user: 0,
    opponent: 1,
    order: 0,
    cost_: 6,
    token_: 6,
}
*/


/*

players_info = [
    {
        godFavors: [ 5, 9, 11 ],
        health: 15,
        token: 21,
        weapon: [ 'steal', 'steal', 'steal', 'steal', 'shield', 'helmet' ],
        mark: [ true, true, false, true, true, true ]
    },
    {
        godFavors: [ 3, 13, 18 ],
        health: 15,
        token: 25,
        weapon: [ 'arrow', 'arrow', 'arrow', 'axe', 'axe', 'arrow' ],
        mark: [ true, false, true, false, false, false ]
    }
]

*/

export default function (agent_index, godfavor_stat, players_info) {
    // console.log(arguments)
    // console.log(players_info)

    if(agent_index != godfavor_stat.user ||
        godfavor_stat.extra_input == false || 
        godfavor_stat.cost_ > godfavor_stat.token_||
        godfavor_stat.level < 0)
        return null


    let turn_info = null
    let dices_info = [players_info[0]["state"], players_info[1]["state"]]
    // let dices_info = [[],[]]

    
    let msg, ban_cnt, opponent, dicesState, dices_index
    let consumed_health_stone_cnt, target_health_stone_index
    

    switch(godfavor_stat.godfavorNameIndex){
        // Frigg
        case 5:
            let reroll_cnt = godfavor_stat.effectValue[godfavor_stat.level]
            
            opponent = 1 - agent_index
            dicesState = [[],[]]

            players_info[opponent]["state"].forEach((state)=>{
                dicesState[opponent].push(state)
            })

            players_info[agent_index]["state"].forEach((state)=>{
                dicesState[agent_index].push(state)
            })

            
            let opponent_reroll_cnt = random.integer(0, reroll_cnt)
            let agent_reroll_cnt = reroll_cnt - opponent_reroll_cnt

            dices_index = [new Array(6), new Array(6)]
            
            for (let i = 0; i < 6; i++){
                dices_index[0][i] = i
                dices_index[1][i] = i
            }

            random.shuffle(dices_index[0])
            random.shuffle(dices_index[1])


            for (let i = 0; i < opponent_reroll_cnt; i++) {
                let dice_index = dices_index[opponent][i]
                if(dicesState[opponent][dice_index] != "ban")
                    dicesState[opponent][dice_index] = "levitation"
            }

            for (let i = 0; i < agent_reroll_cnt; i++) {
                let dice_index = dices_index[agent_index][i]
                if(dicesState[agent_index][dice_index] != "ban")
                    dicesState[agent_index][dice_index] = "levitation"
            }

            dices_info[opponent] = dicesState[opponent]
            dices_info[agent_index] = dicesState[agent_index]

            break;

        // Loki
        case 9:
            ban_cnt = godfavor_stat.effectValue[godfavor_stat.level]

            opponent = 1 - agent_index
            dicesState = []

            players_info[opponent]["state"].forEach((state, index)=>{
                dicesState.push(state)
            })


            dices_index = new Array(6)
            for (let i = 0; i < 6; i++)
                dices_index[i] = i

            random.shuffle(dices_index)

            for (let i = 0; i < ban_cnt; i++) {
                let dice_index = dices_index[i]
                if(dicesState[dice_index] != "ban")
                    dicesState[dice_index] = "levitation"
            }

            dices_info[opponent] = dicesState

            // dicesState.forEach((dice_state, index) => {
            //     dices_info[opponent][]

            // })
            
            // dices_info[opponent]


            break;


        // Odin
        case 11:
            consumed_health_stone_cnt = random.integer(2, 5)
            target_health_stone_index = players_info[agent_index].health - consumed_health_stone_cnt

            if (target_health_stone_index < 0)
                turn_info = null
            else
                turn_info = {
                    avatar: agent_index,
                    index: target_health_stone_index,
                    isBottom: undefined,   // true or false
                    type: "healthstone" // "healthstone" or "dice"
                }

            break;


        // Tyr
        case 16:
            consumed_health_stone_cnt = random.integer(2, 5)
            target_health_stone_index = players_info[agent_index].health - consumed_health_stone_cnt
            // console.log(`damage : ${consumed_health_stone_cnt}`)
            // console.log(`index : ${target_health_stone_index}`)

            if (target_health_stone_index < 0)
                turn_info = null
            else
                turn_info = {
                    avatar: agent_index,
                    index: target_health_stone_index,
                    isBottom: undefined,   // true or false
                    type: "healthstone" // "healthstone" or "dice"
                }


            break;


    }



    // ExtraInputBegin이 수신 된 후 전송해야 함
    
    
    let ret = [
        "BellPushed",
        [
            "client",
            turn_info,
            "resolution",
            [
                {
                    "dicesState": dices_info[0],
                    health: 15,
                    token: 5
                }, {
                    "dicesState": dices_info[1],
                    health: 15,
                    token: 10
                }
            ]
        ]
    ]

    // console.log(ret[1][1].index)
    // console.log(ret[1][3][0]["dicesState"])
    // console.log(ret[1][3][1]["dicesState"])



    
    return ret


    // return ret
}