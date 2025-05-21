import { Random } from "random-js";
import Cases from "../../DeepLearning/cases.js"
// import * as AgentHTTP from "../../DeepLearning/agent_http.js"
// import * as ZMQ from "../../DeepLearning/zmq.js"




export default function (index, user_index) {
    // console.log(arguments)

    // console.log(dices_dir)
    // console.log(avatars_info)
    // console.log("\n\n========================================\n\n")
    return index == user_index


    let ret = [
        "BellPushed",
        [
            "client", {godFavorIndex: random.integer(0, 2), level: 0}, "godfavor",
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
    
    let dice_info = ret[1][3][index].dicesState

    let promise = new Promise(res => {
        ret = [
            "BellPushed",
            [
                "client", null, "godfavor",
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