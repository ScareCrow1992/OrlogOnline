import operation from "./operation.js"
import Redbird from "./Redbird_Agent.js"
// import axios from "axios";
import { Random } from "random-js";

const random = new Random();

class SocketAdapter{
    constructor(uid, index){
        this.uid = uid
        this.index = index
        this.redBird = null
        this.target_socket = null
    }


    send(data){
        this.target_socket.onMessage(data)
    }


    onMessage(data) {
        // console.log(`[SocketAdapter - ${this.uid}]`)
        // console.log(typeof data)
        // console.log(data)
        if (this.redBird != null)
            this.redBird.Transport(data, this.index)
    }

}


export default class Agent {
    constructor(uid, callback, socket_, force_sync, machine_){
        this.uid = uid

        this.isAgent = true

        this.callback = callback
        this.index = 1

        this.godfavor_extra_input;
        this.disposable_time = 0
        this.acc_time = 0
        this.sleeping_time = 0

        this.godFavors = []

        this.machine = machine_

        if(force_sync != null){
            this.force_sync_situation = force_sync.situaiton
            this.force_sync_depth = force_sync.depth
        }
        else{
            this.force_sync_situation = null
            this.force_sync_depth = 0
        }


        this.gameover = false

        this.state = "play"
        this.game_mode = "liberty"

        this.matching_socket = socket_
        this.redbird = new Redbird()

        this.redbird.controller = this
        this.redbird.socket = socket_

        this.matching_socket.partnerbird = this.redbird

        this.logs = {
            "roll" : {
                "state" : [],
                "action" : [],
                "value" : [],
                "mask" : []
            },
            "godfavor" : {
                "state" : [],
                "action" : [],
                "value" : [],
                "mask" : []
            }
        }
        this.win = undefined

        this.order = null


        this.scores = [0,0,0]   // win, lose, draw

        
        // this.matching_socket.onmessage = (msg) => {
        //     let data = msg.data

        //     this.redbird.Transport(data)

        //     return;
        // }

    }

    MessageEnqueue(func, params) {
        let msg = operation.call(this, func, params, this.index)

        if (func == "RollDices" || func == "RollDices" || func == "SelectGodFavorPower") {
            // console.log(msg)
            if (msg != null) {
                msg.then((res) => {
                    this.SendMessage(func, res[0], res[1])
                })
            }
        }
        else {
            if (func == "NeedSwap") {
                this.index = 0
            }
            else if (func == "GameOver") {
                // this.gameserver_socket.close()
                // console.log("GameOver")
                // console.log(params[1])
                // console.log(this.logs.length)

                // console.log(this.logs.roll.state.length)
                // console.log(this.logs.roll.action.length)
                // console.log(this.logs.godfavor.state.length)
                // console.log(this.logs.godfavor.action.length)

                // let length_ = this.logs.roll.state.length
                // for (let i = 0; i < length_; i++) {
                //     console.log(this.logs.roll.state[i])
                //     console.log(this.logs.roll.action[i])
                // }


                // length_ = this.logs.godfavor.state.length
                // for (let i = 0; i < length_; i++) {
                //     console.log(this.logs.godfavor.state[i])
                //     console.log(this.logs.godfavor.action[i])
                // }


                this.gameover = true
                this.win = undefined
                // console.log("msg : ", msg)
                if(msg === this.index)
                    this.win = true
                else
                    this.win = false
                this.score = params[1]
                // console.log(score)
                this.callback(this.uid, this.win, params[1])
                // this.GameEnd()
            }

            else if (msg != null) {
                // console.log(`[[ ${func} ]]  ${this.acc_time}`)
                // this.redbird.MessageEnqueue(msg[0], msg[1])
                this.SendMessage(func, msg[0], msg[1])
            }
        }
    }


    SendMessage(func, operation, params) {
        if(this.gameover == true){
            return;
        }


        this.redbird.MessageEnqueue(operation, params)
    }


}