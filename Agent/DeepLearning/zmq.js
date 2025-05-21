// worker.js
// var zmq = require("zeromq")

import zmq from "zeromq"
import axios from "axios";
import Cases from "./cases.js"
import EventEmitter from "../Game/Calculation/EventEmitter.js";

class ZMQ {
    constructor() {
        this.sock = zmq.socket("req")
        this.sock.connect("tcp://127.0.0.1:5555");

        this.ticket = 0;

        this.map = new Map();

        // sock.send("T.T~~~")

        this.sock.on("message", (msg) => {
            msg = JSON.parse(msg)
            // console.log(msg)
            let ticket = parseInt(msg.ticket)

            let emitter = this.PopEmitter(ticket)
            emitter.trigger("trigger", [msg.keys])
        });
    }

    Request_DicePick(avatars_info, dices_dir, user_index) {
        let [features, indexes] = Cases(avatars_info, dices_dir, user_index)

        let eventEmitter = new EventEmitter()
        let first_user = avatars_info.First
        let promise = new Promise((resolve) => {
            // resolve(5)
            eventEmitter.on("trigger", (event) => {
                // console.log(event)
                // console.log(indexes)
                let [worst, best] = event.split('/')
                // console.log(`[first_user] - ${first_user}`)
                // console.log(`[user_index] - ${user_index}`)
                if (first_user == user_index)
                    resolve(indexes[best])
                else
                    resolve(indexes[worst])
            })
        })

        // console.log(features)

        let ticket = this.PushEmitter(eventEmitter)

        let fetures_stringify = JSON.stringify(features)

        this.Send(ticket + "=" + fetures_stringify)

        return promise
    }


    Send(message) {
        this.sock.send(message)
    }


    PopEmitter(ticket) {
        if (this.map.has(ticket)) {
            let event_emitter = this.map.get(ticket)
            this.map.delete(ticket)
            return event_emitter
        }

        return null
    }


    PushEmitter(event_emitter) {
        let ticket = this.ticket++
        this.ticket = this.ticket % 100000000

        this.map.set(ticket, event_emitter)


        return ticket
    }
}



global.zmq = new ZMQ()





// ===========================================================



// let avatars_info =
//     [{ axe: 3, arrow: 1, helmet: 0, shield: 1, steal: 1, mark: 0, hp: 3, token: 15 },
//     { axe: 3, arrow: 0, helmet: 1, shield: 0, steal: 0, mark: 1, hp: 4, token: 8 },
//     { first: 0, turn: 3 }]


let feature = {
    "HP-0" : 13,
    "Token-0" : 6,
    "Weapon-0" : [1, 2, 0, 0, 0],
    "Mark-0" : 2,
    "Card-0" : [0, 3, 14],
    "HP-1" : 6,
    "Token-1" : 15,
    "Weapon-1" : [0, 2, 1, 0, 0],
    "Mark-1" : 3,
    "Card-1" : [0, 3, 14],
    "Round" : 2,
    "First" : 0
}


let dices_dir = ['bottom', 'left', null, null, "top", null]

let user_index = 1


function UnitTest() {
    let zmq = new ZMQ()

    for (let i = 0; i < 1; i++) {
        let info = JSON.parse(JSON.stringify(feature))
        // info["HP-0"] = ((i + 8) % 13) + 1



        let promise = zmq.Request_DicePick(info, dices_dir, user_index)

        promise.then((resolve) => {
            console.log("hello world~~!!")
            console.log(resolve)
        })
    }
}

// UnitTest()



