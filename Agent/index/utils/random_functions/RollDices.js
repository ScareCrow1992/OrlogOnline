import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
import * as ZMQ from "../../DeepLearning/zmq.js"

const random = new Random();


export default function (index, user, dices_dir, dices_cnt, avatars_info) {
    // console.log(avatars_info)

    if(index != user || dices_cnt == 0)
        return null

    if(avatars_info.Round > 3)
        return null


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
    // console.log(ret[1][3][0])
    // console.log(ret[1][3][1])
    
    let dice_info = ret[1][3][index].dicesState

    let promise = new Promise(res => {

        let dice0 = new Array(6)
        let dice1 = new Array(6)

        // console.log(dice0.length)

        for(let i=0; i<6; i++){
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