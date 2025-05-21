import { WebSocket } from "ws";
import Cases from "./cases.js"


let socket_ = new WebSocket("ws://127.0.0.1:8765")

let avatars_info =
    [{ axe: 3, arrow: 1, helmet: 0, shield: 1, steal: 1, mark: 0, hp: 3, token: 15 },
    { axe: 3, arrow: 0, helmet: 1, shield: 0, steal: 0, mark: 1, hp: 4, token: 8 },
    { first: 0, turn: 3 }]

let dices_dir = ['bottom', 'left', null, null, "top", null]

let user_index = 0


socket_.onopen = (event) => {
    console.log("connected!")

    let [keys, indexes] = Cases(avatars_info, dices_dir, user_index)
    // console.log(keys)
    // console.log(indexes)
    socket_.send(keys)


    // socket_.send(
    //     `15-0-3-1-1-0-1-2:15-0-1-0-1-0-1-0:2/
    //     10-5-4-0-1-0-1-2:7-7-1-1-2-1-1-5:5/
    //     5-10-1-2-1-0-0-3:3-28-1-1-1-0-0-1:1/
    //     6-5-0-1-1-0-0-2:11-2-0-0-0-0-0-0:0/
    //     11-5-1-1-0-1-0-2:11-6-0-0-0-0-0-4:0/
    //     15-0-2-2-2-0-0-1:15-0-4-1-1-0-0-0:5/
    //     11-4-0-1-2-1-0-4:9-8-1-0-2-0-1-1:3`)

    // socket_.send("10-5-4-0-1-0-1-2:7-7-1-1-2-1-1-5:5")
    // socket_.send("15-0-3-1-1-0-1-2:15-0-1-0-1-0-1-0:2")
}

socket_.onmessage = (msg) =>{
    // console.log(msg.data)
}