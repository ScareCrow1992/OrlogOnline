import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
// import * as ZMQ from "../../DeepLearning/zmq.js"

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

export default function (agent_index, godfavor_stat, level, godfavorNameIndex) {

    let extra = null, input = null
    let reroll_cnt, select_mask
    let consumed_health_stone_cnt

    switch(godfavorNameIndex){
        // Frigg
        case 5:
            reroll_cnt = godfavor_stat.effectValue[level]

            extra = [new Array(6).fill(false), new Array(6).fill(false)]

            select_mask = new Array(6).fill(false)
            for(let i=0; i<reroll_cnt; i++){
                select_mask[i] = true
            }

            random.shuffle(select_mask)

            for(let i=0; i<reroll_cnt; i++){
                extra[1 - agent_index][i] = select_mask[i]
            }

            break;

        // Loki
        case 9:
            reroll_cnt = godfavor_stat.effectValue[level]

            extra = [new Array(6).fill(false), new Array(6).fill(false)]

            select_mask = new Array(6).fill(false)
            for(let i=0; i<reroll_cnt; i++){
                select_mask[i] = true
            }

            random.shuffle(select_mask)

            for(let i=0; i<reroll_cnt; i++){
                extra[1 - agent_index][i] = select_mask[i]
            }


            break;


        // Odin
        case 11:
            consumed_health_stone_cnt = random.integer(4,6)

            input = { index : consumed_health_stone_cnt, type : "healthstone" }

            break;


        // Tyr
        case 16:
            consumed_health_stone_cnt = random.integer(1,3)

            input = { index : consumed_health_stone_cnt, type : "healthstone" }

            break;


    }

    // global.print_console(JSON.stringify(turn_info))


    // console.log(ret[1][1].index)
    // console.log(ret[1][3][0]["dicesState"])
    // console.log(ret[1][3][1]["dicesState"])



    
    return [extra, input]


    // return ret
}