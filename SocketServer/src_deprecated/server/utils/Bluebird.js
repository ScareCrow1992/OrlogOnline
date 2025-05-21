// server side

import Timer from "./timer.js"
import Guardian from "./Guardian.js"

// let i = 0;

export default class Bluebird {
    constructor() {
        this.topsocket
        this.bottomsocket
        this.sockets = []

        this.messageQueue = [];
        this.state = true;
        this.flag = [false, false]

        this.game
        this.timer = new Timer()
        this.acc_time = 0

    }


    Initialize0(topSocket, bottomSocket){
        this.topsocket = topSocket
        this.bottomsocket = bottomSocket
        this.sockets = [topSocket, bottomSocket]
    }


    Initialize1(game){
        this.topsocket.game = game
        this.bottomsocket.game = game

        this.game = game;
        this.timer.game = game
        this.timer.blueBird = this
        this.guardian = new Guardian(this.game)
    }
    

    // 송신 (to Controller)
    MessageEnqueue(func, params, user = null) {
        // console.log(func)

        let timer = 0
        if (global.config.need_timer_cmds.includes(func))
            timer = global.config.limited_time[`${func}`]

        let data = JSON.stringify([func, params, timer])

        if(func == "GameOver"){
            this.Send(data)
            return;
        }

        let needSync = false;

        if(global.config.need_sync_cmds.includes(func)
        || global.config.need_timer_cmds.includes(func)){
            needSync = true;
        }

        // console.log(`enqueue : ${func}`)

        this.messageQueue.push({ needSync: needSync, data: data, user : user })

        if (this.state)
            this.MessageDequeue()

    }


    MessageDequeue() {
        if (!this.state || this.messageQueue.length == 0)
            return


        if (this.messageQueue[0].needSync == true) {
            this.messageQueue[0].needSync = false
            let checkdata = JSON.stringify(["CheckReady", [], 0])
            // this.topsocket.send(checkdata)
            // this.bottomsocket.send(checkdata)

            this.Send(checkdata)

            this.flag[0] = false;
            this.flag[1] = false;
            this.state = false;

            this.timer.BeginSync(this.acc_time)

        }
        else {
            let msg = this.messageQueue.shift()

            let obj = JSON.parse(msg.data)
            let user = JSON.parse(msg.user)

            let func = obj[0]
            let params = obj[1]


            // console.log(`dequeue : ${func} , (${i++})`)
            this.timer.Check(func)

            this.guardian.Set(func)
            
            let own_animation_time_funcs = global.config.animation_time
            if (Object.prototype.hasOwnProperty.call(own_animation_time_funcs, func)) {
                let animation_time = 0
                if (func == "DiceBattle")
                    animation_time += global.config.animation_time["DiceBattle"](params[0])
                else
                    animation_time += global.config.animation_time[`${func}`]

                // console.log(`[ ${func} ] :: acc time ( ${this.acc_time} ) + animation time ( ${animation_time} )` )
                this.acc_time += animation_time
            }

            // this.topsocket.send(data.data)
            // this.bottomsocket.send(data.data)
            this.Send(msg.data, user)

            this.MessageDequeue()
        }
    }


    BellPush(user_indexes){
        let data = JSON.stringify(["BellPush", []])
        // console.log(this.flag)

        if (user_indexes[0])
            this.topsocket.send(data)

        if (user_indexes[1])
            this.bottomsocket.send(data)

        if(this.game.isOver === false){


        }


    }



    Send(data, user = null) {
        let msg = {
            type : "send",
            data : data,
            user : user
        }
        
        // this.game.PushMsgLog(msg)

        if (user == null || user == 0)
            this.topsocket.send(data)

        if (user == null || user == 1)
            this.bottomsocket.send(data)

    }



    WorkComplete(user) {
        this.flag[Number(user)] = true;

        if (this.flag[0] && this.flag[1]) {
            this.state = true
            this.flag[0] = false
            this.flag[1] = false

            this.timer.CompleteSync()
            this.acc_time = 0
            this.MessageDequeue()
        }

    }


    Transport(data, playerIndex) {
        // console.log(playerIndex)
        playerIndex = playerIndex % 2
        // console.log(data)
        let parsedData = JSON.parse(data)
        let obj = {
            func: parsedData[0],
            params: parsedData[1]
        }

        // if (obj.func == "ExtraInputBegin")
        // console.log(obj.params)


        if (obj.func == "CheckReady") {
            this.WorkComplete(playerIndex)
        }
        else {

            if (obj.func === "BellPushed"/* && obj.params[0] === "client"*/) {
                obj.params[0] = playerIndex
            }

            // console.log(`[[ Guardian ]] : ${filter_ret}`)
            let msg = {
                type: "recv",
                data: data,
                user : playerIndex
            }

            let filter_ret = this.guardian.Filter(obj.func, obj.params)

            if (filter_ret) {
                let ret = this.game.MessageEnqueue(obj.func, obj.params)
                if(ret){
                    // console.log("message push")
                    // this.game.PushMsgLog(msg)
                }
            }
            else{
                console.log("[[RED]] wrong input is received!")
                this.game.AlertStop(playerIndex)
            }

            // let receivedUserIndex = obj.params[obj.params.length - 1]
        }


    }
}